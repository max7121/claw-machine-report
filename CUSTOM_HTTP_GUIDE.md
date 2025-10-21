# 🔧 自訂 HTTP GET 命令使用說明

## ✨ 功能特色

全新的「自訂 HTTP GET 命令」區塊讓您可以：
- 🎯 **自由填寫任何 API 端點**
- 🔑 **支援查詢參數和 HTTP 標頭**
- 👁️ **即時預覽完整 URL**
- 📥 **查看格式化的回應結果**
- 💾 **儲存常用模板**
- ⚡ **快速套用預設模板**

---

## 📋 欄位說明

### 1. 伺服器位址 (選填)
- **留空**：使用預設伺服器 `http://update.feiloli.com.tw:5539`
- **填寫**：使用自訂伺服器，例如：
  ```
  http://192.168.1.100:8080
  https://api.example.com
  ```

### 2. API 端點路徑 (必填) ⭐
- 以 `/` 開頭的路徑
- 可以包含動態參數
- 範例：
  ```
  /textselectdata/083A8DE1ED14
  /api/getData
  /health
  /status?verbose=true
  ```

### 3. 查詢參數 (選填)
- **JSON 格式**，會自動轉換為 URL 參數
- 範例：
  ```json
  {
    "mac": "083A8DE1ED14",
    "devid": "1",
    "format": "json"
  }
  ```
- 轉換結果：`?mac=083A8DE1ED14&devid=1&format=json`

### 4. HTTP 標頭 (選填)
- **JSON 格式**，用於身份驗證或自訂標頭
- 範例：
  ```json
  {
    "Authorization": "Bearer abc123xyz",
    "X-API-Key": "YOUR_KEY",
    "Content-Type": "application/json"
  }
  ```

---

## 🎮 操作按鈕

### 📤 發送請求
- 發送 HTTP GET 請求到指定的 URL
- 回應會顯示在下方的「回應結果」區塊
- 包含狀態碼、回應時間、內容類型和資料

### 👁️ 預覽 URL
- 顯示最終的完整 URL
- 包含查詢參數
- 用於確認 URL 格式正確

### 💾 儲存模板
- 將當前設定儲存為模板
- 儲存在瀏覽器的 localStorage
- 下次可快速套用

### 🗑️ 清空
- 清空所有輸入欄位
- 重置回應結果

### 📋 複製
- 複製回應結果到剪貼簿
- 方便貼到其他地方使用

---

## 🚀 使用範例

### 範例 1：讀取機台資料（預設伺服器）

**設定：**
```
伺服器位址：[留空]
API 端點：/textselectdata/083A8DE1ED14
查詢參數：[留空]
HTTP 標頭：[留空]
```

**最終 URL：**
```
http://update.feiloli.com.tw:5539/textselectdata/083A8DE1ED14
```

---

### 範例 2：帶查詢參數的請求

**設定：**
```
伺服器位址：[留空]
API 端點：/api/getData
查詢參數：
{
  "mac": "083A8DE1ED14",
  "devid": "1"
}
HTTP 標頭：[留空]
```

**最終 URL：**
```
http://update.feiloli.com.tw:5539/api/getData?mac=083A8DE1ED14&devid=1
```

---

### 範例 3：需要身份驗證的請求

**設定：**
```
伺服器位址：https://api.example.com
API 端點：/v1/data
查詢參數：[留空]
HTTP 標頭：
{
  "Authorization": "Bearer YOUR_TOKEN",
  "X-API-Key": "YOUR_KEY"
}
```

**最終 URL：**
```
https://api.example.com/v1/data
```

---

### 範例 4：健康檢查

**設定：**
```
伺服器位址：[留空]
API 端點：/health
查詢參數：[留空]
HTTP 標頭：[留空]
```

**最終 URL：**
```
http://update.feiloli.com.tw:5539/health
```

---

## ⚡ 快速模板

已預設三個常用模板，點擊即可套用：

1. **讀取資料 (預設 MAC)**
   - 端點：`/textselectdata/083A8DE1ED14`

2. **系統狀態**
   - 端點：`/api/status`

3. **健康檢查**
   - 端點：`/health`

---

