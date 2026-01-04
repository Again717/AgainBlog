const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // 允许跨域请求

// 处理 OPTIONS 预检请求
app.options('*', cors());

// 增加请求体大小限制到50MB（处理图片上传）
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 配置静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 确保上传目录存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 配置 multer 文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 限制
  },
  fileFilter: function (req, file, cb) {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// 导入路由
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const postRoutes = require('./routes/posts');
const carouselRoutes = require('./routes/carousel');
const travelStoryRoutes = require('./routes/travelStories');

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

// 挂载轮播图路由
app.use('/api/carousel', carouselRoutes);

// 挂载旅行故事路由
app.use('/api/travel-stories', travelStoryRoutes);

// 文件上传路由
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    // 返回文件URL
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: '文件上传成功',
      data: {
        url: fileUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '文件上传失败',
      error: error.message
    });
  }
});

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

