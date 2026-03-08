const messages = {
  zh: {
    title: 'WebDAV书签同步',
    upload: '上传书签',
    download: '下载书签',
    clear: '清空本地书签',
    settings: {
      title: 'WebDAV 设置',
      serverPlaceholder: '例如: https://dav.example.com',
      usernamePlaceholder: '请输入WebDAV用户名',
      passwordPlaceholder: '请输入WebDAV密码',
      test: '测试连接',
      save: '保存设置'
    },
    status: {
      changes: '书签有未同步的更改',
      connectionSuccess: '连接成功',
      connectionFailed: '连接失败',
      settingsSaved: '设置已保存',
      uploadSuccess: '书签上传成功',
      downloadSuccess: '书签下载成功',
      clearSuccess: '书签已清空',
      clearConfirm: '确定要清空所有本地书签吗？',
      migrationNeeded: '需要进行数据迁移'
    },
    errors: {
      serverRequired: '请输入服务器地址',
      usernameRequired: '请输入用户名',
      passwordRequired: '请输入密码',
      invalidServer: '无效的服务器地址',
      passwordLength: '密码长度至少需要8个字符',
      authFailed: '认证失败，请检查用户名和密码',
      networkError: '网络连接失败，请检查服务器地址',
      uploadFailed: '上传失败',
      downloadFailed: '下载失败',
      clearFailed: '清空书签失败',
      saveFailed: '保存设置失败',
      createBookmarkFailed: '创建书签失败',
      importFailed: '导入书签失败',
      downloadFailed: '下载失败',
      encryptFailed: '加密失败',
      decryptFailed: '解密失败',
      allFieldsRequired: '所有字段都必须填写'
    },
    bookmarks: {
      menu: '书签菜单',
      menuZh: '书签菜单',
      mobile: '移动书签',
      mobileZh: '移动书签',
      toolbar: '书签工具栏',
      toolbarZh: '书签工具栏',
      bar: '书签栏',
      barZh: '书签栏',
      favorites: '收藏夹',
      favoritesZh: '收藏夹',
      otherFavorites: '其他收藏夹',
      otherFavoritesZh: '其他收藏夹'
    }
  },
  en: {
    title: 'Bookmark Sync',
    upload: 'Upload Bookmarks',
    download: 'Download Bookmarks',
    clear: 'Clear Local Bookmarks',
    settings: {
      title: 'WebDAV Settings',
      serverPlaceholder: 'e.g. https://dav.example.com',
      usernamePlaceholder: 'Enter WebDAV username',
      passwordPlaceholder: 'Enter WebDAV password',
      test: 'Test Connection',
      save: 'Save Settings'
    },
    status: {
      changes: 'Bookmarks have unsynchronized changes',
      connectionSuccess: 'Connection successful',
      connectionFailed: 'Connection failed',
      settingsSaved: 'Settings saved',
      uploadSuccess: 'Bookmarks uploaded successfully',
      downloadSuccess: 'Bookmarks downloaded successfully',
      clearSuccess: 'Bookmarks cleared',
      clearConfirm: 'Are you sure you want to clear all local bookmarks?',
      migrationNeeded: 'Data migration needed'
    },
    errors: {
      serverRequired: 'Please enter server address',
      usernameRequired: 'Please enter username',
      passwordRequired: 'Please enter password',
      invalidServer: 'Invalid server address',
      passwordLength: 'Password must be at least 8 characters',
      authFailed: 'Authentication failed, please check username and password',
      networkError: 'Network connection failed, please check server address',
      uploadFailed: 'Upload failed',
      downloadFailed: 'Download failed',
      clearFailed: 'Failed to clear bookmarks',
      saveFailed: 'Failed to save settings',
      createBookmarkFailed: 'Failed to create bookmark',
      importFailed: 'Failed to import bookmarks',
      downloadFailed: 'Download failed',
      encryptFailed: 'Encryption failed',
      decryptFailed: 'Decryption failed',
      allFieldsRequired: 'All fields are required'
    },
    bookmarks: {
      menu: 'Menu',
      menuZh: '书签菜单',
      mobile: 'Mobile',
      mobileZh: '移动书签',
      toolbar: 'Toolbar',
      toolbarZh: '书签工具栏',
      bar: 'Bookmarks Bar',
      barZh: '书签栏',
      favorites: 'Favorites',
      favoritesZh: '收藏夹',
      otherFavorites: 'Other Favorites',
      otherFavoritesZh: '其他收藏夹'
    }
  }
};

class I18n {
  static currentLocale = null;

  static async initialize() {
    const result = await chrome.storage.sync.get(['userLanguage']);
    this.currentLocale = result.userLanguage || (navigator.language.startsWith('zh') ? 'zh' : 'en');
  }

  static async setLocale(locale) {
    if (messages[locale]) {
      this.currentLocale = locale;
      await chrome.storage.sync.set({ userLanguage: locale });
      return true;
    }
    return false;
  }

  static t(key) {
    if (!this.currentLocale) {
      this.currentLocale = 'en';
    }

    const keys = key.split('.');
    let value = messages[this.currentLocale];
    
    for (const k of keys) {
      value = value[k];
      if (!value) return key;
    }
    
    return value;
  }
}

export default I18n; 