## 📊 回應結果格式

成功時顯示：
```json
{
  "status": 200,
  "statusText": "OK",
  "time": "125ms",
  "contentType": "application/json",
  "data": {
    // 伺服器回傳的資料
  }
}
```

失敗時顯示：
```json
{
  "error": "Failed to fetch",
  "name": "TypeError",
  "url": "http://..."
}
```

---

## 💡 實用技巧

### 技巧 1：即時預覽
輸入欄位會自動更新 URL 預覽，隨時確認格式正確

### 技巧 2：JSON 驗證
如果 JSON 格式錯誤，發送時會提示錯誤訊息

### 技巧 3：複製回應
點擊「📋 複製」按鈕快速複製完整回應

### 技巧 4：查看詳細日誌
開啟瀏覽器控制台 (F12) 查看完整的請求/回應日誌

### 技巧 5：儲存常用設定
將常用的 API 設定儲存為模板，下次一鍵套用

---

## 🔍 故障排除

### Q1: 點擊「發送請求」沒反應
**檢查：**
- API 端點路徑是否已填寫
- 伺服器是否正常運行
- 查看控制台的錯誤訊息

### Q2: JSON 格式錯誤
**解決：**
- 確保使用正確的 JSON 格式
- 屬性名稱必須用雙引號
- 最後一個項目後面不要有逗號
- 使用線上 JSON 驗證工具檢查

**正確範例：**
```json
{
  "key1": "value1",
  "key2": "value2"
}
```

**錯誤範例：**
```json
{
  key1: "value1",      // ❌ 缺少引號
  "key2": "value2",    // ❌ 多餘的逗號
}
```

### Q3: CORS 錯誤
**錯誤訊息：**
```
Access to fetch at '...' has been blocked by CORS policy
```

**解決方法：**
伺服器需要設定 CORS 標頭：
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: *
```

### Q4: 超時錯誤
**原因：**
- 伺服器回應時間過長（預設 10 秒超時）
- 網路連線問題

**解決：**
在控制台修改超時時間：
```javascript
httpConfig.timeout = 30000; // 30 秒
```

---

## 🎯 進階使用

### 在控制台直接呼叫函數

```javascript
// 1. 建構並預覽 URL
previewCustomUrl();

// 2. 發送自訂請求
await sendCustomHttpRequest();

// 3. 清空表單
clearCustomForm();

// 4. 複製回應
copyCustomResponse();

// 5. 儲存模板
saveCustomTemplate();
```

### 程式化設定值

```javascript
// 設定伺服器位址
document.getElementById('custom-base-url').value = 'http://192.168.1.100:8080';

// 設定端點
document.getElementById('custom-endpoint').value = '/api/getData';

// 設定參數
document.getElementById('custom-params').value = JSON.stringify({
  mac: '083A8DE1ED14',
  devid: '1'
});

// 設定標頭
document.getElementById('custom-headers').value = JSON.stringify({
  'Authorization': 'Bearer token123'
});

// 更新預覽
updateCustomPreview();
```

---

## 📱 介面特色

- 🎨 **漸層背景**：藍紫色漸層，易於識別
- ⚡ **即時反饋**：輸入即時更新預覽
- 🎯 **清晰分類**：欄位分明，操作直覺
- 📊 **結果展示**：格式化顯示，易於閱讀
- 🎨 **顏色編碼**：
  - 🟢 綠色 = 成功
  - 🔴 紅色 = 失敗
  - 🟡 黃色 = 處理中
  - 🔵 藍色 = 資訊

---

## ✅ 使用流程

1. **填寫設定**
   - 輸入 API 端點路徑（必填）
   - 選填其他欄位

2. **預覽確認**
   - 點擊「👁️ 預覽 URL」
   - 確認完整 URL 正確

3. **發送請求**
   - 點擊「📤 發送請求」
   - 等待回應

4. **查看結果**
   - 在「回應結果」區塊查看
   - 或在控制台查看完整日誌

5. **儲存模板** (選用)
   - 點擊「💾 儲存模板」
   - 輸入模板名稱
   - 下次快速套用

---

現在您可以自由測試任何 HTTP GET API 了！🎉
