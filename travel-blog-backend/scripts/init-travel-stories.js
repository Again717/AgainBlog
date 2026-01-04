const mongoose = require('mongoose');
const TravelStory = require('../models/TravelStory');

// 旅行故事数据 - 从 HomeView.vue 中提取
const travelStoriesData = [
  {
    name: '我在長白山很想你',
    location: '长白山，中国',
    description: '冷冽的山风裹着热乎乎的思念，在雪线边写下这句想你。长白山天池如镜，雪峰耸立，是东北最壮美的自然奇观。',
    image: '/images/Home/长白山.jpg',
    count: '12 place to visited',
    themeColor: '#e0f2fe',
    order: 1
  },
  {
    name: '繁华都市的日常',
    location: '上海，中国',
    description: '人潮和霓虹灯下，每一次驻足都是和这座城的短暂对话。外滩万国建筑博览群，黄浦江畔的繁华与历史交融。',
    image: '/images/Home/上海外滩.jpg',
    count: '28 place to visited',
    themeColor: '#fee2e2',
    order: 2
  },
  {
    name: '海天一色的城市',
    location: '鼓浪屿，中国',
    description: '老房子、红瓦和海风，把时间拉得很慢很慢。海上花园，琴岛风情，中西合璧的建筑艺术与浪漫的海岛风光。',
    image: '/images/Home/厦门鼓浪屿.jpg',
    count: '35 place to visited',
    themeColor: '#ffedd5',
    order: 3
  },
  {
    name: '冰城雪韵',
    location: '哈尔滨，中国',
    description: '冰城雪韵，欧式建筑与冰雪文化的完美结合，冬季的童话世界。抬头是灯火辉煌的高楼，低头是各自奔赴的生活。',
    image: '/images/Home/哈尔滨.jpg',
    count: '18 place to visited',
    themeColor: '#e5e7eb',
    order: 4
  },
  {
    name: '高原风光',
    location: '贵州阿西里西大草原，中国',
    description: '高原风光，云海翻腾，草原辽阔，是贵州的天然氧吧。按下快门的那一秒，风、光和心情刚刚好。',
    image: '/images/Home/贵州阿西里西大草原.jpg',
    count: '22 place to visited',
    themeColor: '#fef3c7',
    order: 5
  }
];

async function initTravelStories() {
  try {
    // 连接数据库
    await mongoose.connect('mongodb://localhost:27017/travel-blog');
    console.log('MongoDB 连接成功');

    // 清空现有数据
    await TravelStory.deleteMany({});
    console.log('已清空现有旅行故事数据');

    // 插入新数据
    const insertedStories = await TravelStory.insertMany(travelStoriesData);
    console.log(`成功插入 ${insertedStories.length} 条旅行故事数据`);

    // 显示插入的数据
    console.log('\n插入的旅行故事:');
    insertedStories.forEach((story, index) => {
      console.log(`${index + 1}. ${story.name} - ${story.location}`);
    });

    console.log('\n旅行故事数据初始化完成！');

  } catch (error) {
    console.error('初始化旅行故事数据失败:', error);
  } finally {
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('数据库连接已关闭');
  }
}

// 运行初始化脚本
if (require.main === module) {
  initTravelStories();
}

module.exports = initTravelStories;