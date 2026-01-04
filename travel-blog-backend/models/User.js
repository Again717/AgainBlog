const mongoose = require('mongoose');

// 生成随机默认头像URL
function getRandomDefaultAvatar() {
    const avatarCount = 5; // 我们创建了5个默认头像
    const randomIndex = Math.floor(Math.random() * avatarCount) + 1;
    const paddedIndex = randomIndex.toString().padStart(2, '0');
    return `http://localhost:3000/uploads/avatars/default/avatar-${paddedIndex}.svg`;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: getRandomDefaultAvatar
    },
    bio: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);












