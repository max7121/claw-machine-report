# CORS 錯誤解決方案

## 問題說明
您遇到的 CORS（跨域資源共享）錯誤是瀏覽器的安全機制，當網頁嘗試從不同域名、埠號或協議取得資源時會觸發。

## 🚀 快速解決方案

### 方案1：使用本地測試服務器（推薦）
1. **啟動測試服務器**：
   - 雙擊 `start-test-server.bat` 
   - 或在命令行執行：`python test-server.py`

2. **使用 Live Server**：
   - 在 VS Code 中安裝 Live Server 擴充功能
   - 右鍵點擊 `index.html` → "Open with Live Server"
   - 系統會自動切換到測試模式

### 方案2：伺服器端解決（需要後端配合）
伺服器需要添加 CORS 標頭：
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### 方案3：瀏覽器擴充功能
- Chrome：安裝 "CORS Unblock" 或類似擴充功能
- Firefox：安裝 "CORS Everywhere" 擴充功能

### 方案4：使用代理服務
程式已內建以下代理服務：
- AllOrigins API
- CORS Anywhere
- ThingProxy

## 🔧 程式已包含的改進

1. **自動代理重試**：當直接請求失敗時，自動嘗試多個代理服務
2. **智慧模式切換**：本機運行時自動使用測試服務器
3. **詳細錯誤報告**：提供具體的解決建議
4. **直接連結開啟**：CORS 失敗時自動開啟新分頁

## 📋 測試步驟

1. **測試本地模式**：
   ```bash
   # 啟動測試服務器
   python test-server.py
   
   # 用 Live Server 開啟 index.html
   # 或直接在瀏覽器中訪問 http://localhost:5500/index.html
   ```

2. **測試遠端連接**：
   - 直接開啟 index.html（file:// 協議）
   - 系統會嘗試代理服務
   - 失敗時會提供直接連結

## ⚠️ 注意事項

- **安全性**：生產環境建議在伺服器端正確設定 CORS
- **效能**：代理服務可能較慢，建議優先使用直接連接
- **穩定性**：公共代理服務可能不穩定，重要應用請使用自架服務器

## 🆘 如果仍有問題

1. 檢查控制台的錯誤訊息
2. 確認網路連接正常
3. 嘗試不同瀏覽器
4. 檢查防火牆設定
5. 聯繫系統管理員設定伺服器 CORS

## 📞 技術支援

如需進一步協助，請提供：
- 瀏覽器類型和版本
- 完整的錯誤訊息
- 網路環境資訊
- 是否使用公司防火牆/代理

---
*更新時間：2024-10-21*