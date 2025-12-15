const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true // 存储 Markdown
    },
    htmlContent: {
        type: String // 可选，用于存储渲染后的 HTML
    },
    coverImage: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    viewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);












