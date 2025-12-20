import request from '../utils/request'

// 获取所有轮播图
export const getCarouselImages = async () => {
  const response = await request.get('/carousel')
  return response.data
}

