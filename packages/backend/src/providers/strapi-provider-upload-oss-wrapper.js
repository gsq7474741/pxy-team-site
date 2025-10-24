// Wrapper for strapi-provider-upload-oss to ensure compatibility with Strapi v5
'use strict';

const ossProvider = require('strapi-provider-upload-oss');

console.log('🔍 [OSS Provider Wrapper] 加载 OSS provider...');
console.log('🔍 [OSS Provider Wrapper] Provider 类型:', typeof ossProvider);
console.log('🔍 [OSS Provider Wrapper] Provider keys:', Object.keys(ossProvider));
console.log('🔍 [OSS Provider Wrapper] Has init?:', typeof ossProvider.init);
console.log('🔍 [OSS Provider Wrapper] Has default?:', typeof ossProvider.default);

// 如果是 ES6 模块导出，使用 default
const provider = ossProvider.default || ossProvider;

console.log('🔍 [OSS Provider Wrapper] Final provider:', typeof provider);
console.log('🔍 [OSS Provider Wrapper] Final provider keys:', Object.keys(provider));
console.log('🔍 [OSS Provider Wrapper] Final has init?:', typeof provider.init);

module.exports = provider;
