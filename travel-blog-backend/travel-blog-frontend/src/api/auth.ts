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

