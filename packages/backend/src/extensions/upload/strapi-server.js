console.log('⚙️  [Upload Ext] upload 插件扩展已加载');

module.exports = (plugin) => {
  // 包装 provider 服务
  if (plugin.services?.provider) {
    const p = plugin.services.provider;
    const _upload = p.upload?.bind(p);
    const _uploadStream = p.uploadStream?.bind(p);
    const _delete = p.delete?.bind(p);
    const _checkFileSize = p.checkFileSize?.bind(p);

    if (_checkFileSize) {
      p.checkFileSize = async (file, opts) => {
        console.log('🧪 [Provider] checkFileSize sizeLimit:', opts?.sizeLimit);
        return _checkFileSize(file, opts);
      };
    }

    if (_upload) {
      p.upload = async (file, opts) => {
        console.log('📦 [Provider] upload 调用, name:', file?.name, 'mime:', file?.mime, 'size:', file?.size);
        const res = await _upload(file, opts);
        console.log('📦 [Provider] upload 完成, url:', file?.url, 'provider:', file?.provider);
        return res;
      };
    }

    if (_uploadStream) {
      p.uploadStream = async (file, opts) => {
        console.log('🌊 [Provider] uploadStream 调用, name:', file?.name, 'mime:', file?.mime, 'size:', file?.size);
        const res = await _uploadStream(file, opts);
        console.log('🌊 [Provider] uploadStream 完成, url:', file?.url, 'provider:', file?.provider);
        return res;
      };
    }

    if (_delete) {
      p.delete = async (file, opts) => {
        console.log('🗑️  [Provider] delete 调用, name:', file?.name, 'hash:', file?.hash);
        const res = await _delete(file, opts);
        console.log('🗑️  [Provider] delete 完成');
        return res;
      };
    }
  }

  // 包装 upload 服务以输出配置中的 provider 与结果
  if (plugin.services?.upload?.upload) {
    const originalUpload = plugin.services.upload.upload;
    plugin.services.upload.upload = async function (file) {
      try {
        const cfg = strapi?.config?.get?.('plugin::upload');
        console.log('🔧 [Upload Service] 当前 config.provider =', cfg?.provider);
      } catch (_) {}

      console.log('📤 [Upload Service] 开始上传文件, name:', file?.name, 'mime:', file?.mime, 'size:', file?.size);
      try {
        const result = await originalUpload.call(this, file);
        console.log('✅ [Upload Service] 上传成功, url:', file?.url, 'provider:', file?.provider);
        return result;
      } catch (error) {
        console.error('❌ [Upload Service] 上传失败:', error?.message || error);
        throw error;
      }
    };
  }

  return plugin;
};
