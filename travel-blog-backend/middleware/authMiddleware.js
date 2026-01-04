const jwt = require('jsonwebtoken');

// JWT 密钥（后续应该移到环境变量）
const JWT_SECRET = 'your_jwt_secret';

/**
 * 认证中间件
 * 从请求头中提取并验证 JWT token
 * 如果验证成功，将用户信息添加到 req.user
 */
const authMiddleware = (req, res, next) => {
    try {
        // 从请求头中获取 Authorization 字段
        const authHeader = req.headers.authorization;

        // 检查 Authorization 头是否存在
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: '未提供认证令牌，请先登录'
            });
        }

        // 提取 token（格式：Bearer <token>）
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: '认证令牌格式错误'
            });
        }

        // 验证 token
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // 将解码后的用户信息添加到 req.user
            req.user = {
                id: decoded.id,
                _id: decoded.id, // MongoDB 通常使用 _id
                username: decoded.username
            };

            // 继续下一个中间件或路由处理
            next();
        } catch (verifyError) {
            // Token 验证失败（过期、无效等）
            return res.status(401).json({
                success: false,
                message: '认证令牌无效或已过期，请重新登录'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: '认证中间件错误',
            error: error.message
        });
    }
};

module.exports = authMiddleware;






















