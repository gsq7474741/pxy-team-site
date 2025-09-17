#!/usr/bin/env node

/**
 * Strapi 客户端测试脚本
 * 用于验证 Strapi API 连接和数据获取功能
 */

const { newsApi } = require('../lib/strapi-client');

async function testStrapiClient() {
  console.log('🚀 开始测试 Strapi 客户端...\n');

  try {
    // 测试 1: API 连接测试
    console.log('📡 测试 1: API 连接测试');
    const connectionTest = await newsApi.testConnection();
    if (connectionTest) {
      console.log('✅ API 连接测试成功\n');
    } else {
      console.log('❌ API 连接测试失败\n');
      return;
    }

    // 测试 2: 获取新闻列表
    console.log('📰 测试 2: 获取新闻列表');
    const newsList = await newsApi.getNewsList(1, 5);
    console.log(`✅ 成功获取 ${newsList.data.length} 条新闻`);
    console.log('新闻列表预览:');
    newsList.data.forEach((news, index) => {
      console.log(`  ${index + 1}. ${news.title} (ID: ${news.id})`);
    });
    console.log('');

    // 测试 3: 获取新闻详情
    if (newsList.data.length > 0) {
      console.log('📖 测试 3: 获取新闻详情');
      const firstNewsId = newsList.data[0].id;
      const newsDetail = await newsApi.getNewsById(firstNewsId);
      console.log(`✅ 成功获取新闻详情: ${newsDetail.title}`);
      console.log(`   发布日期: ${newsDetail.publishDate}`);
      console.log(`   内容长度: ${newsDetail.content.length} 字符`);
      console.log(`   封面图片: ${newsDetail.coverImage ? '有' : '无'}`);
      console.log('');
    }

    console.log('🎉 所有测试通过！Strapi 客户端工作正常。');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

// 运行测试
if (require.main === module) {
  testStrapiClient();
}

module.exports = { testStrapiClient };
