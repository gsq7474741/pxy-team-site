console.log('⚙️  [Upload Ext:TS] upload 插件扩展(typescript)已加载');

export default (plugin: any) => {
  // 标记是否加载
  console.log('⚙️  [Upload Ext:TS] plugin.services keys:', Object.keys(plugin?.services || {}));
  console.log('⚙️  [Upload Ext:TS] plugin.controllers keys:', Object.keys(plugin?.controllers || {}));

  // 包装 admin-upload 控制器，观察上传入口
  const adminCtrl = plugin?.controllers?.['admin-upload'];
  if (adminCtrl) {
    const _upload = adminCtrl.upload?.bind(adminCtrl);
    const _uploadFiles = adminCtrl.uploadFiles?.bind(adminCtrl);
    const _replaceFile = adminCtrl.replaceFile?.bind(adminCtrl);
    const _updateFileInfo = adminCtrl.updateFileInfo?.bind(adminCtrl);

    if (_upload) {
      adminCtrl.upload = async (ctx: any) => {
        console.log('🛎️  [Admin-Upload:TS] upload() 进入, has files:', !!ctx?.request?.files?.files);
        return _upload(ctx);
      };
    }
    if (_uploadFiles) {
      adminCtrl.uploadFiles = async (ctx: any) => {
        const files = ctx?.request?.files?.files;
        console.log('🛎️  [Admin-Upload:TS] uploadFiles() 进入, files type:', Array.isArray(files) ? 'array' : typeof files);
        return _uploadFiles(ctx);
      };
    }
    if (_replaceFile) {
      adminCtrl.replaceFile = async (ctx: any) => {
        console.log('🛎️  [Admin-Upload:TS] replaceFile() 进入');
        return _replaceFile(ctx);
      };
    }
    if (_updateFileInfo) {
      adminCtrl.updateFileInfo = async (ctx: any) => {
        console.log('🛎️  [Admin-Upload:TS] updateFileInfo() 进入');
        return _updateFileInfo(ctx);
      };
    }
  }
  if (plugin?.services?.provider) {
    const p = plugin.services.provider;
    const _upload = p.upload?.bind(p);
    const _uploadStream = p.uploadStream?.bind(p);
    const _delete = p.delete?.bind(p);
    const _checkFileSize = p.checkFileSize?.bind(p);

    if (_checkFileSize) {
      p.checkFileSize = async (file: any, opts: any) => {
        console.log('🧪 [Provider:TS] checkFileSize sizeLimit:', opts?.sizeLimit);
        return _checkFileSize(file, opts);
      };
    }

    if (_upload) {
      p.upload = async (file: any, opts: any) => {
        console.log('📦 [Provider:TS] upload 调用, name:', file?.name, 'mime:', file?.mime, 'size:', file?.size);
        const res = await _upload(file, opts);
        console.log('📦 [Provider:TS] upload 完成, url:', file?.url, 'provider:', file?.provider);
        return res;
      };
    }

    if (_uploadStream) {
      p.uploadStream = async (file: any, opts: any) => {
        console.log('🌊 [Provider:TS] uploadStream 调用, name:', file?.name, 'mime:', file?.mime, 'size:', file?.size);
        const res = await _uploadStream(file, opts);
        console.log('🌊 [Provider:TS] uploadStream 完成, url:', file?.url, 'provider:', file?.provider);
        return res;
      };
    }

    if (_delete) {
      p.delete = async (file: any, opts: any) => {
        console.log('🗑️  [Provider:TS] delete 调用, name:', file?.name, 'hash:', file?.hash);
        const res = await _delete(file, opts);
        console.log('🗑️  [Provider:TS] delete 完成');
        return res;
      };
    }
  }

  if (plugin?.services?.upload?.upload) {
    const originalUpload = plugin.services.upload.upload;
    plugin.services.upload.upload = async function (file: any) {
      try {
        const cfg = (global as any)?.strapi?.config?.get?.('plugin::upload');
        console.log('🔧 [Upload Service:TS] 当前 config.provider =', cfg?.provider);
      } catch {}

      console.log('📤 [Upload Service:TS] 开始上传文件, name:', file?.name, 'mime:', file?.mime, 'size:', file?.size);
      try {
        const result = await originalUpload.call(this, file);
        console.log('✅ [Upload Service:TS] 上传成功, url:', file?.url, 'provider:', file?.provider);
        return result;
      } catch (error: any) {
        console.error('❌ [Upload Service:TS] 上传失败:', error?.message || error);
        throw error;
      }
    };
  }

  return plugin;
};
