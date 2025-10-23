# HTTP 連線問題診斷與修復指南

## 問題分析

根據控制台錯誤信息，您遇到的問題是：

```
net::ERR_NAME_NOT_RESOLVED
CORS 錯誤：Failed to fetch
```

### 錯誤根本原因

1. **DNS 解析失敗** - 無法解析 `update.feiloli.com.tw` 域名
2. **可能的具體原因**：
   - 網路連線中斷或不穩定
   - DNS 伺服器無響應
   - 防火牆或代理阻止了該域名
   - 目標伺服器宕機或無法訪問
   - 運營商 DNS 污染

## 診斷步驟

### 步驟 1：運行自動診斷

1. 打開瀏覽器開發者工具（按 **F12**）
2. 切換到 **Console（控制台）** 選項卡
3. 複製並粘貼以下命令：
```javascript
diagnoseHttpConnection()
```
4. 按 **Enter** 執行
5. 查看詳細的診斷報告

### 步驟 2：檢查基本網路連接

在控制台輸入：
```javascript
fetch('https://www.google.com').then(() => console.log('✅ 網路正常')).catch(() => console.log('❌ 網路異常'))
```

如果失敗，說明是網路連線問題。

### 步驟 3：直接測試目標伺服器

1. 打開新分頁
2. 訪問此 URL：
```
http://update.feiloli.com.tw:5539/textselectdata/083A8DE1ED14
```
3. 如果無法打開，目標伺服器可能無法訪問

## 可能的解決方案

### 方案 A：檢查網路連線

✅ **做法**：
1. 檢查 WiFi/有線網路是否正常連接
2. 嘗試訪問其他網站測試連接
3. 重新連接網路

❌ **如果問題持續**：聯繫 ISP 或網路管理員

---

### 方案 B：切換 DNS 伺服器

有些 DNS 伺服器可能阻止或無法解析該域名。

✅ **在 Windows 上修改 DNS**：
1. 打開 「控制面板」→「網路和網際網路」→「網路連接」
2. 右鍵點擊正在使用的網路 → 「屬性」
3. 找到「IPv4 屬性」
4. 改為：
   - 首選 DNS：`8.8.8.8`（Google DNS）
   - 備用 DNS：`1.1.1.1`（Cloudflare DNS）
5. 確定後重啟瀏覽器

✅ **或者在瀏覽器使用 VPN/代理**：
- 使用 VPN 軟體繞過地區限制
- 使用代理伺服器

---

### 方案 C：確認目標伺服器是否在線

聯繫伺服器管理員確認：
- 伺服器 IP：`update.feiloli.com.tw`
- 端口：`5539`
- API 端點：`/textselectdata/{mac}`

**檢查清單**：
- [ ] 伺服器是否在線？
- [ ] 端口 5539 是否開放？
- [ ] API 是否需要認證？
- [ ] 伺服器是否啟用了 CORS？

---

### 方案 D：使用本地代理伺服器

如果目標伺服器無法直接訪問，可設置本地代理。

#### 使用 Node.js 創建代理

1. **安裝 Node.js**（如果還未安裝）
2. **創建 proxy.js 文件**：
```javascript
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // 允許跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 轉發請求到目標伺服器
  const targetUrl = `http://update.feiloli.com.tw:5539${req.url}`;
  
  http.get(targetUrl, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }).on('error', (err) => {
    res.writeHead(500);
    res.end('Proxy Error: ' + err.message);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 代理伺服器運行在 http://localhost:${PORT}`);
});
```

3. **運行代理**：
```bash
node proxy.js
```

4. **在代碼中改用本地代理**：
在 `index.html` 第 ~1475 行修改：
```javascript
const httpConfig = {
    baseUrl: 'http://localhost:3000',  // 改為本地代理
    endpoint: '/textselectdata/{mac}',
    // ... 其他配置
};
```

---

### 方案 E：使用 Live Server 擴充功能

如果在本地打開 HTML 文件，CORS 限制會更嚴格。

✅ **使用 VS Code Live Server**：
1. 在 VS Code 安裝 「Live Server」擴充
2. 右鍵點擊 HTML 文件 → 「Open with Live Server」
3. 這樣會以 `http://localhost:5500` 形式運行，某些代理會更容易成功

---

## 修復後的測試

### 驗證是否修復成功

1. 打開開發者工具（F12）
2. 運行診斷：
```javascript
diagnoseHttpConnection()
```

3. 查看是否顯示 `✅ 直接請求成功`

### 測試 HTTP 讀取功能

1. 在頁面上點擊 「🔗 測試 HTTP 連線」 按鈕
2. 或在控制台執行：
```javascript
testHttpConnection()
```

3. 檢查是否返回數據

---

## 改進措施總結

根據代碼修改，現在已有以下改進：

✅ **更可靠的代理服務**：
- AllOrigins (GET 方法 - 更穩定)
- CORS-Anywhere
- HTTP-Proxy

✅ **更詳細的錯誤報告**：
- 具體的 HTTP 狀態碼
- 代理回應預覽
- 故障診斷信息

✅ **自動診斷工具**：
- 運行 `diagnoseHttpConnection()` 可自動檢查所有連線問題
- 提示具體的故障原因

✅ **改善的用戶提示**：
- 移除了不必要的警告框
- 提供更有用的建議

---

## 快速參考

| 操作 | 命令 |
|------|------|
| 測試連線 | `testHttpConnection()` |
| 診斷問題 | `diagnoseHttpConnection()` |
| 查看伺服器配置 | `console.log(httpConfig)` |
| 查看最後回應 | `console.log(httpLastResponse)` |
| 測試 URL | `buildHttpUrl()` 然後在新分頁訪問 |

---

## 常見問題 (FAQ)

### Q: 為什麼顯示 ERR_NAME_NOT_RESOLVED？
**A**: DNS 無法解析域名。嘗試方案 B（切換 DNS）或確認網路連接。

### Q: 代理服務都失敗怎麼辦？
**A**: 可能是網路問題或伺服器離線。執行 `diagnoseHttpConnection()` 詳細診斷。

### Q: 如何在公網上使用本地代理？
**A**: 需要使用 ngrok 等工具映射本地端口到公網。

### Q: 直接訪問目標 URL 可以嗎？
**A**: 可以。如果直接訪問 URL 在瀏覽器中可以成功，但代理失敗，可能是代理服務的問題。

---

## 聯繫支持

如果經過所有診斷步驟仍無法解決，請收集以下信息：

1. 完整的診斷報告（執行 `diagnoseHttpConnection()` 的輸出）
2. 目標伺服器地址和 API 端點
3. 網路環境信息（是否在公司/校園網？是否需要代理？）
4. 瀏覽器及版本信息
5. 具體的錯誤信息截圖
