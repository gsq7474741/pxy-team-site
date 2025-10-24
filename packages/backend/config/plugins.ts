export default ({ env }) => {
  console.log('🔧 [Upload Config] 加载上传配置...');
  console.log('🔧 [Upload Config] OSS_ACCESS_KEY_ID:', env('OSS_ACCESS_KEY_ID') ? '已设置' : '未设置');
  console.log('🔧 [Upload Config] OSS_REGION:', env('OSS_REGION'));
  console.log('🔧 [Upload Config] OSS_BUCKET:', env('OSS_BUCKET'));
  console.log('🔧 [Upload Config] OSS_BASE_URL:', env('OSS_BASE_URL'));

  return {
    upload: {
      config: {
        provider: 'strapi-provider-upload-custom-oss',
        providerOptions: {
          accessKeyId: env('OSS_ACCESS_KEY_ID'),
          accessKeySecret: env('OSS_ACCESS_KEY_SECRET'),
          region: env('OSS_REGION'),
          bucket: env('OSS_BUCKET'),
          uploadPath: env('OSS_UPLOAD_PATH', 'strapi'),
          baseUrl: env('OSS_BASE_URL'),
          timeout: env('OSS_TIMEOUT', '60000'),
          secure: env.bool('OSS_SECURE', true),
          internal: env.bool('OSS_INTERNAL', false),
          // 可选：设置文件访问权限
          bucketParams: {
            ACL: 'public-read', // 公开读取，如需私有访问改为 'private'
            signedUrlExpires: 60 * 60, // 签名 URL 过期时间（秒），仅在 ACL 为 private 时有效
          },
        },
        // 可选：文件大小限制（字节）
        sizeLimit: 250 * 1024 * 1024, // 250MB
        // 可选：响应式图片断点
        breakpoints: {
          xlarge: 1920,
          large: 1000,
          medium: 750,
          small: 500,
          xsmall: 64,
        },
      },
    },
  };
};
