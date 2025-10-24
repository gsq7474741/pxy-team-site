/**
 * 自定义阿里云 OSS Upload Provider for Strapi v5
 * TypeScript 实现
 */

import OSS from 'ali-oss';

interface ProviderConfig {
  accessKeyId: string;
  accessKeySecret: string;
  region: string;
  bucket: string;
  uploadPath?: string;
  baseUrl?: string;
  timeout?: number;
  secure?: boolean;
  internal?: boolean;
  bucketParams?: {
    ACL?: 'public-read' | 'private';
    signedUrlExpires?: number;
  };
}

interface StrapiFile {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  buffer?: Buffer;
  stream?: any;
  url?: string;
  provider?: string;
  provider_metadata?: any;
  path?: string;
}

interface ProviderInstance {
  isPrivate: () => boolean;
  getSignedUrl: (file: StrapiFile) => Promise<{ url: string }>;
  upload: (file: StrapiFile) => Promise<void>;
  uploadStream: (file: StrapiFile) => Promise<void>;
  delete: (file: StrapiFile) => Promise<void>;
}

export default {
  init(config: ProviderConfig): ProviderInstance {
    console.log('🚀 [Custom OSS Provider] 初始化 OSS provider...');
    console.log('🚀 [Custom OSS Provider] Region:', config.region);
    console.log('🚀 [Custom OSS Provider] Bucket:', config.bucket);
    console.log('🚀 [Custom OSS Provider] Upload Path:', config.uploadPath);
    console.log('🚀 [Custom OSS Provider] Base URL:', config.baseUrl);

    // 创建 OSS 客户端
    const client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      timeout: config.timeout || 60000,
      secure: config.secure !== false,
      internal: config.internal === true,
    });

    console.log('✅ [Custom OSS Provider] OSS 客户端创建成功');

    return {
      /**
       * 检查是否为私有存储
       */
      isPrivate(): boolean {
        return config.bucketParams?.ACL === 'private';
      },

      /**
       * 获取签名 URL（用于私有文件访问）
       */
      async getSignedUrl(file: StrapiFile): Promise<{ url: string }> {
        console.log('🔐 [Custom OSS Provider] 获取签名 URL:', file.name);
        
        const path = config.uploadPath ? `${config.uploadPath}/` : '';
        const fileName = `${file.hash}${file.ext}`;
        const fullPath = `${path}${fileName}`;

        try {
          const signedUrl = await client.signatureUrl(fullPath, {
            expires: config.bucketParams?.signedUrlExpires || 1800,
          });

          console.log('✅ [Custom OSS Provider] 签名 URL 生成成功');
          return { url: signedUrl };
        } catch (error) {
          console.error('❌ [Custom OSS Provider] 签名 URL 生成失败:', error);
          throw error;
        }
      },

      /**
       * 上传文件（主方法）
       */
      async upload(file: StrapiFile): Promise<void> {
        console.log('📤 [Custom OSS Provider] 开始上传文件...');
        console.log('📤 [Custom OSS Provider] 文件名:', file.name);
        console.log('📤 [Custom OSS Provider] Hash:', file.hash);
        console.log('📤 [Custom OSS Provider] 大小:', file.size, 'bytes');
        console.log('📤 [Custom OSS Provider] MIME:', file.mime);

        const path = config.uploadPath ? `${config.uploadPath}/` : '';
        const fileName = `${file.hash}${file.ext}`;
        const fullPath = `${path}${fileName}`;

        console.log('📤 [Custom OSS Provider] OSS 路径:', fullPath);

        try {
          // 准备上传内容
          const fileBuffer = file.buffer || Buffer.from(file.stream);
          
          // 上传到 OSS
          const result = await client.put(fullPath, fileBuffer, {
            headers: {
              'Content-Type': file.mime,
            },
            timeout: config.timeout || 60000,
          });

          console.log('✅ [Custom OSS Provider] OSS 上传成功!');
          console.log('✅ [Custom OSS Provider] OSS 返回:', {
            name: result.name,
            url: result.url,
            res: {
              status: result.res.status,
              statusCode: result.res.statusCode,
            }
          });

          // 设置文件 URL
          if (config.baseUrl) {
            const baseUrl = config.baseUrl.replace(/\/$/, '');
            const name = (result.name || '').replace(/^\//, '');
            file.url = `${baseUrl}/${name}`;
          } else {
            file.url = result.url;
          }

          console.log('✅ [Custom OSS Provider] 最终 URL:', file.url);

          // 设置 provider 信息
          file.provider = 'custom-oss';
          file.provider_metadata = {
            uploadPath: fullPath,
            ossUrl: result.url,
            region: config.region,
            bucket: config.bucket,
          };

        } catch (error) {
          console.error('❌ [Custom OSS Provider] 上传失败!');
          console.error('❌ [Custom OSS Provider] 错误信息:', (error as Error).message);
          console.error('❌ [Custom OSS Provider] 错误详情:', error);
          throw error;
        }
      },

      /**
       * 上传文件流
       */
      async uploadStream(file: StrapiFile): Promise<void> {
        console.log('📤 [Custom OSS Provider] uploadStream 调用，转发到 upload');
        return this.upload(file);
      },

      /**
       * 删除文件
       */
      async delete(file: StrapiFile): Promise<void> {
        console.log('🗑️  [Custom OSS Provider] 删除文件:', file.name);
        
        const path = config.uploadPath ? `${config.uploadPath}/` : '';
        const fileName = `${file.hash}${file.ext}`;
        const fullPath = `${path}${fileName}`;

        console.log('🗑️  [Custom OSS Provider] OSS 路径:', fullPath);

        try {
          const result = await client.delete(fullPath);
          
          if (result.res && /2[0-9]{2}/.test(String(result.res.statusCode))) {
            console.log('✅ [Custom OSS Provider] 删除成功');
          } else {
            console.warn('⚠️  [Custom OSS Provider] 删除返回非 2xx 状态码:', result.res?.statusCode);
          }
        } catch (error) {
          console.error('❌ [Custom OSS Provider] 删除失败:', (error as Error).message);
          throw error;
        }
      },
    };
  },
};
