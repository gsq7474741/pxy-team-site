export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': [
            "'self'", 
            'https:', 
            `${env('OSS_BUCKET')}.${env('OSS_REGION')}.aliyuncs.com`,
            `${env('OSS_BASE_URL')}`,
          ],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            // 添加你的 OSS 域名
            `${env('OSS_BUCKET')}.${env('OSS_REGION')}.aliyuncs.com`,
            `${env('OSS_BASE_URL')}`,
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            // 添加你的 OSS 域名
            `${env('OSS_BUCKET')}.${env('OSS_REGION')}.aliyuncs.com`,
            `${env('OSS_BASE_URL')}`,
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
