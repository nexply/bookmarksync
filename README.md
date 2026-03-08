# WebDAV Bookmark Sync / WebDAV 书签同步

A full-featured browser extension for syncing bookmarks across devices via WebDAV. Supports real-time bookmark change notifications, secure credential storage, and a user-friendly multilingual interface.

功能完整的浏览器扩展，用于通过 WebDAV 在不同设备间同步浏览器书签。

---

## Supported Browsers / 支持浏览器

| Browser | Status | Folder Name |
|---------|--------|-------------|
| Chrome | ✅ | Bookmarks Bar |
| Edge | ✅ | Favorites Bar |
| Firefox | ✅ | Toolbar |

---

## Features / 功能特性

### 📚 Bookmark Sync / 书签同步
- Bookmark upload & download / 书签上传与下载
- Preserve folder structure / 保持文件夹结构完整
- Smart folder categorization / 智能识别各浏览器书签分类
- Cross-browser sync / 跨浏览器同步 (Chrome ↔ Edge ↔ Firefox)

### 🔄 WebDAV Integration / WebDAV 集成
- Standard WebDAV protocol / 标准 WebDAV 协议
- Connection testing / 连接测试功能
- Custom server address / 自定义服务器地址
- Detailed error messages / 详细错误提示

### 🔒 Security / 安全性
- AES-GCM encryption / AES-GCM 加密存储
- Chrome sync storage / Chrome 同步存储保护
- Password validation / 密码长度验证

### 🔔 Smart Notifications / 智能提醒
- Real-time change alerts / 书签变更实时通知
- Badge for unsynced changes / 徽章显示未同步状态
- Avoid duplicate alerts / 避免重复提醒

### 🎨 User Interface / 用户界面
- Clean popup design / 简洁弹出窗口
- Responsive feedback / 响应式操作反馈
- Multilingual support / 中英文语言切换
- Language preference saved / 记住语言偏好

---

## Quick Start / 快速开始

### Installation / 安装

**Option 1: From Release / 从 Release 安装**
1. Download latest `.zip` from [Release](https://github.com/nexply/bookmarksync/releases)
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Drag and drop the ZIP file

**Option 2: Development Version / 开发版本**
```bash
git clone https://github.com/nexply/bookmarksync.git
cd bookmarksync
npm install
npm run generate-key
npm run build
```
Then load the `dist` directory

### Configure WebDAV / 配置 WebDAV

Supported services / 支持的服务：
- Synology NAS / 群晖 NAS
- Nextcloud
- ownCloud
- Any WebDAV-enabled cloud storage

Server URL example / 服务器地址示例：`https://dav.example.com`

### Usage / 使用方法

1. Click the extension icon / 点击扩展图标
2. Select language (Chinese/English) / 选择语言（中文/英文）
3. Enter WebDAV credentials / 填写 WebDAV 配置
4. Click "Test Connection" / 点击"测试连接"
5. Click "Save Settings" / 点击"保存设置"
6. Upload or download bookmarks / 上传/下载书签

---

## Notes / 注意事项

- ⚠️ First download will clear local bookmarks (backup recommended) / 首次下载会清空本地书签（建议先备份）
- 🔐 Password must be at least 8 characters / 密码至少 8 个字符
- 🌐 Ensure WebDAV server supports CORS / 确保服务器支持 CORS
- 📱 Red exclamation mark shows unsynced changes / 红色感叹号表示有未同步的更改

---

## FAQ / 常见问题

**Q: Connection test failed? / 测试连接失败？**
A: Check server URL, username/password, ensure server supports CORS / 检查服务器地址、用户名密码，确保支持 CORS

**Q: Bookmarks imported to wrong folder? / 书签导入位置不对？**
A: Extension automatically detects browser-specific folder names / 扩展会自动识别各浏览器的书签分类

**Q: How to backup bookmarks? / 如何备份书签？**
A: Use browser's "Export Bookmarks" or upload current bookmarks / 使用浏览器"导出书签"功能或直接上传

---

## Development / 开发指南

```bash
# Install dependencies
npm install

# Generate development key
npm run generate-key

# Build release version
npm run build

# Build debug version
npm run build:debug
```

Output / 构建输出：`dist/bookmark-sync-v{version}.zip`

---

## Tech Stack / 技术栈

- Chrome Extension (Manifest V3)
- JavaScript ES6+
- WebDAV Protocol
- AES-GCM Encryption

---

## License / 许可证

Apache License 2.0 - See [LICENSE](LICENSE)

---

## Support / 支持

- [Submit Issue](https://github.com/nexply/bookmarksync/issues)
- [Submit PR](https://github.com/nexply/bookmarksync/pulls)
