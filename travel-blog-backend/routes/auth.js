const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();

// 验证码存储（内存存储，生产环境建议使用Redis）
const verificationCodes = new Map();

// 配置邮件发送器（使用Gmail或其他SMTP服务）
let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  // 如果配置了邮箱，使用真实邮件发送
  const emailUser = process.env.EMAIL_USER;
  const is163Email = emailUser.includes('@163.com');
  
  if (is163Email) {
    // 163邮箱配置
    transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true, // 使用SSL
      auth: {
        user: emailUser,
        pass: process.env.EMAIL_PASS // 163邮箱授权码
      }
    });
  } else {
    // Gmail或其他邮箱配置
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: process.env.EMAIL_PASS
      },
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // 验证邮件配置
  transporter.verify(function(error, success) {
    if (error) {
      console.error('邮件服务器配置错误:', error);
    } else {
      console.log('邮件服务器配置成功，可以使用真实邮箱发送验证码');
    }
  });
} else {
  // 未配置邮箱，直接报错（不再返回测试验证码）
  transporter = null;
  console.error('错误: 未配置邮箱环境变量 EMAIL_USER/EMAIL_PASS，无法发送验证码');
}

// 生成6位随机验证码
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 发送邮箱验证码
router.post('/send-verification-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: '请提供邮箱地址'
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: '邮箱格式不正确'
      });
    }

    // 检查邮箱是否已被注册
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: '该邮箱已被注册'
      });
    }

    // 生成验证码
    const code = generateVerificationCode();
    
    // 存储验证码（5分钟有效期）
    verificationCodes.set(email, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5分钟
    });

    // 必须配置邮箱才能发送
    if (!transporter) {
      return res.status(500).json({
        message: '验证码发送失败：未配置邮箱，请联系管理员配置 EMAIL_USER/EMAIL_PASS'
      });
    }

    // 如果配置了邮箱，发送邮件
    if (transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
      const mailOptions = {
          from: `"旅行博客" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '旅行博客 - 邮箱验证码',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #ff6b9d, #ff8fab); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                <h1 style="color: #ffffff; margin: 0;">旅行博客</h1>
              </div>
            <h2 style="color: #333;">邮箱验证码</h2>
              <p style="color: #666; font-size: 16px;">您正在注册旅行博客账户，验证码是：</p>
              <div style="background: #f5f5f5; padding: 30px; text-align: center; font-size: 36px; font-weight: bold; color: #ff6b9d; letter-spacing: 8px; margin: 30px 0; border-radius: 8px; border: 2px dashed #ff6b9d;">
              ${code}
              </div>
              <p style="color: #666; font-size: 14px;">验证码有效期为 <strong>5分钟</strong>，请勿泄露给他人。</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">如果这不是您的操作，请忽略此邮件。</p>
            </div>
          `,
          // 添加文本版本（备用）
          text: `您的旅行博客验证码是：${code}，有效期为5分钟。`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('邮件发送成功:', info.messageId);
        console.log('验证码已发送到:', email);
      } catch (emailError) {
        console.error('邮件发送失败:', emailError);
        return res.status(500).json({
          message: '邮件发送失败，请稍后重试',
          error: emailError.message
        });
      }
    } else {
      return res.status(500).json({
        message: '验证码发送失败：未配置邮箱',
      });
    }

    res.json({
      message: '验证码已发送到您的邮箱'
    });
  } catch (error) {
    console.error('发送验证码失败:', error);
    res.status(500).json({
      message: '发送验证码失败，请稍后重试',
      error: error.message
    });
  }
});

// 验证验证码
function verifyCode(email, code) {
  const stored = verificationCodes.get(email);
  if (!stored) {
    return false;
  }
  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(email);
    return false;
  }
  if (stored.code !== code) {
    return false;
  }
  // 验证成功后删除验证码
  verificationCodes.delete(email);
  return true;
}

// 用户注册端点
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, verificationCode } = req.body;

        // 验证必填字段
        if (!username || !email || !password) {
            return res.status(400).json({
                message: '请填写所有必填字段'
            });
        }

        // 验证验证码
        if (!verificationCode) {
            return res.status(400).json({
                message: '请输入邮箱验证码'
            });
        }

        if (!verifyCode(email, verificationCode)) {
            return res.status(400).json({
                message: '验证码错误或已过期，请重新获取'
            });
        }

        // 检查用户是否已存在（通过邮箱或用户名）
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: '用户已存在，请使用其他邮箱或用户名'
            });
        }

        // 使用 bcryptjs 对密码进行加密（盐轮数为 12）
        const hashedPassword = await bcrypt.hash(password, 12);

        // 创建新用户
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // 保存到数据库
        await newUser.save();

        // 返回成功响应
        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        // 处理错误（如重复键错误等）
        if (error.code === 11000) {
            // MongoDB 唯一索引冲突错误
            return res.status(400).json({
                message: '用户已存在，请使用其他邮箱或用户名'
            });
        }

        res.status(400).json({
            message: '注册失败，请稍后重试',
            error: error.message
        });
    }
});

// 用户登录端点
router.post('/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // 确定查找字段（优先使用 email，如果没有则使用 username）
        const searchField = email || username;
        
        if (!searchField || !password) {
            return res.status(400).json({
                message: '请提供邮箱或用户名以及密码'
            });
        }

        // 通过邮箱或用户名查找用户
        const user = await User.findOne({
            $or: [
                { email: searchField },
                { username: searchField }
            ]
        });

        // 如果用户不存在，返回 400 错误
        if (!user) {
            return res.status(400).json({
                message: '用户不存在或密码错误'
            });
        }

        // 使用 bcryptjs.compare 比较传入的密码和数据库中的哈希密码
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // 如果密码不匹配，返回 400 错误
        if (!isPasswordValid) {
            return res.status(400).json({
                message: '用户不存在或密码错误'
            });
        }

        // 如果匹配成功，生成 JWT
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            'your_jwt_secret', // JWT 密钥（后续会移到环境变量）
            {
                expiresIn: '7d' // 过期时间：7天
            }
        );

        // 返回成功响应
        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        res.status(400).json({
            message: '登录失败，请稍后重试',
            error: error.message
        });
    }
});

module.exports = router;

