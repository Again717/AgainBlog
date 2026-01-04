import request from '../utils/request'

// 旅行故事数据类型
export interface TravelStory {
  _id: string
  image: string
  name: string
  location: string
  description: string
  count: string
  themeColor: string
  likes: number
  comments: number
  liked: boolean
  commentList: Comment[]
}

export interface Comment {
  _id: string
  user: string
  userAvatar?: string
  content: string
  time: string
  likes: number
  liked: boolean
  replies: Reply[]
}

export interface Reply {
  _id: string
  user: string
  userAvatar?: string
  content: string
  time: string
}

// 获取所有旅行故事
export const getTravelStories = async (): Promise<{
  success: boolean
  data: TravelStory[]
  count: number
}> => {
  const response = await request.get('/travel-stories')
  return response.data
}

// 点赞/取消点赞旅行故事（需要认证）
export const likeTravelStory = async (storyId: string): Promise<{
  success: boolean
  message: string
  data: TravelStory
}> => {
  const response = await request.post(`/travel-stories/${storyId}/like`)
  return response.data
}

// 评论旅行故事（需要认证）
export const commentTravelStory = async (storyId: string, content: string): Promise<{
  success: boolean
  message: string
  data: TravelStory
}> => {
  const response = await request.post(`/travel-stories/${storyId}/comment`, { content })
  return response.data
}

// 点赞评论（需要认证）
export const likeTravelStoryComment = async (storyId: string, commentId: string): Promise<{
  success: boolean
  message: string
  data: TravelStory
}> => {
  const response = await request.post(`/travel-stories/${storyId}/comments/${commentId}/like`)
  return response.data
}

// 回复评论（需要认证）
export const replyTravelStoryComment = async (storyId: string, commentId: string, content: string): Promise<{
  success: boolean
  message: string
  data: TravelStory
}> => {
  const response = await request.post(`/travel-stories/${storyId}/comments/${commentId}/reply`, { content })
  return response.data
}
