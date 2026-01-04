import request from '../utils/request'

// 获取所有文章
export const getArticles = async () => {
  const response = await request.get('/articles')
  return response.data
}

// 获取单篇文章
export const getArticle = async (id: string) => {
  const response = await request.get(`/articles/${id}`)
  return response.data
}

// 创建文章（需要认证）
export const createArticle = async (articleData: {
  title: string
  content: string
  htmlContent?: string
  coverImage?: string
  tags?: string[]
}) => {
  const response = await request.post('/articles', articleData)
  return response.data
}






















