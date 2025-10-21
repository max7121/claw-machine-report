@echo off
chcp 65001 >nul
echo 🚀 正在啟動本地測試服務器...
echo.
echo 📋 使用說明：
echo    1. 此服務器會模擬 update.feiloli.com.tw:5539
echo    2. 已正確設定 CORS 標頭解決跨域問題
echo    3. 啟動後請修改您的 HTML 中的 baseUrl
echo    4. 將 baseUrl 改為: http://localhost:5539
echo.

python test-server.py

if errorlevel 1 (
    echo.
    echo ❌ Python 啟動失敗，請檢查：
    echo    1. 確認已安裝 Python
    echo    2. Python 已加入系統 PATH
    echo    3. 嘗試使用 python3 test-server.py
    echo.
    pause
)