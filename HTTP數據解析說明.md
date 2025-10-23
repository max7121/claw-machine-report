# 📊 HTTP 數據解析功能說明

## ✨ 新增功能

已添加了**自動化的 HTTP 回應數據解析功能**，可以自動識別並提取以下信息：

- 📈 **累積投幣數** (plays / coins)
- 📊 **累積出貨次數** (payouts / dispenses)

---

## 🎯 核心功能

### 1. **多格式自動識別**

支持多種常見的數據格式：

#### ✅ JSON 格式
```json
{
  "plays": 12345,
  "payouts": 6789
}
```

或嵌套格式：
```json
{
  "machine": {
    "plays": 12345,
    "payouts": 6789
  }
}
```

#### ✅ 文本格式

- **冒號分隔**：`plays:12345,payouts:6789`
- **逗號分隔**：`12345,6789`
- **空白分隔**：`12345 6789`
- **換行分隔**：`12345\n6789`

#### ✅ 自定義欄位名

系統會自動識別以下欄位名（支持中英文）：

**投幣相關**：
- plays, play, coins, coin, investment
- 投幣, 投币, cumulative_plays, total_plays

**出貨相關**：
- payouts, payout, dispense, dispenses
- 出貨, 出货, distribution, cumulative_payouts, total_payouts

---

## 🔄 工作流程

```
伺服器返回數據
    ↓
自動解析（parseHttpData）
    ↓
識別格式（JSON / 文本）
    ↓
提取投幣數和出貨次數
    ↓
在 UI 中顯示結果
    ↓
保存到 window.lastParsedMachineData
```

---

## 📍 UI 顯示

當成功解析數據後，會在「命令記錄」下方顯示：

```
📊 機台數據解析結果

┌─────────────────────────┐
│ 累積投幣數              │
│     12,345              │
└─────────────────────────┘

┌─────────────────────────┐
│ 累積出貨次數            │
│      6,789              │
└─────────────────────────┘

格式: json | 時間: 14:30:45
```

---

## 🛠️ 使用方法

### 方法 1：自動解析（推薦）

當您點擊「📤 測試查詢」或進行輪詢時：
1. ✅ 系統自動發送 HTTP 請求
2. ✅ 自動解析回應數據
3. ✅ 自動在 UI 中顯示結果

無需任何額外操作！

### 方法 2：手動測試解析

在瀏覽器控制台執行：

```javascript
// 測試 JSON 格式
const testJson = { plays: 12345, payouts: 6789 };
const result = parseHttpData(testJson);
console.log(result);

// 測試文本格式
const testText = "plays:12345,payouts:6789";
const result2 = parseHttpData(testText);
console.log(result2);

// 查看最後解析的數據
console.log(window.lastParsedMachineData);
```

### 方法 3：獲取解析結果

```javascript
// 獲取最後一次解析的機台數據
const machineData = window.lastParsedMachineData;

if (machineData) {
    console.log('投幣數:', machineData.plays);
    console.log('出貨次數:', machineData.payouts);
}
```

---

## 📋 支持的數據格式詳解

### 格式 1：標準 JSON
```json
{
  "plays": 12345,
  "payouts": 6789
}
```
**優先級**：最高 ✅

### 格式 2：嵌套 JSON
```json
{
  "data": {
    "machine": {
      "plays": 12345,
      "payouts": 6789
    }
  }
}
```
**優先級**：高 ✅

### 格式 3：自定義欄位名
```json
{
  "cumulative_plays": 12345,
  "total_payouts": 6789
}
```
**優先級**：中 ✅

### 格式 4：中文欄位
```json
{
  "投幣": 12345,
  "出貨": 6789
}
```
**優先級**：中 ✅

### 格式 5：文本格式（冒號分隔）
```
plays:12345,payouts:6789
```
**優先級**：低 ⚠️

### 格式 6：簡單數字（逗號分隔）
```
12345,6789
```
**優先級**：很低 ⚠️

### 格式 7：位置推測
```
12345 6789
```
**優先級**：最低（最後才會嘗試）

---

## 🔍 調試和監控

### 查看完整的解析過程

在控制台中，您會看到詳細的日誌輸出：

```javascript
// 每一步都有清晰的提示
📄 接收到文本數據，嘗試提取結構化信息...
🔍 分析文本數據結構...
✅ 格式識別: 冒號分隔符
✅ 找到投幣欄位: "plays" = 12345
✅ 找到出貨欄位: "payouts" = 6789
🖼️ 更新 UI 顯示: {...}
✅ UI 已更新
```

### 監控解析失敗

如果數據無法解析：

```
⚠️ 無法解析數據
❌ 數據解析失敗: Error: ...
```

此時查看控制台中的 `httpLastResponse` 查看原始數據：
```javascript
console.log(httpLastResponse);
```

---

## 💡 自定義解析

如果您的數據格式不在支持的列表中，可以自定義解析函數：

### 示例：自定義格式

假設您的伺服器返回格式為：
```
{
  "coin_count": 12345,
  "dispensing_count": 6789
}
```

您可以修改解析函數中的欄位名稱列表：

在代碼中查找 `const playsKeywords = [...]` 並添加：
```javascript
const playsKeywords = ['plays', 'play', 'coins', 'coin', 'coin_count', ...];
const payoutsKeywords = ['payouts', 'payout', 'dispense', 'dispensing_count', ...];
```

