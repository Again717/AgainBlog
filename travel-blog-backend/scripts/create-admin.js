const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// MongoDB 连接字符串
const MONGODB_URI = 'mongodb://localhost:27017/travel-blog';

async function createAdmin() {
  try {
    // 连接数据库
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 连接成功');

    const adminEmail = '1256066604@qq.com';
    const adminPassword = 'whxznjgn1230';
    const adminUsername = 'Again';

    // 检查管理员是否已存在
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminEmail },
        { username: adminUsername }
      ]
    });

    if (existingAdmin) {
      // 如果存在，更新为管理员
      existingAdmin.role = 'admin';
      existingAdmin.password = await bcrypt.hash(adminPassword, 12);
      await existingAdmin.save();
      console.log('✅ 管理员账号已更新');
      console.log(`   邮箱: ${adminEmail}`);
      console.log(`   用户名: ${adminUsername}`);
      console.log(`   角色: admin`);
    } else {
      // 如果不存在，创建新管理员
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      const admin = new User({
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        bio: '旅行博主，记录生活中的美好瞬间'
      });

      await admin.save();
      console.log('✅ 管理员账号创建成功');
      console.log(`   邮箱: ${adminEmail}`);
      console.log(`   用户名: ${adminUsername}`);
      console.log(`   密码: ${adminPassword}`);
      console.log(`   角色: admin`);
    }

    console.log('\n🎉 管理员账号准备就绪！');
    
    // 关闭数据库连接
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ 创建管理员失败:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// 运行创建管理员
createAdmin();

