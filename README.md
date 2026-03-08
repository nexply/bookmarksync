# WebDAV书签同步

一个功能完整的 Chrome 扩展，用于通过 WebDAV 在不同设备间同步浏览器书签。支持实时书签变更提醒、安全的凭证存储，以及用户友好的多语言操作界面。

## 功能特性

- 📚 完整的书签同步功能
  - 支持书签的上传与下载
  - 支持书签文件夹结构的保持
  - 智能处理书签栏和其他书签分类
  - 支持 Firefox、Chrome 和 Edge 书签格式转换
- 🔄 WebDAV 集成
  - 支持标准 WebDAV 协议
  - 提供连接测试功能
  - 支持自定义服务器地址
  - 详细的错误提示和状态反馈
- 🔒 安全性
  - 使用 AES-GCM 加密存储敏感数据
  - 使用 Chrome 同步存储保护配置
  - 支持密码长度和格式验证
- 🔔 智能提醒
  - 书签变更实时提醒
  - 使用徽章显示未同步状态
  - 防止同步操作时的重复提醒
- 🎨 用户界面
  - 精心设计的弹出窗口
  - 响应式操作反馈
  - 简洁的设置管理界面
  - 支持中英文语言切换
  - 记住用户语言偏好

## 安装方法

### 开发版本安装
1. 下载本项目代码
2. 运行 `npm install` 安装依赖
3. 生成开发密钥：`npm run generate-key`
4. 构建扩展：`npm run build`
5. 打开 Chrome 浏览器，进入扩展程序页面 (`chrome://extensions/`)
6. 开启"开发者模式"
7. 点击"加载已解压的扩展程序"
8. 选择项目文件夹中的 `dist` 目录

### 发布版本安装
1. 从 [Release](https://github.com/nexply/bookmarksync/releases) 页面下载最新的 `.zip` 文件
2. 将文件拖放到 Chrome 扩展程序页面进行安装

## 使用说明

1. 点击浏览器工具栏中的扩展图标
2. 选择您偏好的界面语言（中文/英文）
3. 在设置区域填写 WebDAV 服务器信息：
   - 服务器地址（例如：https://dav.example.com）
   - 用户名
   - 密码（至少8个字符）
4. 点击"测试连接"确保配置正确
5. 点击"保存设置"保存 WebDAV 配置
6. 使用"上传书签"或"下载书签"进行同步

## 注意事项

- 首次下载书签会清空本地已有书签
- 请确保 WebDAV 服务器支持 CORS
- 建议在同步前备份重要书签
- 书签变更会在扩展图标上显示红色感叹号提醒
- 同步操作会暂时禁用变更检测，避免重复提醒
- 语言设置会被保存，重启浏览器后仍然保持
- 密码必须至少包含8个字符
- 支持在 Firefox、Chrome 和 Edge 之间同步书签

## 开发相关

### 开发环境设置

1. 安装依赖：

  `npm install`

2. 生成开发密钥：
   
  `npm run generate-key`

3. 构建扩展：

  `npm run build`

4. 调试模式构建：

  `npm run build:debug`

### 构建输出
构建后会在 `dist` 目录生成：
- `bookmark-sync-v{version}.zip` - 用于分发的压缩包

## 贡献指南

欢迎提交 Issue 和 Pull Request。在提交代码前，请确保：
- 代码符合项目现有的代码风格
- 添加必要的测试和文档
- 更新 README 中的相关信息

## 许可证

本项目采用 Apache License 2.0 许可证。详细信息请查看 [LICENSE](LICENSE) 文件。

## 技术栈

- ![Chrome](https://img.shields.io/badge/Chrome%20Extension-v3-blue)
- ![Firefox](https://img.shields.io/badge/Firefox%20Add--on-Compatible-orange)
- ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
- ![WebDAV](https://img.shields.io/badge/WebDAV-Protocol-orange)
- ![CSS3](https://img.shields.io/badge/CSS3-Styling-purple)
- ![Security](https://img.shields.io/badge/Security-AES--GCM-green)

## 支持与反馈

如果您在使用过程中遇到任何问题，或有任何建议，欢迎通过以下方式联系：

- [提交 Issue](https://github.com/nexply/bookmarksync/issues)
- [提交 Pull Request](https://github.com/nexply/bookmarksync/pulls)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=nexply/bookmarksync&type=Date)](https://star-history.com/#nexply/bookmarksync&Date)