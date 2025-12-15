import request from '../utils/request'

// 获取所有动态
export const getPosts = async () => {
  const response = await request.get('/posts')
  return response.data
}

// 发布动态（需要认证）
export const createPost = async (postData: {
  content: string
  images?: string[]
  location?: {
    name: string
    coordinates: {
      lat: number
      lng: number
    }
  }
}) => {
  const response = await request.post('/posts', postData)
  return response.data
}

// 点赞/取消点赞动态（需要认证）
export const likePost = async (postId: string) => {
  const response = await request.post(`/posts/${postId}/like`)
  return response.data
}

// 评论动态（需要认证）
export const commentPost = async (postId: string, content: string) => {
  const response = await request.post(`/posts/${postId}/comment`, { content })
  return response.data
}

// 收藏/取消收藏动态（需要认证）
export const favoritePost = async (postId: string) => {
  const response = await request.post(`/posts/${postId}/favorite`)
  return response.data
}

