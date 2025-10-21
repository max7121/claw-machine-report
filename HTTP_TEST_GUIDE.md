# ✅ HTTP GET 配置完成

## 🎉 已完成配置

### 伺服器設定
- **Base URL**: `http://update.feiloli.com.tw:5539`
- **API 端點**: `/textselectdata/{mac}`
- **完整 URL 範例**: `http://update.feiloli.com.tw:5539/textselectdata/083A8DE1ED14`
- **預設 MAC 地址**: `083A8DE1ED14`

### 功能變更
✅ MQTT 改為 HTTP GET 輪詢
✅ MAC 地址作為 URL 路徑參數
✅ 支援動態 MAC 地址輸入
✅ 自動顯示請求/錯誤計數
✅ 命令記錄整合
✅ 移除 MQTT 連線要求（按鈕直接可用）

---

## 🧪 測試步驟

### 1. 開啟頁面
1. 用瀏覽器開啟 `index.html`
2. 開啟瀏覽器控制台 (F12) 查看日誌

### 2. 測試單次請求
1. 在「讀取機台資料」區塊
2. 輸入 MAC 地址：`083A8DE1ED14` (已預填)
3. 點擊「📤 發送讀取命令」
4. 查看彈出視窗的資料預覽
5. 在控制台查看完整回應

### 3. 測試輪詢功能（選用）
1. 點擊「開始輪詢」按鈕
2. 系統會每 5 秒自動發送請求
3. 查看「請求次數」計數器增加
4. 點擊「停止輪詢」停止

### 4. 測試不同 MAC 地址
1. 修改 MAC 輸入框的值
2. 點擊「發送讀取命令」
3. URL 會自動更新為新的 MAC

---

## 🔧 控制台測試命令

在瀏覽器控制台 (F12) 可執行：

```javascript
// 1. 查看當前配置
console.log(httpConfig);

// 2. 測試建構 URL
buildHttpUrl('083A8DE1ED14');
// 輸出: "http://update.feiloli.com.tw:5539/textselectdata/083A8DE1ED14"

// 3. 測試單次請求
await sendHttpRequest('083A8DE1ED14');

// 4. 測試連線
await testHttpConnection();

// 5. 開始輪詢
startHttpPolling();

// 6. 停止輪詢
stopHttpPolling();

// 7. 修改輪詢間隔 (毫秒)
httpPollingInterval = 10000; // 改為 10 秒

// 8. 查看統計資料
console.log('請求次數:', httpRequestCount);
console.log('錯誤次數:', httpErrorCount);
console.log('最後回應:', httpLastResponse);
```

---

## 📊 預期行為

### 成功時
- ✅ 狀態指示燈變綠色並閃爍
- ✅ 顯示「HTTP 連線中 - 請求成功」
- ✅ 控制台顯示完整回應資料
- ✅ 彈出視窗顯示資料預覽
- ✅ 命令記錄新增成功項目
- ✅ 請求次數 +1

### 失敗時
- ❌ 狀態指示燈變紅色
- ❌ 顯示錯誤訊息（超時/網路錯誤等）
- ❌ 控制台顯示錯誤詳情
- ❌ 錯誤次數 +1

---

## 🔍 常見問題排查

### Q1: 請求一直超時
**可能原因：**
- 伺服器未啟動或無法訪問
- 防火牆阻擋埠號 5539
- MAC 地址不存在

**解決方法：**
```javascript
// 增加超時時間
httpConfig.timeout = 30000; // 30 秒

// 測試伺服器連通性
fetch('http://update.feiloli.com.tw:5539')
  .then(r => console.log('伺服器狀態:', r.status))
  .catch(e => console.error('無法連線:', e));
```

### Q2: CORS 錯誤
**錯誤訊息：** `Access to fetch at ... has been blocked by CORS policy`

**解決方法：**
伺服器需要設定 CORS 標頭：
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

### Q3: 回應格式錯誤
**可能原因：** 回應不是 JSON 格式

**解決方法：**
修改 `sendHttpRequest()` 中的解析方式：
```javascript
// 如果是純文字
const data = await response.text();

// 如果是其他格式
const data = await response.blob();
```

---

## 📝 進階配置

### 修改輪詢間隔
```javascript
// 在 index.html 中找到
httpPollingInterval = 5000; // 預設 5 秒

// 修改為其他值（毫秒）
httpPollingInterval = 3000;  // 3 秒
httpPollingInterval = 10000; // 10 秒
httpPollingInterval = 60000; // 1 分鐘
```

### 修改超時時間
```javascript
// 在 httpConfig 中
timeout: 10000 // 預設 10 秒

// 修改為
timeout: 20000 // 20 秒
```

### 新增查詢參數（如果需要）
```javascript
httpConfig.params = {
    key1: 'value1',
    key2: 'value2'
};
// URL 會變成: ...textselectdata/MAC?key1=value1&key2=value2
```

### 新增 HTTP 標頭（如需身份驗證）
```javascript
httpConfig.headers = {
    'Authorization': 'Bearer YOUR_TOKEN',
    'X-API-Key': 'YOUR_KEY'
};
```

---

## ✨ 功能特點

1. **動態 MAC 地址** - 支援在 URL 路徑中插入 MAC
2. **自動重試** - 輪詢模式下失敗自動重試
3. **錯誤追蹤** - 計數並顯示請求/錯誤次數
4. **視覺回饋** - 狀態燈、載入動畫、彈出視窗
5. **命令記錄** - 所有請求和回應都記錄在 UI
6. **控制台日誌** - 詳細的除錯資訊

---

## 🚀 後續擴充

如需進一步客製化，可修改 `handleHttpResponse(data)` 函數：

```javascript
function handleHttpResponse(data) {
    // 範例：解析特定欄位
    if (data.status === 'ok') {
        console.log('資料:', data.payload);
        
        // 儲存到 Firebase
        db.collection('machineData').add({
            mac: httpConfig.currentMac,
            data: data,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
    
    // 範例：更新特定 UI 元素
    document.getElementById('custom-display').textContent = data.someField;
}
```

---

準備好了！可以開始測試了 🎉