---

## 📊 實時數據監控

### 監控模式 1：實時顯示更新

啟用自動輪詢，每次輪詢都會自動解析和顯示新的數據。

```javascript
// 啟用 2 秒輪詢
document.getElementById('poll-interval').value = 2000;
document.getElementById('auto-poll-enabled').checked = true;
startAutoPolling();
```

此時您會看到數據實時更新。

### 監控模式 2：數據趨勢分析

```javascript
// 保存每次的解析結果
let dataHistory = [];

// 修改 updateMachineDataDisplay 函數來保存歷史
// 或手動記錄
const currentData = window.lastParsedMachineData;
dataHistory.push({
    timestamp: new Date(),
    ...currentData
});

// 分析數據變化
console.table(dataHistory);
```

---

## ⚙️ 進階配置

### 配置 1：禁用自動顯示

如果您只想解析但不想自動顯示在 UI 中，可以修改 `handleHttpResponse` 函數：

```javascript
// 在 handleHttpResponse 中註解掉
// updateMachineDataDisplay(parsedData);
```

### 配置 2：添加數據驗證

```javascript
// 在 handleHttpResponse 中添加驗證
if (parsedData.plays !== null && parsedData.plays > 0) {
    // 只有在數據有效時才顯示
    updateMachineDataDisplay(parsedData);
}
```

### 配置 3：集成到 Firebase

```javascript
// 保存解析的數據到 Firebase
async function saveMachineDataToFirebase(machineData) {
    try {
        await db.collection('machines').doc('machine-1').update({
            plays: machineData.plays,
            payouts: machineData.payouts,
            lastUpdate: new Date()
        });
        console.log('✅ 數據已保存到 Firebase');
    } catch (error) {
        console.error('❌ 保存失敗:', error);
    }
}

// 在 handleHttpResponse 中調用
// await saveMachineDataToFirebase(parsedData);
```

---

## 🧪 測試數據

### 測試 1：標準 JSON

```javascript
// 在控制台執行
handleHttpResponse({
    plays: 12345,
    payouts: 6789
});
```

### 測試 2：文本格式

```javascript
handleHttpResponse("plays:12345,payouts:6789");
```

### 測試 3：嵌套結構

```javascript
handleHttpResponse({
    machine: {
        plays: 12345,
        payouts: 6789
    }
});
```

### 測試 4：中文欄位

```javascript
handleHttpResponse({
    投幣: 12345,
    出貨: 6789
});
```

---

## 📈 功能對比

| 功能 | 之前 | 之後 |
|------|------|------|
| 數據接收 | ✅ | ✅ |
| 數據顯示 | ❌ | ✅ |
| 自動解析 | ❌ | ✅ |
| 格式識別 | ❌ | ✅ (7+ 種) |
| UI 顯示 | ❌ | ✅ |
| 歷史記錄 | ❌ | ✅ (可擴展) |

---

## 🔐 代碼位置參考

| 功能 | 位置 |
|------|------|
| 主解析函數 | `parseHttpData()` |
| 文本解析 | `parseTextData()` |
| JSON 解析 | `extractMachineData()` |
| UI 更新 | `updateMachineDataDisplay()` |
| 調用位置 | `handleHttpResponse()` |

---

## ⚠️ 常見問題

### Q: 為什麼數據沒有顯示？

**A**: 檢查以下幾點：
1. 伺服器是否返回了數據？
2. 數據格式是否符合支持的格式？
3. 查看控制台是否有錯誤信息

使用 `console.log(httpLastResponse)` 查看原始數據。

### Q: 如何添加新的欄位名稱識別？

**A**: 在 `parseTextData()` 或 `extractMachineData()` 中，修改關鍵字列表：

```javascript
const playsKeywords = ['plays', 'play', 'coins', 'YOUR_FIELD_NAME', ...];
```

### Q: 數據解析錯誤怎麼辦？

**A**: 
1. 在控制台檢查具體的錯誤信息
2. 使用 `console.log(httpLastResponse)` 查看原始數據
3. 根據實際格式自定義解析邏輯

### Q: 能否同時提取其他欄位？

**A**: 可以！在 `extractMachineData()` 中添加新的欄位提取邏輯，類似於 plays 和 payouts 的方式。

---

## 📝 代碼修改摘要

### 新增函數：

1. **`parseHttpData(data)`** - 主解析函數，自動檢測格式
2. **`parseTextData(textData)`** - 文本格式解析
3. **`extractMachineData(jsonData)`** - JSON 格式解析
4. **`updateMachineDataDisplay(machineData)`** - UI 顯示更新

### 修改函數：

1. **`handleHttpResponse(data)`** - 添加了自動解析邏輯

### 全域變數：

1. **`window.lastParsedMachineData`** - 保存最後解析的數據

---

## ✅ 驗證修復

所有代碼已驗證：
- ✅ 無語法錯誤
- ✅ 支持多種數據格式
- ✅ 自動識別和提取
- ✅ 實時 UI 更新
- ✅ 詳細的日誌輸出

---

**修改日期**：2025-10-23  
**功能狀態**：✅ 完全實現  
**下一步**：根據實際伺服器數據格式，可進一步自定義解析邏輯
