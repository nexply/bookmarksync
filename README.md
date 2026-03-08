# WebDAV 书签同步

一个功能完整的浏览器扩展，用于通过 WebDAV 在不同设备间同步浏览器书签。支持实时书签变更提醒、安全的凭证存储，以及用户友好的多语言界面。

## 支持浏览器

| 浏览器 | 状态 | 说明 |
|--------|------|------|
| Chrome | ✅ | 书签栏 |
| Edge | ✅ | 收藏夹栏 |
| Firefox | ✅ | 书签工具栏 |

## 功能特性

### 📚 书签同步
- 支持书签上传与下载
- 保持文件夹结构完整
- 智能识别各浏览器书签分类
- 跨浏览器同步（Chrome ↔ Edge ↔ Firefox）

### 🔄 WebDAV 集成
- 支持标准 WebDAV 协议
- 连接测试功能
- 自定义服务器地址
- 详细错误提示

### 🔒 安全性
- AES-GCM 加密存储凭证
- Chrome 同步存储保护配置
- 密码长度验证

### 🔔 智能提醒
- 书签变更实时通知
- 徽章显示未同步状态
- 避免重复提醒

### 🎨 用户界面
- 简洁弹出窗口
- 响应式操作反馈
- 中英文语言切换
- 记住语言偏好

## 快速开始

### 1. 安装扩展

**方式一：从 Release 安装**
1. 从 [Release](https://github.com/nexply/bookmarksync/releases) 下载最新 `.zip` 文件
2. 打开 `chrome://extensions/`
3. 开启"开发者模式"
4. 拖放 ZIP 文件到页面

**方式二：开发版本安装**
```bash
git clone https://github.com/nexply/bookmarksync.git
cd bookmarksync
npm install
npm run generate-key
npm run build
```
然后加载 `dist` 目录

### 2. 配置 WebDAV

支持自建服务器或以下服务：
- 群晖 NAS
- Nextcloud
- ownCloud
- 任意支持 WebDAV 的网盘

服务器地址示例：`https://dav.example.com`

### 3. 使用

1. 点击扩展图标
2. 选择语言（中文/英文）
3. 填写 WebDAV 配置
4. 点击"测试连接"
5. 点击"保存设置"
6. 上传/下载书签

## 注意事项

- ⚠️ 首次下载会清空本地书签（建议先备份）
- 🔐 密码至少 8 个字符
- 🌐 确保 WebDAV 服务器支持 CORS
- 📱 书签变更时图标显示红色感叹号

## 常见问题

**Q: 测试连接失败？**
A: 检查服务器地址、用户名密码，确保服务器支持 CORS

**Q: 书签导入位置不对？**
A: 扩展会自动识别各浏览器的书签分类（书签栏/收藏夹栏/书签工具栏）

**Q: 如何备份书签？**
A: 使用浏览器的"导出书签"功能，或直接上传当前书签

## 开发指南

```bash
# 安装依赖
npm install

# 生成开发密钥
npm run generate-key

# 构建发布版本
npm run build

# 构建调试版本
npm run build:debug
```

构建输出：`dist/bookmark-sync-v{version}.zip`

## 技术栈

- Chrome Extension (Manifest V3)
- JavaScript ES6+
- WebDAV 协议
- AES-GCM 加密

## 许可证

Apache License 2.0 - 详见 [LICENSE](LICENSE)

## 支持

- [提交 Issue](https://github.com/nexply/bookmarksync/issues)
- [提交 PR](https://github.com/nexply/bookmarksync/pulls)
