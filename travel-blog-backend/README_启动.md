# 🚀 服务器启动指南

## ✅ 问题已修复

**原问题：** `[nodemon] app crashed - waiting for file changes before starting...`

**原因：** 缺少 `nodemailer` 模块

**已解决：** ✅ 已运行 `npm install` 安装所有依赖

## 🎯 现在请按以下步骤操作

### 方法 1：使用启动脚本（最简单）⭐

1. **双击运行** `启动服务器.bat` 文件
2. **保持窗口打开** - 不要关闭这个窗口
3. 看到以下消息表示成功：
   ```
   ========================================
   MongoDB 连接成功
   服务器运行在 http://localhost:3000
   Travel Blog API 已启动
   ========================================
   ```

### 方法 2：使用命令行

1. **打开 PowerShell 或 CMD**
2. **进入后端目录：**
   ```powershell
   cd C:\Users\Joker\Desktop\AgainBlog\AgainBlog\travel-blog-backend
   ```
3. **启动服务器：**
   ```powershell
   npm run dev
   ```
   或
   ```powershell
   npm start
   ```

## ✅ 验证服务器运行

### 1. 检查终端输出
启动成功后应该看到：
```
========================================
MongoDB 连接成功
服务器运行在 http://localhost:3000
Travel Blog API 已启动
========================================
```

### 2. 测试 API
在浏览器中访问：**http://localhost:3000**

应该看到：
```json
{"message":"Travel Blog API is running!"}
```

### 3. 测试验证码 API
访问：**http://localhost:3000/api/auth/send-verification-code**

（需要 POST 请求，可以用 Postman 测试）

## ⚠️ 重要提示

1. **保持终端窗口打开** 
   - 关闭窗口会停止服务器
   - 服务器需要在终端中持续运行

2. **MongoDB 连接**
   - 如果看到 "MongoDB 连接失败"，服务器仍会启动
   - 但数据库功能（注册、登录等）将不可用
   - 确保 MongoDB 服务正在运行

3. **端口占用**
   - 如果 3000 端口被占用，会看到错误
   - 可以修改 `.env` 文件设置其他端口

## 🔍 故障排除

### 问题：服务器立即退出
**检查：**
1. 查看终端中的完整错误信息
2. 检查 MongoDB 是否运行
3. 检查所有依赖是否安装：`npm install`

### 问题：端口被占用
**解决：**
1. 创建 `.env` 文件
2. 添加：`PORT=3001`
3. 重启服务器

### 问题：MongoDB 连接失败
**解决：**
1. 启动 MongoDB 服务：
   ```powershell
   net start MongoDB
   ```
2. 或检查 MongoDB 是否在运行：
   ```powershell
   Get-Service MongoDB
   ```

## 📋 已安装的依赖

- ✅ express - Web 框架
- ✅ mongoose - MongoDB 驱动
- ✅ cors - 跨域支持
- ✅ bcryptjs - 密码加密
- ✅ jsonwebtoken - JWT 认证
- ✅ nodemailer - 邮件发送（验证码）
- ✅ dotenv - 环境变量
- ✅ nodemon - 开发自动重启

## 🎉 成功标志

当你看到以下情况时，说明服务器运行成功：

1. ✅ 终端显示 "服务器运行在 http://localhost:3000"
2. ✅ 浏览器访问 http://localhost:3000 有响应
3. ✅ 前端不再出现 `ERR_CONNECTION_REFUSED` 错误
4. ✅ 可以正常发送验证码、注册、登录

---

**现在请双击运行 `启动服务器.bat` 或使用命令行启动服务器！**




