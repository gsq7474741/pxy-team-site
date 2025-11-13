import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Strapi Webhook 按需重新验证 API
 * 
 * 当 Strapi CMS 中的内容更新时，会调用此 API 来清除 Next.js 缓存
 * 
 * 使用方法：
 * POST /api/revalidate?secret=your-secret-key
 * 
 * Body (可选):
 * {
 *   "model": "news" | "research-area" | "member" | "publication" | "opening" | "contact-page",
 *   "entry": { "id": 123, "slug": "xxx" }
 * }
 */

// 内容类型到路径的映射
const MODEL_PATH_MAP: Record<string, (entry?: any) => string[]> = {
  // 新闻 - 重新验证新闻列表和详情页
  'news': (entry) => {
    const paths = ['/', '/news'];
    if (entry?.id) {
      paths.push(`/news/${entry.id}`);
    }
    return paths;
  },
  
  // 研究方向 - 重新验证首页、研究方向列表和详情页
  'research-area': (entry) => {
    const paths = ['/', '/research'];
    if (entry?.slug) {
      paths.push(`/research/${entry.slug}`);
    }
    return paths;
  },
  
  // 团队成员 - 重新验证团队成员列表和详情页
  'member': (entry) => {
    const paths = ['/members'];
    if (entry?.slug) {
      paths.push(`/members/${entry.slug}`);
    }
    return paths;
  },
  
  // 论文/专利/奖项 - 重新验证成果概览页面
  'publication': () => ['/publications'],
  'patent': () => ['/publications'],
  'award': () => ['/publications'],
  
  // 招聘信息 - 重新验证加入我们页面
  'opening': () => ['/join'],
  
  // 联系页面 - 重新验证联系我们页面
  'contact-page': () => ['/contact'],
};

export async function POST(request: NextRequest) {
  try {
    // 1. 验证密钥（安全措施）
    const secret = request.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret) {
      console.error('[Revalidate] REVALIDATE_SECRET 环境变量未设置');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Server configuration error' 
        }, 
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.warn('[Revalidate] 无效的密钥尝试');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid token' 
        }, 
        { status: 401 }
      );
    }

    // 2. 解析请求体
    let body: any = {};
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch (e) {
      console.warn('[Revalidate] 无法解析请求体，将重新验证所有路径');
    }

    const { model, entry } = body;

    console.log('[Revalidate] 收到重新验证请求:', { 
      model, 
      entryId: entry?.id, 
      entrySlug: entry?.slug 
    });

    // 3. 根据模型类型重新验证相应路径
    let revalidatedPaths: string[] = [];

    if (model && MODEL_PATH_MAP[model]) {
      // 重新验证特定模型的路径
      const paths = MODEL_PATH_MAP[model](entry);
      
      for (const path of paths) {
        try {
          revalidatePath(path);
          revalidatedPaths.push(path);
          console.log(`[Revalidate] ✓ 已重新验证: ${path}`);
        } catch (error) {
          console.error(`[Revalidate] ✗ 重新验证失败: ${path}`, error);
        }
      }
    } else {
      // 如果没有指定模型或模型不在映射中，重新验证所有主要页面
      const allPaths = ['/', '/news', '/research', '/members', '/publications', '/join', '/contact'];
      
      for (const path of allPaths) {
        try {
          revalidatePath(path);
          revalidatedPaths.push(path);
          console.log(`[Revalidate] ✓ 已重新验证: ${path}`);
        } catch (error) {
          console.error(`[Revalidate] ✗ 重新验证失败: ${path}`, error);
        }
      }
    }

    // 4. 返回成功响应
    return NextResponse.json({
      success: true,
      revalidated: true,
      paths: revalidatedPaths,
      timestamp: new Date().toISOString(),
      model: model || 'all',
      message: `成功重新验证 ${revalidatedPaths.length} 个路径`
    });

  } catch (error) {
    console.error('[Revalidate] 处理重新验证请求时出错:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// 健康检查端点
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { message: 'Invalid token' }, 
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Revalidate API is working',
    timestamp: new Date().toISOString(),
    supportedModels: Object.keys(MODEL_PATH_MAP)
  });
}
