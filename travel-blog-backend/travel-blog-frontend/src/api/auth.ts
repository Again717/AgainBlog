import request from '../utils/request'

// 登录接口
export const login = async (email: string, password: string) => {
  const response = await request.post('/auth/login', {
    email,
    password
  })
  return response.data
}

// 注册接口
export const register = async (username: string, email: string, password: string, verificationCode?: string) => {
  const response = await request.post('/auth/register', {
    username,
    email,
    password,
    verificationCode
  })
  return response.data
}

// 发送邮箱验证码
export const sendVerificationCode = async (email: string) => {
  const response = await request.post('/auth/send-verification-code', {
    email
  })
  return response // 返回完整响应以便访问data.code
}

// 获取当前用户信息
export const getCurrentUser = async () => {
  try {
    const response = await request.get('/auth/me')
    return response.data
  } catch (error: any) {
    // 如果API不存在或服务器错误，静默处理
    if (error.response?.status === 404) {
      console.warn('用户信息刷新API不可用，使用本地缓存')
      return null
    }
    throw error
  }
}

// 发送邮箱验证邮件
export const sendEmailVerification = async (email: string) => {
  const response = await request.post('/auth/send-email-verification', { email })
  return response.data
}

// 更新用户资料
export const updateProfile = async (profileData: {
  username?: string
  email?: string
  bio?: string
  avatar?: string
  emailVerificationCode?: string
}) => {
  const response = await request.put('/auth/profile', profileData)
  return response.data
}

