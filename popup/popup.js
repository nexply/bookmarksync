import WebDAVClient from '../js/webdav.js';
import BookmarkManager from '../js/bookmark.js';
import SecureStorage from '../js/storage.js';
import I18n from '../js/i18n.js';

// 更新页面上的所有翻译
function updateTranslations() {
  // 更新文本内容
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = I18n.t(el.getAttribute('data-i18n'));
  });
  
  // 更新占位符
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = I18n.t(el.getAttribute('data-i18n-placeholder'));
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // 初始化 I18n
  await I18n.initialize();
  
  // 初始化语言选择器
  const languageSelect = document.getElementById('language');
  languageSelect.value = I18n.currentLocale;
  updateTranslations();
  
  // 监听语言切换
  languageSelect.addEventListener('change', async (e) => {
    await I18n.setLocale(e.target.value);
    updateTranslations();
  });

  // 检查是否有未同步的变更
  const hasChanges = await SecureStorage.hasBookmarksChanged();
  if (hasChanges) {
    showStatus(I18n.t('status.changes'), false);
  }
  
  const credentials = await SecureStorage.getCredentials();
  
  // 填充已保存的设置
  document.getElementById('serverUrl').value = credentials.serverUrl;
  document.getElementById('username').value = credentials.username;
  document.getElementById('password').value = credentials.password;

  // 测试连接
  document.getElementById('testConnection').addEventListener('click', async () => {
    try {
      const serverUrl = document.getElementById('serverUrl').value.trim();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      // 验证必填字段
      if (!serverUrl) {
        throw new Error(I18n.t('errors.serverRequired'));
      }
      if (!username) {
        throw new Error(I18n.t('errors.usernameRequired'));
      }
      if (!password) {
        throw new Error(I18n.t('errors.passwordRequired'));
      }

      const client = new WebDAVClient(serverUrl, username, password);
      const status = await client.testConnection();
      showStatus(status ? I18n.t('status.connectionSuccess') : I18n.t('status.connectionFailed'), status);
    } catch (error) {
      showStatus(error.message, false);
    }
  });

  // 保存设置
  document.getElementById('saveSettings').addEventListener('click', async () => {
    try {
      await SecureStorage.saveCredentials(
        document.getElementById('serverUrl').value,
        document.getElementById('username').value,
        document.getElementById('password').value
      );
      showStatus(I18n.t('status.settingsSaved'), true);
    } catch (error) {
      showStatus(I18n.t('errors.saveFailed') + ': ' + error.message, false);
    }
  });

  // 上传书签
  document.getElementById('uploadBtn').addEventListener('click', async () => {
    const button = document.getElementById('uploadBtn');
    try {
      button.classList.add('loading');
      button.disabled = true;
      
      const bookmarks = await BookmarkManager.getAllBookmarks();
      const count = countBookmarks(bookmarks);
      console.log('[Sync] 上传数据根文件夹:', (bookmarks[0]?.children || []).map(n => `"${n.title}"`).join(', '));
      console.log('[Sync] 上传书签数量:', count);
      if (count === 0) {
        throw new Error('本地书签为 0，没有可上传的内容');
      }
      const client = await getWebDAVClient();
      await client.uploadBookmarks(bookmarks);
      await SecureStorage.clearBookmarksChangedFlag();
      showStatus(I18n.t('status.uploadSuccess'), true);
    } catch (error) {
      showStatus(error.message, false);
    } finally {
      button.classList.remove('loading');
      button.disabled = false;
    }
  });

  // 下载书签
  document.getElementById('downloadBtn').addEventListener('click', async () => {
    const button = document.getElementById('downloadBtn');
    try {
      button.classList.add('loading');
      button.disabled = true;
      
      const client = await getWebDAVClient();
      const bookmarks = await client.downloadBookmarks();
      console.log('[Sync] 下载数据根文件夹:', ((bookmarks && bookmarks[0] && bookmarks[0].children) || []).map(n => `"${n.title}"`).join(', '));
      console.log('[Sync] 下载书签数量:', countBookmarks(bookmarks));
      if (countBookmarks(bookmarks) === 0) {
        throw new Error('服务器上 bookmarks.json 没有书签数据（为 0 条），请先在其他设备上传');
      }
      await BookmarkManager.importBookmarks(bookmarks);
      await SecureStorage.clearBookmarksChangedFlag();
      showStatus(I18n.t('status.downloadSuccess'), true);
    } catch (error) {
      showStatus(error.message, false);
    } finally {
      button.classList.remove('loading');
      button.disabled = false;
    }
  });

  // 清空书签
  document.getElementById('clearBtn').addEventListener('click', async () => {
    if (confirm(I18n.t('status.clearConfirm'))) {
      try {
        await BookmarkManager.clearAllBookmarks();
        showStatus(I18n.t('status.clearSuccess'), true);
      } catch (error) {
        showStatus(I18n.t('errors.clearFailed') + ': ' + error.message, false);
      }
    }
  });

  // 添加设置区域展开/收起功能
  const settingsHeader = document.querySelector('.settings-header');
  const settingsContent = document.querySelector('.settings-content');
  const arrow = document.querySelector('.arrow');
  
  settingsHeader.addEventListener('click', () => {
    settingsContent.classList.toggle('hidden');
    arrow.classList.toggle('up');
  });
});

function showStatus(message, success) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + (success ? 'success' : 'error');
}

async function getWebDAVClient() {
  const credentials = await SecureStorage.getCredentials();
  return new WebDAVClient(
    credentials.serverUrl,
    credentials.username,
    credentials.password
  );
}

// 统计书签数量（不含文件夹）
function countBookmarks(tree) {
  let n = 0;
  const walk = (node) => {
    if (node.url) n++;
    for (const c of node.children || []) walk(c);
  };
  for (const root of (tree && tree[0] && tree[0].children) || []) walk(root);
  return n;
} 