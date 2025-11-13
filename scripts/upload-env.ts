#!/usr/bin/env tsx

/**
 * 上传环境变量到 GitHub
 * 
 * 特性:
 * - ✅ 并发控制 (默认 6 个)
 * - ✅ 自动重试 (默认 3 次)
 * - ✅ 清晰的进度显示
 * - ✅ 彩色输出
 * - ✅ 错误汇总
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ============================================================================
// 配置
// ============================================================================

interface Config {
  envName: string;
  varsFile: string;
  secretsFile: string;
  repo: string;
  maxConcurrency: number;
  maxRetries: number;
  retryDelay: number; // ms
}

// ============================================================================
// 工具函数
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message: string) {
  log(`✓ ${message}`, colors.green);
}

function logError(message: string) {
  log(`✗ ${message}`, colors.red);
}

function logInfo(message: string) {
  log(`ℹ ${message}`, colors.cyan);
}

function logWarn(message: string) {
  log(`⚠ ${message}`, colors.yellow);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// GitHub API 封装
// ============================================================================

async function execGh(args: string[]): Promise<string> {
  try {
    const result = execSync(`gh ${args.join(' ')}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch (error: any) {
    throw new Error(error.stderr || error.message);
  }
}

async function setVariable(
  key: string,
  value: string,
  config: Config,
  attempt: number = 1
): Promise<void> {
  try {
    await execGh([
      'variable',
      'set',
      `"${key}"`,
      '--env',
      config.envName,
      '--repo',
      config.repo,
      '--body',
      `"${value}"`,
    ]);
  } catch (error: any) {
    if (attempt < config.maxRetries) {
      logWarn(
        `Variable ${key} 失败 (尝试 ${attempt}/${config.maxRetries})，${config.retryDelay}ms 后重试...`
      );
      await sleep(config.retryDelay);
      return setVariable(key, value, config, attempt + 1);
    }
    throw new Error(`Failed after ${config.maxRetries} attempts: ${error.message}`);
  }
}

async function setSecret(
  key: string,
  value: string,
  config: Config,
  attempt: number = 1
): Promise<void> {
  try {
    await execGh([
      'secret',
      'set',
      `"${key}"`,
      '--env',
      config.envName,
      '--repo',
      config.repo,
      '--body',
      `"${value}"`,
    ]);
  } catch (error: any) {
    if (attempt < config.maxRetries) {
      logWarn(
        `Secret ${key} 失败 (尝试 ${attempt}/${config.maxRetries})，${config.retryDelay}ms 后重试...`
      );
      await sleep(config.retryDelay);
      return setSecret(key, value, config, attempt + 1);
    }
    throw new Error(`Failed after ${config.maxRetries} attempts: ${error.message}`);
  }
}

// ============================================================================
// 并发控制
// ============================================================================

class ConcurrencyLimiter {
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(private max: number) {}

  async run<T>(fn: () => Promise<T>): Promise<T> {
    while (this.running >= this.max) {
      await new Promise<void>(resolve => this.queue.push(resolve));
    }

    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

// ============================================================================
// ENV 文件解析
// ============================================================================

interface EnvEntry {
  key: string;
  value: string;
}

function parseEnvFile(filePath: string): EnvEntry[] {
  if (!existsSync(filePath)) {
    return [];
  }

  const content = readFileSync(filePath, 'utf-8');
  const entries: EnvEntry[] = [];

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    // 跳过空行和注释
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) continue;

    const key = trimmed.substring(0, equalIndex).trim();
    const value = trimmed.substring(equalIndex + 1).trim();

    if (key) {
      entries.push({ key, value });
    }
  }

  return entries;
}

// ============================================================================
// 主逻辑
// ============================================================================

async function uploadEntries(
  entries: EnvEntry[],
  type: 'variable' | 'secret',
  config: Config,
  limiter: ConcurrencyLimiter
): Promise<{ success: string[]; failed: Map<string, string> }> {
  const success: string[] = [];
  const failed = new Map<string, string>();
  const total = entries.length;
  let completed = 0;

  log(`\n${'='.repeat(80)}`, colors.cyan);
  log(
    `上传 ${type === 'variable' ? 'Variables' : 'Secrets'} (${total} 个, 并发 ${config.maxConcurrency})`,
    colors.bright
  );
  log('='.repeat(80), colors.cyan);

  const tasks = entries.map(({ key, value }) =>
    limiter.run(async () => {
      const displayValue =
        type === 'secret'
          ? `${value.substring(0, 10)}...` // 隐藏 secret 值
          : value.length > 50
          ? `${value.substring(0, 47)}...`
          : value;

      try {
        log(`  [${++completed}/${total}] ${key} = ${displayValue}`, colors.gray);

        if (type === 'variable') {
          await setVariable(key, value, config);
        } else {
          await setSecret(key, value, config);
        }

        logSuccess(`  [${completed}/${total}] ${key}`);
        success.push(key);
      } catch (error: any) {
        logError(`  [${completed}/${total}] ${key}: ${error.message}`);
        failed.set(key, error.message);
      }
    })
  );

  await Promise.all(tasks);

  return { success, failed };
}

async function main() {
  const startTime = Date.now();

  // 解析参数
  const envName = process.argv[2] || 'testing';
  const varsFile = process.argv[3] || '.github/envs/testing.env';
  const secretsFile = process.argv[4] || '.github/envs/testing.secrets.env';

  log('\n🚀 GitHub 环境变量上传工具\n', colors.bright + colors.cyan);

  // 检查 gh CLI
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch {
    logError('gh CLI 未安装，请先安装: brew install gh');
    process.exit(1);
  }

  // 获取仓库信息
  let repo: string;
  try {
    repo = execSync('gh repo view --json nameWithOwner -q .nameWithOwner', {
      encoding: 'utf-8',
    }).trim();
  } catch {
    logError('未检测到有效的 GitHub 仓库，请在仓库根目录执行或运行 gh auth login');
    process.exit(1);
  }

  const config: Config = {
    envName,
    varsFile,
    secretsFile,
    repo,
    maxConcurrency: parseInt(process.env.MAX_PROCS || '6'),
    maxRetries: 3,
    retryDelay: 1000,
  };

  // 显示配置
  logInfo(`仓库: ${repo}`);
  logInfo(`环境: ${envName}`);
  logInfo(`Variables 文件: ${varsFile}`);
  logInfo(`Secrets 文件: ${secretsFile}`);
  logInfo(`最大并发: ${config.maxConcurrency}`);
  logInfo(`重试次数: ${config.maxRetries}`);

  // 确保环境存在
  log('\n创建/确认环境...', colors.cyan);
  try {
    execSync(
      `gh api -X PUT "repos/${repo}/environments/${envName}" -F wait_timer=0`,
      { stdio: 'ignore' }
    );
    logSuccess('环境已准备就绪');
  } catch (error: any) {
    logError(`创建环境失败: ${error.message}`);
    process.exit(1);
  }

  // 解析文件
  const variables = parseEnvFile(varsFile);
  const secrets = parseEnvFile(secretsFile);

  if (variables.length === 0 && secrets.length === 0) {
    logWarn('没有找到需要上传的环境变量或密钥');
    return;
  }

  const limiter = new ConcurrencyLimiter(config.maxConcurrency);

  // 上传 Variables
  let varResults = { success: [] as string[], failed: new Map<string, string>() };
  if (variables.length > 0) {
    varResults = await uploadEntries(variables, 'variable', config, limiter);
  } else {
    logWarn(`\n跳过 Variables (文件不存在或为空: ${varsFile})`);
  }

  // 上传 Secrets
  let secretResults = { success: [] as string[], failed: new Map<string, string>() };
  if (secrets.length > 0) {
    secretResults = await uploadEntries(secrets, 'secret', config, limiter);
  } else {
    logWarn(`\n跳过 Secrets (文件不存在或为空: ${secretsFile})`);
  }

  // 汇总结果
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log(`\n${'='.repeat(80)}`, colors.cyan);
  log('📊 上传结果汇总', colors.bright);
  log('='.repeat(80), colors.cyan);

  log(`\nVariables:`, colors.bright);
  logSuccess(`  成功: ${varResults.success.length}/${variables.length}`);
  if (varResults.failed.size > 0) {
    logError(`  失败: ${varResults.failed.size}/${variables.length}`);
    varResults.failed.forEach((error, key) => {
      log(`    - ${key}: ${error}`, colors.red + colors.dim);
    });
  }

  log(`\nSecrets:`, colors.bright);
  logSuccess(`  成功: ${secretResults.success.length}/${secrets.length}`);
  if (secretResults.failed.size > 0) {
    logError(`  失败: ${secretResults.failed.size}/${secrets.length}`);
    secretResults.failed.forEach((error, key) => {
      log(`    - ${key}: ${error}`, colors.red + colors.dim);
    });
  }

  log(`\n⏱  耗时: ${duration}s`, colors.gray);

  // 如果有失败的，提示如何查看
  const totalFailed = varResults.failed.size + secretResults.failed.size;
  if (totalFailed > 0) {
    log(`\n${'='.repeat(80)}`, colors.yellow);
    logWarn(`有 ${totalFailed} 个项目上传失败，请检查错误信息`);
    logInfo('可以重新运行脚本自动重试失败的项目');
    log('='.repeat(80), colors.yellow);
    process.exit(1);
  }

  // 成功提示
  log(`\n${'='.repeat(80)}`, colors.green);
  logSuccess('✨ 所有环境变量和密钥已成功上传！');
  log('='.repeat(80), colors.green);

  log(`\n查看已上传的配置:`, colors.cyan);
  log(`  gh variable list --env ${envName} --repo ${repo}`, colors.gray);
  log(`  gh secret list --env ${envName} --repo ${repo}`, colors.gray);

  log('');
}

// 运行
main().catch((error) => {
  logError(`\n❌ 发生错误: ${error.message}`);
  process.exit(1);
});
