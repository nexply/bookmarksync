import I18n from './i18n.js';

class BookmarkManager {
  static async getAllBookmarks() {
    return new Promise((resolve) => {
      chrome.bookmarks.getTree(resolve);
    });
  }

  static async clearAllBookmarks() {
    // 始终使用 chrome.bookmarks（Chrome/Edge/新版 Chrome 的 browser 兼容层均可），
    // Firefox 的 chrome.bookmarks 兼容层同样可用，避免误判
    const bookmarkAPI = chrome.bookmarks;
    const bookmarks = await this.getAllBookmarks();
    const rootNodes = bookmarks[0].children;

    for (const node of rootNodes) {
      const children = node.children || [];
      // 逆序遍历，避免删除后索引错位
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        if (child.url) {
          // 书签节点：只能用 remove
          await bookmarkAPI.remove(child.id);
        } else {
          // 文件夹节点：用 removeTree 递归删除
          await bookmarkAPI.removeTree(child.id);
        }
      }
    }
  }

  static async importBookmarks(bookmarkData) {
    const BROWSER_TYPE = {
      FIREFOX: 'firefox',
      CHROME: 'chrome',
      EDGE: 'edge'
    };

    const getCurrentBrowser = () => {
      const ua = navigator.userAgent || '';
      // 以 UA 为权威判断：新版 Chrome 也存在 browser 全局命名空间，不能仅靠 typeof browser 判断 Firefox
      if (/Firefox\//i.test(ua) && typeof browser !== 'undefined') return BROWSER_TYPE.FIREFOX;
      if (/Edg\//i.test(ua)) return BROWSER_TYPE.EDGE;
      return BROWSER_TYPE.CHROME;
    };

    // 统一获取 bookmarks API（Firefox 用 browser，其余用 chrome；带防御性回退）
    const getBookmarkAPI = (browserType) => {
      if (browserType === BROWSER_TYPE.FIREFOX && typeof browser !== 'undefined' && browser.bookmarks) {
        return browser.bookmarks;
      }
      return chrome.bookmarks;
    };

    // 动态获取当前浏览器的根文件夹列表（不硬编码 ID，兼容 Firefox 随机 GUID 等特殊情况）
    const getRootFolders = async (browserType) => {
      const bookmarkAPI = getBookmarkAPI(browserType);
      const tree = await new Promise((resolve) => bookmarkAPI.getTree(resolve));
      return (tree && tree[0] && tree[0].children) || [];
    };

    // 根文件夹类别别名（跨浏览器标题差异，仅用于按标题匹配的兜底）
    const ROOT_CATEGORY_ALIASES = {
      bar: ['书签栏', 'bookmarks bar', 'bookmarks toolbar', '收藏夹', '收藏夹栏', 'favorites', 'favorites bar', 'toolbar', '书签工具栏', '书签菜单', 'bookmarks menu', 'menu'],
      other: ['其他书签', 'other bookmarks', '其他收藏夹', 'other favorites', 'unfiled', '未分类书签', '其他书签'],
      mobile: ['移动书签', 'mobile bookmarks', 'mobile', '其他书签设备']
    };
    // 类别 → 根文件夹标题匹配规则（bar 类需排除菜单类，避免"书签菜单"被误判为"书签栏"）
    const matchCategory = (category, rootTitle) => {
      const t = rootTitle.toLowerCase();
      if (category === 'bar') {
        const barLike = ['toolbar', 'bar', 'favorites', '收藏', '书签', '工具'].some(k => t.includes(k));
        const menuLike = ['menu', '菜单'].some(k => t.includes(k));
        return barLike && !menuLike;
      }
      if (category === 'other') {
        return ['other', 'unfiled', '其他', '未分类'].some(k => t.includes(k));
      }
      if (category === 'mobile') {
        return ['mobile', '移动'].some(k => t.includes(k));
      }
      return false;
    };

    // 获取导入目标根文件夹 ID（多策略：id 匹配 → title 精确匹配 → 类别别名 → 兜底）
    const getRootFolderId = (node, browserType, rootFolders) => {
      const folderId = node.id;
      const folderTitle = (node.title || '').trim();
      const lowerTitle = folderTitle.toLowerCase();

      // 策略 1：节点原始 id 直接命中当前浏览器根文件夹（同浏览器同步最可靠）
      const byId = rootFolders.find(r => r.id === folderId);
      if (byId) return byId.id;

      // 策略 2：标题精确匹配（大小写不敏感，覆盖跨浏览器同标题）
      const byTitle = rootFolders.find(r => (r.title || '').trim().toLowerCase() === lowerTitle);
      if (byTitle) return byTitle.id;

      // 策略 3：标题别名匹配（识别根文件夹类别，再在当前浏览器根文件夹中定位对应类别）
      for (const [category, aliases] of Object.entries(ROOT_CATEGORY_ALIASES)) {
        if (aliases.some(n => n.toLowerCase() === lowerTitle)) {
          const match = rootFolders.find(r => matchCategory(category, r.title || ''));
          if (match) return match.id;
        }
      }

      // 兜底：第一个根文件夹
      return rootFolders.length > 0 ? rootFolders[0].id : null;
    };

    async function createBookmarkTree(node, parentId, browserType, onError) {
      try {
        const bookmarkAPI = getBookmarkAPI(browserType);
        if (node.url) {
          let url = node.url;
          if (browserType === BROWSER_TYPE.FIREFOX && url.startsWith('chrome://')) {
            url = url.replace('chrome://', 'about:');
          }

          await bookmarkAPI.create({
            parentId: parentId,
            title: node.title,
            url: url
          });
        } else {
          const folder = await bookmarkAPI.create({
            parentId: parentId,
            title: node.title
          });
          
          if (node.children) {
            for (const child of node.children) {
              await createBookmarkTree(child, folder.id, browserType, onError);
            }
          }
        }
      } catch (error) {
        console.error(I18n.t('errors.createBookmarkFailed'), error, node);
        if (onError) onError(error, node);
      }
    }

    // 统计书签数量（不含文件夹）
    const countBookmarks = (tree) => {
      let n = 0;
      const walk = (node) => {
        if (node.url) n++;
        for (const c of node.children || []) walk(c);
      };
      for (const root of (tree[0]?.children || [])) walk(root);
      return n;
    };

    try {
      const browserType = getCurrentBrowser();
      const bookmarkAPI = getBookmarkAPI(browserType);

      // 在导入开始前临时禁用书签变更监听
      const port = chrome.runtime.connect({ name: 'disable-bookmark-listener' });

      // 动态获取当前浏览器的根文件夹（真实有效 ID）
      const rootFolders = await getRootFolders(browserType);

      // 备份现有书签，导入失败时回滚
      const backup = await this.getAllBookmarks();
      const backupCount = countBookmarks(backup);

      // 下载数据诊断信息
      const dataRoots = (bookmarkData && bookmarkData[0] && bookmarkData[0].children) || [];
      console.log('[Import] 备份书签数:', backupCount);
      console.log('[Import] 当前浏览器根文件夹:', rootFolders.map(n => `${n.id}("${n.title}")`).join(', '));
      console.log('[Import] 下载数据根文件夹:', dataRoots.map(n => `${n.id}("${n.title}")`).join(', '));
      console.log('[Import] 下载数据书签数:', countBookmarks(bookmarkData));

      try {
        // 清空现有书签
        await this.clearAllBookmarks();

        // 导入书签
        const failures = [];
        for (const node of dataRoots) {
          const rootId = getRootFolderId(node, browserType, rootFolders);
          if (rootId === null) {
            throw new Error('无法确定书签导入的目标文件夹（根文件夹识别失败）');
          }
          if (node.children) {
            for (const child of node.children) {
              await createBookmarkTree(child, rootId, browserType, (err, n) => {
                failures.push({ error: err.message, title: n.title, url: n.url || '(folder)' });
              });
            }
          }
        }

        // 导入后校验：确认书签确实创建成功
        const importedCount = countBookmarks(await this.getAllBookmarks());
        console.log('[Import] 导入后书签数:', importedCount, '| 创建失败节点:', failures.length);
        if (failures.length > 0) {
          console.warn('[Import] 失败节点示例:', failures.slice(0, 5));
        }
        if (failures.length > 0) {
          throw new Error(
            '导入失败：' + failures.length + ' 个节点创建失败' +
            '（例如 "' + (failures[0].title || '?') + '"：' + failures[0].error + '），已自动回滚备份'
          );
        }
        if (importedCount === 0 && backupCount > 0) {
          throw new Error(
            '导入后书签数为 0（备份 ' + backupCount + ' 条，下载数据 ' + countBookmarks(bookmarkData) + ' 条），已自动回滚备份'
          );
        }
      } catch (importError) {
        // 导入失败：尝试恢复备份
        console.error(I18n.t('errors.importFailed'), importError);
        try {
          await this.clearAllBookmarks();
          const restoreFailures = [];
          for (const node of backup[0].children) {
            const rootId = getRootFolderId(node, browserType, rootFolders);
            if (rootId === null) {
              throw new Error('备份恢复时根文件夹识别失败');
            }
            if (node.children) {
              for (const child of node.children) {
                await createBookmarkTree(child, rootId, browserType, (err, n) => {
                  restoreFailures.push({ error: err.message, title: n.title });
                });
              }
            }
          }
          const restoredCount = countBookmarks(await this.getAllBookmarks());
          if (restoreFailures.length > 0 || restoredCount !== backupCount) {
            console.error('备份恢复不完整: 恢复 ' + restoredCount + '/' + backupCount + ' 条', restoreFailures.slice(0, 5));
          } else {
            console.log('书签已从备份恢复 (' + restoredCount + ' 条)');
          }
        } catch (restoreError) {
          console.error('备份恢复失败:', restoreError);
        }
        throw new Error(I18n.t('errors.importFailed') + ': ' + importError.message);
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