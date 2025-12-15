const express = require('express');
const Article = require('../models/Article');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/articles - 获取所有文章
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author', 'username email avatar') // 关联作者信息，只返回指定字段
            .sort({ createdAt: -1 }); // 按创建时间倒序排列

        res.json({
            success: true,
            data: articles,
            count: articles.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取文章列表失败',
            error: error.message
        });
    }
});

// POST /api/articles - 创建新文章（需要认证）
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content, htmlContent, coverImage, tags } = req.body;
        
        // 验证必填字段
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: '标题和内容为必填项'
            });
        }

        // 从 req.user.id 获取作者 ID（由认证中间件设置）
        const authorId = req.user?.id || req.user?._id;
        
        if (!authorId) {
            return res.status(401).json({
                success: false,
                message: '未授权，请先登录'
            });
        }

        // 创建新文章
        const newArticle = new Article({
            title,
            content,
            htmlContent,
            coverImage,
            author: authorId,
            tags: tags || []
        });

        await newArticle.save();

        // 返回创建的文章（包含作者信息）
        const populatedArticle = await Article.findById(newArticle._id)
            .populate('author', 'username email avatar');

        res.status(201).json({
            success: true,
            message: '文章创建成功',
            data: populatedArticle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '创建文章失败',
            error: error.message
        });
    }
});

module.exports = router;

