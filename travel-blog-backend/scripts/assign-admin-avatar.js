const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB 连接字符串
const MONGODB_URI = 'mongodb://localhost:27017/travel-blog';

async function assignAdminAvatar() {
    try {
        // 连接数据库
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB 连接成功');

        // 查找所有管理员用户
        const adminUsers = await User.find({ role: 'admin' });

        console.log(`👑 找到 ${adminUsers.length} 个管理员用户`);

        if (adminUsers.length === 0) {
            console.log('⚠️ 没有找到管理员用户');
            await mongoose.connection.close();
            return;
        }

        // 为管理员分配特殊头像
        const adminAvatarUrl = 'http://localhost:3000/uploads/avatars/default/avatar-admin.svg';

        const updatePromises = adminUsers.map(user => {
            return User.findByIdAndUpdate(user._id, { avatar: adminAvatarUrl });
        });

        await Promise.all(updatePromises);

        console.log(`✅ 已为 ${updatePromises.length} 个管理员分配特殊头像`);

        // 显示更新的管理员
        console.log('\n👑 已更新的管理员:');
        adminUsers.forEach(user => {
            console.log(`   - ${user.username} (${user.email})`);
            console.log(`     新头像: ${adminAvatarUrl}`);
        });

        console.log('\n🎉 管理员头像分配完成！');

        // 关闭数据库连接
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ 分配管理员头像失败:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// 运行脚本
assignAdminAvatar();
