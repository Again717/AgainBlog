const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app = express();

// MongoDB 连接字符串（后续会移到环境变量）
const MONGODB_URI = 'mongodb://localhost:27017/travel-blog';

// 连接 MongoDB 数据库
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('MongoDB 连接成功');
})
.catch((error) => {
    console.error('MongoDB 连接失败:', error.message);
    console.warn('警告: 服务器将继续启动，但数据库功能可能不可用');
    console.warn('请确保 MongoDB 服务正在运行');
});

// 配置中间件
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析 JSON 请求体

// 导入路由
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const postRoutes = require('./routes/posts');

// 设置根路由
app.get('/', (req, res) => {
    res.json({ message: "Travel Blog API is running!" });
});

// 挂载认证路由
app.use('/api/auth', authRoutes);

// 挂载文章路由
app.use('/api/articles', articleRoutes);

// 挂载动态路由
app.use('/api/posts', postRoutes);

// 服务器端口
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
    console.log('========================================');
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('Travel Blog API 已启动');
    console.log('========================================');
}).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`错误: 端口 ${PORT} 已被占用`);
        console.error('请关闭占用该端口的程序，或修改 PORT 环境变量');
    } else {
        console.error('服务器启动失败:', error.message);
    }
    process.exit(1);
});

