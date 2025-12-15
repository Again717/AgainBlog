const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/posts - 获取所有动态
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username email avatar')
            .populate('likes', 'username')
            .populate('favorites', 'username')
            .populate('comments.user', 'username avatar')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: posts,
            count: posts.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取动态失败',
            error: error.message
        });
    }
});

// POST /api/posts - 发布动态（需要认证）
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { content, images, location } = req.body;
        
        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '动态内容不能为空'
            });
        }

        const authorId = req.user?.id || req.user?._id;
        
        if (!authorId) {
            return res.status(401).json({
                success: false,
                message: '未授权，请先登录'
            });
        }

        const newPost = new Post({
            content: content.trim(),
            images: images || [],
            location: location || null,
            author: authorId
        });

        await newPost.save();

        const populatedPost = await Post.findById(newPost._id)
            .populate('author', 'username email avatar')
            .populate('likes', 'username')
            .populate('favorites', 'username')
            .populate('comments.user', 'username avatar');

        res.status(201).json({
            success: true,
            message: '动态发布成功',
            data: populatedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '发布动态失败',
            error: error.message
        });
    }
});

// POST /api/posts/:id/like - 点赞/取消点赞动态（需要认证）
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id || req.user?._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: '动态不存在'
            });
        }

        const isLiked = post.likes.some(likeId => likeId.toString() === userId.toString());

        if (isLiked) {
            // 取消点赞
            post.likes = post.likes.filter(likeId => likeId.toString() !== userId.toString());
        } else {
            // 点赞
            post.likes.push(userId);
        }

        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate('author', 'username email avatar')
            .populate('likes', 'username')
            .populate('favorites', 'username')
            .populate('comments.user', 'username avatar');

        res.json({
            success: true,
            message: isLiked ? '已取消点赞' : '已点赞',
            data: updatedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '操作失败',
            error: error.message
        });
    }
});

// POST /api/posts/:id/comment - 评论动态（需要认证）
router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id || req.user?._id;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '评论内容不能为空'
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: '动态不存在'
            });
        }

        post.comments.push({
            user: userId,
            content: content.trim()
        });

        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate('author', 'username email avatar')
            .populate('likes', 'username')
            .populate('favorites', 'username')
            .populate('comments.user', 'username avatar');

        res.json({
            success: true,
            message: '评论成功',
            data: updatedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '评论失败',
            error: error.message
        });
    }
});

// POST /api/posts/:id/favorite - 收藏/取消收藏动态（需要认证）
router.post('/:id/favorite', authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id || req.user?._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: '动态不存在'
            });
        }

        const isFavorited = post.favorites.some(favId => favId.toString() === userId.toString());

        if (isFavorited) {
            // 取消收藏
            post.favorites = post.favorites.filter(favId => favId.toString() !== userId.toString());
        } else {
            // 收藏
            post.favorites.push(userId);
        }

        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate('author', 'username email avatar')
            .populate('likes', 'username')
            .populate('favorites', 'username')
            .populate('comments.user', 'username avatar');

        res.json({
            success: true,
            message: isFavorited ? '已取消收藏' : '已收藏',
            data: updatedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '操作失败',
            error: error.message
        });
    }
});

module.exports = router;

