@echo off
chcp 65001 >nul
title 后端服务器 - Travel Blog API
color 0A

echo ========================================
echo    Travel Blog 后端服务器启动器
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo ✅ Node.js 已安装
echo.

echo [2/4] 检查依赖...
if not exist "node_modules" (
    echo ⚠️  依赖未安装，正在安装...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)
echo.

echo [3/4] 检查 MongoDB...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo ⚠️  无法检测 MongoDB 服务状态
    echo 提示: 如果 MongoDB 未运行，服务器仍会启动但数据库功能不可用
) else (
    echo ✅ MongoDB 服务检测完成
)
echo.

echo [4/4] 启动服务器...
echo.
echo ========================================
echo 服务器正在启动...
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

call npm run dev

echo.
echo ========================================
echo 服务器已停止
echo ========================================
pause
