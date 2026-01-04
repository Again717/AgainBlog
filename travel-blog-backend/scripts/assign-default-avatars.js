const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB 连接字符串
const MONGODB_URI = 'mongodb://localhost:27017/travel-blog';

// 生成随机默认头像URL
function getRandomDefaultAvatar() {
    const avatarCount = 5; // 我们创建了5个默认头像
    const randomIndex = Math.floor(Math.random() * avatarCount) + 1;
    const paddedIndex = randomIndex.toString().padStart(2, '0');
    return `http://localhost:3000/uploads/avatars/default/avatar-${paddedIndex}.svg`;
}

async function assignDefaultAvatars() {
    try {
        // 连接数据库
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB 连接成功');

        // 查找所有头像为空字符串的用户
        const usersWithoutAvatars = await User.find({
            $or: [
                { avatar: '' },
                { avatar: { $exists: false } },
                { avatar: null }
            ]
        });

        console.log(`📸 找到 ${usersWithoutAvatars.length} 个没有头像的用户`);

        if (usersWithoutAvatars.length === 0) {
            console.log('🎉 所有用户都有头像了');
            await mongoose.connection.close();
            return;
        }

        // 为每个用户分配随机默认头像
        const updatePromises = usersWithoutAvatars.map(user => {
            const defaultAvatar = getRandomDefaultAvatar();
            return User.findByIdAndUpdate(user._id, { avatar: defaultAvatar });
        });

        await Promise.all(updatePromises);

        console.log(`✅ 已为 ${updatePromises.length} 个用户分配默认头像`);

        // 显示更新的用户
        console.log('\n👥 已更新的用户:');
        usersWithoutAvatars.forEach(user => {
            console.log(`   - ${user.username} (${user.email})`);
        });

        console.log('\n🎉 默认头像分配完成！');

        // 关闭数据库连接
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ 分配默认头像失败:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// 运行脚本
assignDefaultAvatars();
