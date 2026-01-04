import { useLanguageStore } from '../stores/useLanguageStore'

export const translations = {
  zh: {
    nav: {
      home: '首页',
      stories: '旅行故事',
      tips: '攻略分享',
      community: '社区',
      login: '登录'
    },
    home: {
      title: 'Again Blog',
      hero: {
        slide1: '旅行，是启发他人，也让自己被世界感动。',
        slide2: '每一个目的地都是全新的开始。',
        slide3: '在路上，遇见更好的自己。',
        slide4: '世界那么大，一起去看看。',
        slide5: '用脚步丈量世界，用心灵感受美好。'
      },
      tips: {
        title: '我们总会预留延误时间，也尽量不为突发状况而心烦',
        text1: '制定行程时别忘了这些小提醒：',
        text2: '提前预留缓冲，面对变动保持从容；重要物品要收纳在身，行程准备 Plan B；越灵活，就越能享受旅途。',
        text3: '旅行从来不仅是抵达某个地点，而是沿途经历的故事与记忆。',
        readMore: '阅读全文'
      },
      stories: {
        title: 'Again的旅行故事'
      },
      blog: {
        title: '目的地从来不是终点，而是看世界的全新方式。',
        category: '旅行贴士',
        author: '作者：向导'
      },
      gallery: {
        title: '旅行者们的瞬间，这里收藏了他们的足迹。'
      },
      newsletter: {
        title: '输入您的邮箱，获取旅行指南。',
        email: '邮箱',
        message: '消息',
        send: '发送'
      }
    },
    welcome: {
      title: '欢迎进入 Again 的旅行博客',
      text1: '在这里你可以分享你的旅行故事、风景、有趣的事物...所有所有都可以！还可以看看不一样的目的地，',
      text2: '我已经非常期待看到你的故事了！',
      enter: '进入首页'
    }
  },
  en: {
    nav: {
      home: 'Home',
      stories: 'Stories',
      tips: 'Tips',
      community: 'Community',
      login: 'Login'
    },
    home: {
      title: 'Again Blog',
      hero: {
        slide1: 'To travel is to inspire and to be inspired!',
        slide2: 'Every destination is a new beginning.',
        slide3: 'On the road, meet a better self.',
        slide4: 'The world is so big, let\'s explore it together.',
        slide5: 'Measure the world with steps, feel beauty with heart.'
      },
      tips: {
        title: 'We always plan for delays and try not to get upset when things happen',
        text1: 'Here are some reminders when planning your trip:',
        text2: 'Leave buffer time and stay calm when changes occur; keep important items close and have a Plan B; the more flexible you are, the more you\'ll enjoy your journey.',
        text3: 'Travel is never just about reaching a destination, but about the stories and memories you create along the way.',
        readMore: 'Read More'
      },
      stories: {
        title: "Again's Travel Stories"
      },
      blog: {
        title: 'A destination is never a place, but a new way of seeing things.',
        category: 'Travel Tips',
        author: 'By Guide'
      },
      gallery: {
        title: 'Moments captured by travelers, their footprints collected here.'
      },
      newsletter: {
        title: 'Enter your email for your travel guide.',
        email: 'Email',
        message: 'Message',
        send: 'Send'
      }
    },
    welcome: {
      title: 'Welcome to Again\'s Travel Blog',
      text1: 'Here you can share your travel stories, scenery, interesting things... everything! You can also explore different destinations,',
      text2: 'I\'m very excited to see your stories!',
      enter: 'Enter Home'
    }
  }
}

export function useI18n() {
  const languageStore = useLanguageStore()
  
  return {
    t: (path: string) => {
      const keys = path.split('.')
      let value: any = translations[languageStore.language]
      for (const key of keys) {
        value = value?.[key]
      }
      return value || path
    },
    language: languageStore.language
  }
}



















