const mongoose = require('mongoose');
const CarouselImage = require('../models/CarouselImage');

// MongoDB 连接字符串
const MONGODB_URI = 'mongodb://localhost:27017/travel-blog';

// 轮播图数据配置
const carouselImages = [
    {
        name: '长白山',
        description: '长白山 - 雪域仙境，天池如镜，雪峰耸立，是东北最壮美的自然奇观',
        imagePath: '/images/Home/长白山.jpg',
        order: 1
    },
    {
        name: '上海外滩',
        description: '上海外滩 - 东方明珠，万国建筑博览群，黄浦江畔的繁华与历史交融',
        imagePath: '/images/Home/上海外滩.jpg',
        order: 2
    },
    {
        name: '厦门鼓浪屿',
        description: '厦门鼓浪屿 - 海上花园，琴岛风情，中西合璧的建筑艺术与浪漫的海岛风光',
        imagePath: '/images/Home/厦门鼓浪屿.jpg',
        order: 3
    },
    {
        name: '哈尔滨',
        description: '哈尔滨 - 冰城雪韵，欧式建筑与冰雪文化的完美结合，冬季的童话世界',
        imagePath: '/images/Home/哈尔滨.jpg',
        order: 4
    },
    {
        name: '贵州阿西里西大草原',
        description: '贵州阿西里西大草原 - 高原风光，云海翻腾，草原辽阔，是贵州的天然氧吧',
        imagePath: '/images/Home/贵州阿西里西大草原.jpg',
        order: 5
    }
];

async function initCarousel() {
    try {
        // 连接数据库
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB 连接成功');

        // 清空现有数据（可选）
        await CarouselImage.deleteMany({});
        console.log('✅ 已清空现有轮播图数据');

        // 插入轮播图数据
        const insertedImages = await CarouselImage.insertMany(carouselImages);
        console.log(`✅ 成功插入 ${insertedImages.length} 张轮播图`);

        // 显示插入的数据
        console.log('\n📸 轮播图列表:');
        insertedImages.forEach((img, index) => {
            console.log(`${index + 1}. ${img.name} - ${img.description}`);
            console.log(`   图片路径: ${img.imagePath}`);
        });

        console.log('\n🎉 轮播图初始化完成！');
        
        // 关闭数据库连接
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ 初始化失败:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// 运行初始化
initCarousel();

