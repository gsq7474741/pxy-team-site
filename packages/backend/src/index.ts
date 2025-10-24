// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: any) {
    const cfg = strapi?.config?.get?.('plugin::upload');
    console.log('🔎 [Bootstrap] upload config.provider =', cfg?.provider);
    const loadedProvider = strapi?.plugin('upload')?.provider;
    console.log('🔎 [Bootstrap] upload provider loaded:', loadedProvider ? 'yes' : 'no');
    if (loadedProvider) {
      console.log('🔎 [Bootstrap] upload provider methods:', Object.keys(loadedProvider));
    }

    try {
      const uploadSvc = strapi?.plugin('upload')?.service('upload');
      if (uploadSvc && typeof uploadSvc.upload === 'function') {
        const _upload = uploadSvc.upload.bind(uploadSvc);
        uploadSvc.upload = async (args: any, opts: any) => {
          try {
            const c = strapi?.config?.get?.('plugin::upload');
            console.log('🧩 [Hook] 调用 uploadSvc.upload(), 当前 config.provider =', c?.provider);
          } catch {}
          const res = await _upload(args, opts);
          try {
            const list = Array.isArray(res) ? res : [res];
            console.log('🧩 [Hook] uploadSvc.upload() 返回的 provider 列表 =', list.map((f: any) => f?.provider));
          } catch {}
          return res;
        };
      }

      const prov = strapi?.plugin('upload')?.provider;
      if (prov) {
        if (typeof prov.upload === 'function') {
          const _pUpload = prov.upload.bind(prov);
          prov.upload = async (file: any, options: any) => {
            console.log('➡️  [Hook] provider.upload 开始, name:', file?.name, 'hash:', file?.hash);
            const r = await _pUpload(file, options);
            console.log('⬅️  [Hook] provider.upload 结束, url:', file?.url, 'provider:', file?.provider);
            return r;
          };
        }
        if (typeof prov.uploadStream === 'function') {
          const _pUploadStream = prov.uploadStream.bind(prov);
          prov.uploadStream = async (file: any, options: any) => {
            console.log('➡️  [Hook] provider.uploadStream 开始, name:', file?.name, 'hash:', file?.hash);
            const r = await _pUploadStream(file, options);
            console.log('⬅️  [Hook] provider.uploadStream 结束, url:', file?.url, 'provider:', file?.provider);
            return r;
          };
        }
      }
    } catch (e) {
      console.warn('⚠️  [Bootstrap] hook upload/provider 失败:', (e as any)?.message || e);
    }
  },
};
