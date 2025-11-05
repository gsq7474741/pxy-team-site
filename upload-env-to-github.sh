#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./upload-env-to-github.sh [ENV_NAME] [ENV_FILE_VARS] [ENV_FILE_SECRETS]
# Defaults:
#   ENV_NAME        = testing
#   ENV_FILE_VARS   = .github/envs/testing.env
#   ENV_FILE_SECRETS= .github/envs/testing.secrets.env
# Requires:
#   - gh CLI installed and logged in: gh auth login
#   - run inside a git repository of the target GitHub repo

ENV_NAME="${1:-testing}"
ENV_FILE_VARS="${2:-.github/envs/testing.env}"
ENV_FILE_SECRETS="${3:-.github/envs/testing.secrets.env}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI 未安装，请先安装：brew install gh" >&2
  exit 1
fi

# Ensure we are in a git repo with a remote that gh can resolve
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)"
if [ -z "${REPO}" ]; then
  echo "未检测到有效的 GitHub 仓库上下文，请在仓库根目录执行，或 gh auth login" >&2
  exit 1
fi

echo "GitHub repo: ${REPO}"
echo "Environment: ${ENV_NAME}"
echo "Vars file: ${ENV_FILE_VARS}"
echo "Secrets file: ${ENV_FILE_SECRETS}"
MAX_PROCS="${MAX_PROCS:-6}"

# Create/ensure environment exists
# Use -F to send integer for wait_timer
gh api -X PUT "repos/${REPO}/environments/${ENV_NAME}" -F wait_timer=0 >/dev/null

echo "[1/2] 上传 Environment Variables（并行，最大并发 ${MAX_PROCS}）..."
if [ -f "${ENV_FILE_VARS}" ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    # skip blanks and comments
    [ -z "${line}" ] && continue
    [[ "${line}" =~ ^# ]] && continue
    KEY="${line%%=*}"
    VAL="${line#*=}"
    KEY="$(echo -n "${KEY}" | xargs)"
    # allow empty values (will set empty variable)
    # 限流并并行执行：直接使用 --body 传值，避免 '-' 被当作字面量
    while [ "$(jobs -pr | wc -l | tr -d ' ')" -ge "${MAX_PROCS}" ]; do sleep 0.1; done
    (
      echo "  Setting variable: ${KEY} | ${VAL}"
      gh variable set "${KEY}" --env "${ENV_NAME}" --repo "${REPO}" --body "${VAL}" \
        && echo "  ✓ Variable: ${KEY}" \
        || echo "  ✗ Variable: ${KEY} 设置失败"
    ) &
  done < "${ENV_FILE_VARS}"
else
  echo "变量文件不存在，跳过: ${ENV_FILE_VARS}"
fi

echo "[2/2] 上传 Environment Secrets（并行，最大并发 ${MAX_PROCS}）..."
if [ -f "${ENV_FILE_SECRETS}" ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    # skip blanks and comments
    [ -z "${line}" ] && continue
    [[ "${line}" =~ ^# ]] && continue
    KEY="${line%%=*}"
    VAL="${line#*=}"
    KEY="$(echo -n "${KEY}" | xargs)"
    # 限流并并行执行：直接使用 --body 传值，避免 '-' 被当作字面量
    while [ "$(jobs -pr | wc -l | tr -d ' ')" -ge "${MAX_PROCS}" ]; do sleep 0.1; done
    (
      echo "  Setting secret: ${KEY} | ${VAL}"
      gh secret set "${KEY}" --env "${ENV_NAME}" --repo "${REPO}" --body "${VAL}" \
        && echo "  ✓ Secret: ${KEY}" \
        || echo "  ✗ Secret: ${KEY} 设置失败"
    ) &
  done < "${ENV_FILE_SECRETS}"
else
  echo "密钥文件不存在，跳过: ${ENV_FILE_SECRETS}"
fi

# 等待所有后台任务完成
echo "等待所有上传任务完成..."
wait

echo "完成。可用以下命令查看："
echo "  gh variable list --env ${ENV_NAME} --repo ${REPO}"
echo "  gh secret list   --env ${ENV_NAME} --repo ${REPO}"
