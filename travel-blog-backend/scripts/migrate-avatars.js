const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB 连接字符串
const MONGODB_URI = 'mongodb://localhost:27017/travel-blog';

async function migrateAvatars() {
    try {
        // 连接数据库
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB 连接成功');

        // 查找所有包含data URL的头像
        const usersWithDataUrls = await User.find({
            avatar: { $regex: '^data:' }
        });

        console.log(`📸 找到 ${usersWithDataUrls.length} 个用户使用data URL头像`);

        if (usersWithDataUrls.length === 0) {
            console.log('🎉 没有需要迁移的头像');
            await mongoose.connection.close();
            return;
        }

        // 清空这些用户的头像，让他们重新上传
        const result = await User.updateMany(
            { avatar: { $regex: '^data:' } },
            { $set: { avatar: '' } }
        );

        console.log(`✅ 已清空 ${result.modifiedCount} 个data URL头像`);
        console.log('💡 用户需要重新上传头像才能显示');

        // 显示受影响的用户
        console.log('\n👥 受影响的用户:');
        usersWithDataUrls.forEach(user => {
            console.log(`   - ${user.username} (${user.email})`);
        });

        console.log('\n🎉 头像迁移完成！');

        // 关闭数据库连接
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ 迁移失败:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// 运行迁移
migrateAvatars();
