const express = require('express');
const TravelStory = require('../models/TravelStory');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/travel-stories - 获取所有旅行故事
router.get('/', async (req, res) => {
    try {
        console.log('Travel stories route accessed');
        const travelStories = await TravelStory.find({ isActive: true })
            .populate('likes', 'username avatar')
            .populate('comments.user', 'username avatar')
            .populate('comments.likes', 'username')
            .populate('comments.replies.user', 'username avatar')
            .sort({ order: 1, createdAt: -1 });

        console.log('Found travel stories:', travelStories.length);

        // 格式化数据以匹配前端期望的格式
        const formattedStories = travelStories.map(story => ({
            _id: story._id,
            image: story.image,
            name: story.name,
            location: story.location,
            description: story.description,
            count: story.count,
            themeColor: story.themeColor,
            likes: story.likesCount,
            comments: story.commentsCount,
            liked: false, // 这个会在前端根据用户状态设置
            commentList: story.comments.map(comment => ({
                _id: comment._id,
                user: comment.user.username,
                userAvatar: comment.user.avatar,
                content: comment.content,
                time: comment.time,
                likes: comment.likes.length,
                liked: false, // 这个会在前端根据用户状态设置
                replies: comment.replies.map(reply => ({
                    _id: reply._id,
                    user: reply.user.username,
                    userAvatar: reply.user.avatar,
                    content: reply.content,
                    time: reply.time
                }))
            }))
        }));

        res.json({
            success: true,
            data: formattedStories,
            count: formattedStories.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取旅行故事失败',
            error: error.message
        });
    }
});

// POST /api/travel-stories/:id/like - 点赞/取消点赞旅行故事（需要认证）
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const storyId = req.params.id;
        const userId = req.user?.id || req.user?._id;

        const story = await TravelStory.findById(storyId);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: '旅行故事不存在'
            });
        }

        const isLiked = story.likes.some(likeId => likeId.toString() === userId.toString());

        if (isLiked) {
            // 取消点赞
            story.likes = story.likes.filter(likeId => likeId.toString() !== userId.toString());
        } else {
            // 点赞
            story.likes.push(userId);
        }

        await story.save();

        const updatedStory = await TravelStory.findById(storyId)
            .populate('likes', 'username avatar')
            .populate('comments.user', 'username avatar')
            .populate('comments.likes', 'username')
            .populate('comments.replies.user', 'username avatar');

        // 格式化响应数据
        const formattedStory = {
            _id: updatedStory._id,
            image: updatedStory.image,
            name: updatedStory.name,
            location: updatedStory.location,
            description: updatedStory.description,
            count: updatedStory.count,
            themeColor: updatedStory.themeColor,
            likes: updatedStory.likesCount,
            comments: updatedStory.commentsCount,
            liked: updatedStory.likes.some(likeId => likeId.toString() === userId.toString()),
            commentList: updatedStory.comments.map(comment => ({
                _id: comment._id,
                user: comment.user.username,
                userAvatar: comment.user.avatar,
                content: comment.content,
                time: comment.time,
                likes: comment.likes.length,
                liked: comment.likes.some(likeId => likeId.toString() === userId.toString()),
                replies: comment.replies.map(reply => ({
                    _id: reply._id,
                    user: reply.user.username,
                    userAvatar: reply.user.avatar,
                    content: reply.content,
                    time: reply.time
                }))
            }))
        };

        res.json({
            success: true,
            message: isLiked ? '已取消点赞' : '已点赞',
            data: formattedStory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '操作失败',
            error: error.message
        });
    }
});

// POST /api/travel-stories/:id/comment - 评论旅行故事（需要认证）
router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const storyId = req.params.id;
        const userId = req.user?.id || req.user?._id;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '评论内容不能为空'
            });
        }

        const story = await TravelStory.findById(storyId);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: '旅行故事不存在'
            });
        }

        story.comments.push({
            user: userId,
            content: content.trim()
        });

        await story.save();

        const updatedStory = await TravelStory.findById(storyId)
            .populate('likes', 'username avatar')
            .populate('comments.user', 'username avatar')
            .populate('comments.likes', 'username')
            .populate('comments.replies.user', 'username avatar');

        // 格式化响应数据
        const formattedStory = {
            _id: updatedStory._id,
            image: updatedStory.image,
            name: updatedStory.name,
            location: updatedStory.location,
            description: updatedStory.description,
            count: updatedStory.count,
            themeColor: updatedStory.themeColor,
            likes: updatedStory.likesCount,
            comments: updatedStory.commentsCount,
            liked: updatedStory.likes.some(likeId => likeId.toString() === userId.toString()),
            commentList: updatedStory.comments.map(comment => ({
                _id: comment._id,
                user: comment.user.username,
                userAvatar: comment.user.avatar,
                content: comment.content,
                time: comment.time,
                likes: comment.likes.length,
                liked: comment.likes.some(likeId => likeId.toString() === userId.toString()),
                replies: comment.replies.map(reply => ({
                    _id: reply._id,
                    user: reply.user.username,
                    userAvatar: reply.user.avatar,
                    content: reply.content,
                    time: reply.time
                }))
            }))
        };

        res.json({
            success: true,
            message: '评论成功',
            data: formattedStory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '评论失败',
            error: error.message
        });
    }
});

