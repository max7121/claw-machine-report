# HTTP GET 配置說明

## ✅ 已完成的改動

### 1. 核心功能替換
- ✅ 將 MQTT 連線機制改為 HTTP GET 輪詢
- ✅ 保留原有 UI 元素（暫時），可透過介面配置
- ✅ 新增完整的 HTTP 請求處理函數

### 2. 新增的功能
- **`sendHttpRequest()`** - 發送 HTTP GET 請求
- **`startHttpPolling()`** - 開始定時輪詢
- **`stopHttpPolling()`** - 停止輪詢
- **`testHttpConnection()`** - 測試連線
- **`handleHttpResponse(data)`** - 處理伺服器回應（待實作）
- **`updateHttpStatus()`** - 更新連線狀態顯示

### 3. 配置變數
```javascript
const httpConfig = {
    baseUrl: '',      // 伺服器基礎位址
    endpoint: '',     // API 端點路徑
    params: {},       // GET 查詢參數
    headers: {},      // HTTP 標頭
    timeout: 10000    // 超時時間（毫秒）
};

let httpPollingInterval = 5000;  // 輪詢間隔（毫秒）
```

---

## 📋 請提供以下資訊

### 必填項目：
1. **伺服器位址 (Base URL)**
   - 格式：`http://domain.com:port` 或 `https://domain.com`
   - 範例：`http://update.feiloli.com.tw:5438`
   - 您的伺服器：`___________________`

2. **API 端點路徑 (Endpoint)**
   - 格式：`/path/to/endpoint`
   - 範例：`/api/getData` 或 `/readdata`
   - 您的端點：`___________________`

### 選填項目：

3. **查詢參數 (Query Parameters)**
   - 是否需要？ ☐ 是 ☐ 否
   - 如需要，請提供 JSON 格式：
   ```json
   {
     "mac": "083A8DE1EC88",
     "devid": "1",
     "floor": "1"
   }
   ```

4. **HTTP 標頭 (Headers)**
   - 是否需要身份驗證？ ☐ 是 ☐ 否
   - 如需要，請提供：
   ```json
   {
     "Authorization": "Bearer YOUR_TOKEN",
     "X-API-Key": "YOUR_KEY"
   }
   ```

5. **輪詢設定**
   - 輪詢間隔（秒）：`_____` （預設 5 秒）
   - 請求超時（秒）：`_____` （預設 10 秒）

6. **回應格式**
   - 資料格式：☐ JSON ☐ XML ☐ 純文字 ☐ 其他：_______
   - 請提供範例回應：
   ```json
   {
     "示例": "請貼上實際的伺服器回應"
   }
   ```

---

## 🔧 完整 URL 範例

假設您提供：
- Base URL: `http://example.com:8080`
- Endpoint: `/api/getData`
- 參數: `{"mac": "083A8DE1EC88", "devid": "1"}`

最終請求 URL 將是：
```
http://example.com:8080/api/getData?mac=083A8DE1EC88&devid=1
```

---

## 📝 範例配置

### 範例 1：無參數的簡單請求
```javascript
httpConfig.baseUrl = 'http://192.168.1.100:5438';
httpConfig.endpoint = '/status';
// GET http://192.168.1.100:5438/status
```

### 範例 2：帶參數的請求
```javascript
httpConfig.baseUrl = 'http://update.feiloli.com.tw:5438';
httpConfig.endpoint = '/api/readdata';
httpConfig.params = {
    mac: '083A8DE1EC88',
    devid: '1'
};
// GET http://update.feiloli.com.tw:5438/api/readdata?mac=083A8DE1EC88&devid=1
```

### 範例 3：需要身份驗證
```javascript
httpConfig.baseUrl = 'https://api.example.com';
httpConfig.endpoint = '/v1/data';
httpConfig.headers = {
    'Authorization': 'Bearer abc123xyz',
    'Content-Type': 'application/json'
};
```

---

## ⚡ 快速測試

在瀏覽器控制台執行：

```javascript
// 1. 設定配置
httpConfig.baseUrl = 'http://your-server.com:5438';
httpConfig.endpoint = '/api/endpoint';
httpConfig.params = { key: 'value' };

// 2. 測試單次請求
await testHttpConnection();

// 3. 開始輪詢
startHttpPolling();

// 4. 停止輪詢
stopHttpPolling();
```

---

## 📊 後續需要實作的部分

完成配置後，還需要實作：

### `handleHttpResponse(data)` 函數
根據您的資料格式處理回應，例如：
- 解析資料
- 更新 UI
- 儲存到 Firebase
- 顯示在命令記錄中

範例：
```javascript
function handleHttpResponse(data) {
    console.log('收到資料:', data);
    
    // 根據您的資料格式進行處理
    if (data.status === 'success') {
        // 更新 UI
        document.getElementById('data-display').textContent = JSON.stringify(data, null, 2);
        
        // 儲存到 Firebase（如需要）
        // saveToFirebase(data);
    }
}
```

---

## ✅ 待辦事項

- [ ] 提供伺服器位址和端點
- [ ] 提供查詢參數格式
- [ ] 提供範例回應資料
- [ ] 確認是否需要身份驗證
- [ ] 實作 `handleHttpResponse()` 函數
- [ ] 測試完整流程
- [ ] （選填）移除或隱藏原 MQTT UI

---

請將上述資訊填寫完整後提供給我，我將完成最後的配置！
