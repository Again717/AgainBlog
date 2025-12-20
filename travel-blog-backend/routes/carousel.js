const express = require('express');
const CarouselImage = require('../models/CarouselImage');

const router = express.Router();

// GET /api/carousel - 获取所有轮播图
router.get('/', async (req, res) => {
    try {
        const carouselImages = await CarouselImage.find()
            .sort({ order: 1, createdAt: 1 }); // 按order排序，然后按创建时间排序

        res.json({
            success: true,
            data: carouselImages,
            count: carouselImages.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取轮播图列表失败',
            error: error.message
        });
    }
});

// POST /api/carousel - 创建新的轮播图（可选，用于管理）
router.post('/', async (req, res) => {
    try {
        const { name, description, imagePath, order } = req.body;
        
        // 验证必填字段
        if (!name || !description || !imagePath) {
            return res.status(400).json({
                success: false,
                message: '名称、描述和图片路径为必填项'
            });
        }

        // 创建新轮播图
        const newCarouselImage = new CarouselImage({
            name,
            description,
            imagePath,
            order: order || 0
        });

        await newCarouselImage.save();

        res.status(201).json({
            success: true,
            message: '轮播图创建成功',
            data: newCarouselImage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '创建轮播图失败',
            error: error.message
        });
    }
});

module.exports = router;