// POST /api/travel-stories/:storyId/comments/:commentId/like - 点赞评论（需要认证）
router.post('/:storyId/comments/:commentId/like', authMiddleware, async (req, res) => {
    try {
        const { storyId, commentId } = req.params;
        const userId = req.user?.id || req.user?._id;

        const story = await TravelStory.findById(storyId);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: '旅行故事不存在'
            });
        }

        const comment = story.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '评论不存在'
            });
        }

        const isLiked = comment.likes.some(likeId => likeId.toString() === userId.toString());

        if (isLiked) {
            // 取消点赞
            comment.likes = comment.likes.filter(likeId => likeId.toString() !== userId.toString());
        } else {
            // 点赞
            comment.likes.push(userId);
        }

        await story.save();

        const updatedStory = await TravelStory.findById(storyId)
            .populate('likes', 'username avatar')
            .populate('comments.user', 'username avatar')
            .populate('comments.likes', 'username')
            .populate('comments.replies.user', 'username avatar');

        // 格式化响应数据
        const formattedStory = {
            _id: updatedStory._id,
            image: updatedStory.image,
            name: updatedStory.name,
            location: updatedStory.location,
            description: updatedStory.description,
            count: updatedStory.count,
            themeColor: updatedStory.themeColor,
            likes: updatedStory.likesCount,
            comments: updatedStory.commentsCount,
            liked: updatedStory.likes.some(likeId => likeId.toString() === userId.toString()),
            commentList: updatedStory.comments.map(comment => ({
                _id: comment._id,
                user: comment.user.username,
                userAvatar: comment.user.avatar,
                content: comment.content,
                time: comment.time,
                likes: comment.likes.length,
                liked: comment.likes.some(likeId => likeId.toString() === userId.toString()),
                replies: comment.replies.map(reply => ({
                    _id: reply._id,
                    user: reply.user.username,
                    userAvatar: reply.user.avatar,
                    content: reply.content,
                    time: reply.time
                }))
            }))
        };

        res.json({
            success: true,
            message: isLiked ? '已取消点赞评论' : '已点赞评论',
            data: formattedStory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '操作失败',
            error: error.message
        });
    }
});

// POST /api/travel-stories/:storyId/comments/:commentId/reply - 回复评论（需要认证）
router.post('/:storyId/comments/:commentId/reply', authMiddleware, async (req, res) => {
    try {
        const { storyId, commentId } = req.params;
        const userId = req.user?.id || req.user?._id;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '回复内容不能为空'
            });
        }

        const story = await TravelStory.findById(storyId);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: '旅行故事不存在'
            });
        }

        const comment = story.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '评论不存在'
            });
        }

        comment.replies.push({
            user: userId,
            content: content.trim()
        });

        await story.save();

        const updatedStory = await TravelStory.findById(storyId)
            .populate('likes', 'username avatar')
            .populate('comments.user', 'username avatar')
            .populate('comments.likes', 'username')
            .populate('comments.replies.user', 'username avatar');

        // 格式化响应数据
        const formattedStory = {
            _id: updatedStory._id,
            image: updatedStory.image,
            name: updatedStory.name,
            location: updatedStory.location,
            description: updatedStory.description,
            count: updatedStory.count,
            themeColor: updatedStory.themeColor,
            likes: updatedStory.likesCount,
            comments: updatedStory.commentsCount,
            liked: updatedStory.likes.some(likeId => likeId.toString() === userId.toString()),
            commentList: updatedStory.comments.map(comment => ({
                _id: comment._id,
                user: comment.user.username,
                userAvatar: comment.user.avatar,
                content: comment.content,
                time: comment.time,
                likes: comment.likes.length,
                liked: comment.likes.some(likeId => likeId.toString() === userId.toString()),
                replies: comment.replies.map(reply => ({
                    _id: reply._id,
                    user: reply.user.username,
                    userAvatar: reply.user.avatar,
                    content: reply.content,
                    time: reply.time
                }))
            }))
        };

        res.json({
            success: true,
            message: '回复成功',
            data: formattedStory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '回复失败',
            error: error.message
        });
    }
});

module.exports = router;
