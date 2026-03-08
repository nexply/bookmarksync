import I18n from './i18n.js';

class BookmarkManager {
  static async getAllBookmarks() {
    return new Promise((resolve) => {
      chrome.bookmarks.getTree(resolve);
    });
  }

  static async clearAllBookmarks() {
    const bookmarks = await this.getAllBookmarks();
    const rootNodes = bookmarks[0].children;
    
    for (const node of rootNodes) {
      for (const child of node.children || []) {
        await chrome.bookmarks.removeTree(child.id);
      }
    }
  }

  static async importBookmarks(bookmarkData) {
    const BROWSER_TYPE = {
      FIREFOX: 'firefox',
      CHROME: 'chrome',
      EDGE: 'edge'
    };

    const ROOT_FOLDERS = {
      FIREFOX: {
        MENU: 'menu________',
        MOBILE: 'mobile______',
        TOOLBAR: 'toolbar_____',
        UNFILED: 'unfiled_____'
      },
      CHROME: {
        TOOLBAR: '1',
        OTHER: '2',
        MOBILE: '3'
      },
      EDGE: {
        FAVORITES: '1',
        OTHER: '2',
        MOBILE: '3'
      }
    };

    const getCurrentBrowser = () => {
      if (typeof browser !== 'undefined') return BROWSER_TYPE.FIREFOX;
      const ua = navigator.userAgent;
      if (ua.includes('Edg/')) return BROWSER_TYPE.EDGE;
      return BROWSER_TYPE.CHROME;
    };

    // 获取根文件夹ID
    const getRootFolderId = (folderTitle, browserType) => {
      const allBarNames = ['书签栏', 'Bookmarks Bar', '收藏夹', 'Favorites', '收藏夹栏', 'Favorites Bar', '书签工具栏', 'Toolbar', 'Menu', '书签菜单'];
      const allOtherNames = ['其他书签', 'Other Bookmarks', '其他收藏夹', 'Other Favorites'];
      const allMobileNames = ['移动书签', 'Mobile', 'mobile______'];

      const isBar = allBarNames.includes(folderTitle);
      const isOther = allOtherNames.includes(folderTitle);
      const isMobile = allMobileNames.includes(folderTitle);

      if (browserType === BROWSER_TYPE.FIREFOX) {
        if (isBar || folderTitle === 'toolbar_____' || folderTitle === 'Toolbar') return ROOT_FOLDERS.FIREFOX.TOOLBAR;
        if (isMobile) return ROOT_FOLDERS.FIREFOX.MOBILE;
        if (folderTitle === 'menu________' || folderTitle === 'Menu') return ROOT_FOLDERS.FIREFOX.MENU;
        return ROOT_FOLDERS.FIREFOX.UNFILED;
      } else if (browserType === BROWSER_TYPE.EDGE) {
        if (isBar) return ROOT_FOLDERS.EDGE.FAVORITES;
        if (isMobile) return ROOT_FOLDERS.EDGE.MOBILE;
        if (isOther) return ROOT_FOLDERS.EDGE.OTHER;
        return ROOT_FOLDERS.EDGE.OTHER;
      } else {
        if (isBar) return ROOT_FOLDERS.CHROME.TOOLBAR;
        if (isMobile) return ROOT_FOLDERS.CHROME.MOBILE;
        if (isOther) return ROOT_FOLDERS.CHROME.OTHER;
        return ROOT_FOLDERS.CHROME.OTHER;
      }
    };

    async function createBookmarkTree(node, parentId, browserType) {
      try {
        if (node.url) {
          let url = node.url;
          if (browserType === BROWSER_TYPE.FIREFOX && url.startsWith('chrome://')) {
            url = url.replace('chrome://', 'about:');
          }

          const isFirefox = browserType === BROWSER_TYPE.FIREFOX;
          const bookmarkAPI = isFirefox ? browser.bookmarks : chrome.bookmarks;
          await bookmarkAPI.create({
            parentId: parentId,
            title: node.title,
            url: url
          });
        } else {
          const isFirefox = browserType === BROWSER_TYPE.FIREFOX;
          const bookmarkAPI = isFirefox ? browser.bookmarks : chrome.bookmarks;
          const folder = await bookmarkAPI.create({
            parentId: parentId,
            title: node.title
          });
          
          if (node.children) {
            for (const child of node.children) {
              await createBookmarkTree(child, folder.id, browserType);
            }
          }
        }
      } catch (error) {
        console.error(I18n.t('errors.createBookmarkFailed'), error, node);
      }
    }

    try {
      const browserType = getCurrentBrowser();
      const isFirefox = browserType === BROWSER_TYPE.FIREFOX;
      const bookmarkAPI = isFirefox ? browser.bookmarks : chrome.bookmarks;
      
      // 在导入开始前临时禁用书签变更监听
      const port = chrome.runtime.connect({ name: 'disable-bookmark-listener' });
      
      // 清空现有书签
      await this.clearAllBookmarks();
      
      // 导入书签
      for (const node of bookmarkData[0].children) {
        const rootId = getRootFolderId(node.title, browserType);
        if (node.children) {
          for (const child of node.children) {
            await createBookmarkTree(child, rootId, browserType);
          }
        }
      }
      
      // 重新启用书签变更监听
      port.disconnect();
    } catch (error) {
      console.error(I18n.t('errors.importFailed'), error);
      throw new Error(I18n.t('errors.importFailed') + ': ' + error.message);
    }
  }
}

export default BookmarkManager; 