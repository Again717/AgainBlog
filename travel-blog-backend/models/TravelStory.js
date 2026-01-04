const mongoose = require('mongoose');

const travelStorySchema = new mongoose.Schema({
    // 基本信息
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    count: {
        type: String,
        default: ''
    },
    themeColor: {
        type: String,
        default: '#ffffff'
    },

    // 点赞功能 - 存储用户ID数组
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // 评论功能 - 存储评论数组
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        time: {
            type: String,
            default: () => new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        replies: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            content: {
                type: String,
                required: true
            },
            time: {
                type: String,
                default: () => new Date().toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // 是否激活（用于轮播控制）
    isActive: {
        type: Boolean,
        default: true
    },

    // 排序权重
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// 添加虚拟字段来计算点赞数和评论数
travelStorySchema.virtual('likesCount').get(function() {
    return this.likes.length;
});

travelStorySchema.virtual('commentsCount').get(function() {
    return this.comments.length;
});

// 确保虚拟字段在JSON序列化时包含
travelStorySchema.set('toJSON', { virtuals: true });
travelStorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TravelStory', travelStorySchema);