const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Article = require('../models/Article');

// MongoDB 连接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-blog';

console.log('========================================');
console.log('数据库初始化脚本');
console.log('========================================');
console.log('连接字符串:', MONGODB_URI);
console.log('');

// 连接数据库
mongoose.connect(MONGODB_URI)
.then(async () => {
    console.log('✅ MongoDB 连接成功');
    console.log('数据库名称:', mongoose.connection.db.databaseName);
    console.log('');

    try {
        // 获取数据库实例
        const db = mongoose.connection.db;
        
        // 列出所有集合
        const collections = await db.listCollections().toArray();
        console.log('📋 当前数据库中的集合:');
        if (collections.length === 0) {
            console.log('  (暂无集合，将在首次使用时自动创建)');
        } else {
            collections.forEach(col => {
                console.log(`  - ${col.name}`);
            });
        }
        console.log('');

        // 创建索引（确保集合存在）
        console.log('🔧 创建索引和验证集合...');
        
        // User 集合索引
        try {
            await User.createIndexes();
            console.log('  ✅ User 集合索引已创建');
        } catch (error) {
            console.log('  ⚠️  User 集合索引:', error.message);
        }

        // Post 集合索引
        try {
            await Post.createIndexes();
            console.log('  ✅ Post 集合索引已创建');
        } catch (error) {
            console.log('  ⚠️  Post 集合索引:', error.message);
        }

        // Article 集合索引
        try {
            await Article.createIndexes();
            console.log('  ✅ Article 集合索引已创建');
        } catch (error) {
            console.log('  ⚠️  Article 集合索引:', error.message);
        }

        console.log('');

        // 统计文档数量
        console.log('📊 数据库统计:');
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const articleCount = await Article.countDocuments();
        
        console.log(`  Users: ${userCount} 个用户`);
        console.log(`  Posts: ${postCount} 条动态`);
        console.log(`  Articles: ${articleCount} 篇文章`);
        console.log('');

        // 列出所有集合（再次检查）
        const finalCollections = await db.listCollections().toArray();
        console.log('📋 最终集合列表:');
        if (finalCollections.length === 0) {
            console.log('  (集合将在首次插入数据时自动创建)');
        } else {
            finalCollections.forEach(col => {
                console.log(`  - ${col.name}`);
            });
        }
        console.log('');

        console.log('========================================');
        console.log('✅ 数据库初始化完成！');
        console.log('========================================');
        console.log('');
        console.log('提示:');
        console.log('  - MongoDB 会在首次插入数据时自动创建集合');
        console.log('  - 数据库名称: travel-blog');
        console.log('  - 现在可以启动服务器了: npm run dev');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ 初始化过程出错:', error.message);
        console.error(error);
        process.exit(1);
    }
})
.catch((error) => {
    console.error('❌ MongoDB 连接失败:', error.message);
    console.error('');
    console.error('请检查:');
    console.error('  1. MongoDB 服务是否正在运行');
    console.error('  2. 连接字符串是否正确:', MONGODB_URI);
    console.error('  3. MongoDB 是否监听在 localhost:27017');
    console.error('');
    process.exit(1);
});

