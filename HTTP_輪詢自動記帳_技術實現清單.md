# 🔧 HTTP 輪詢自動記帳 - 技術實現清單

**實現日期**: 2025年10月23日  
**功能版本**: v2.0 (Enhanced Change Detection & Batch Auto-Accounting)

---

## ✅ 已實現功能清單

### 1️⃣ 改進的 `updateDailyRecord()` 函數

**位置**: `index.html` 約 1876-1971 行

**新增欄位**:
- ✅ `lastPlays` - 上一次的投幣數
- ✅ `lastPayouts` - 上一次的出貨數量
- ✅ `playsChanged` - 投幣次數是否變化
- ✅ `payoutsChanged` - 出貨數量是否變化
- ✅ `history[].playsChanged` - 歷史記錄中投幣次數變化標記
- ✅ `history[].payoutsChanged` - 歷史記錄中出貨數量變化標記
- ✅ `history[].playsDelta` - 投幣次數變化值
- ✅ `history[].payoutsDelta` - 出貨數量變化值

**檢測邏輯**:
```javascript
const playsChanged = (todayRecord.plays !== plays);
const payoutsChanged = (todayRecord.payouts !== payouts);
const isChanged = playsChanged || payoutsChanged;

if (isChanged) {
    const playsDelta = plays - todayRecord.plays;
    const payoutsDelta = payouts - todayRecord.payouts;
    // 記錄變更信息
}
```

**返回值增強**:
```javascript
return { 
    status: 'updated', 
    record: todayRecord, 
    playsChanged,      // ✅ 新增
    payoutsChanged,    // ✅ 新增
    playsDelta,        // ✅ 新增
    payoutsDelta       // ✅ 新增
};
```

**控制台輸出**:
```
🔄 數據有變化 - 機台: A001/上1
   ⭐ 投幣次數變化: 280 → 285 (增加: +5)
   ⭐ 出貨數量變化: 17 → 18 (增加: +1)
```

---

### 2️⃣ 改進的 `refreshAutoRecordTable()` 函數

**位置**: `index.html` 約 1933-2005 行

**新增功能**:
- ✅ 變更狀態指示符（🔄, 💰, 📦, ✨）
- ✅ 變更值顯示（+N）
- ✅ 詳細的變更信息在最後更新列中

**表格欄位變化**:
```html
<!-- 原本：簡單的更新計數 -->
<td>${statusIcon} ${record.updateCount}</td>

<!-- 現在：複雜的狀態指示 -->
<td>${changeIndicator} ${record.updateCount}</td>
<!-- changeIndicator 示例: 🔄 💰📦 3 -->
```

**變更指示符邏輯**:
```javascript
let changeIndicator = '';
if (record.updateCount > 1) {
    const playsStatus = record.playsChanged ? '💰' : '';
    const payoutsStatus = record.payoutsChanged ? '📦' : '';
    changeIndicator = `🔄 ${playsStatus}${payoutsStatus}`;
} else {
    changeIndicator = '✨';
}
```

**變更值顯示邏輯**:
```javascript
let changeInfo = '';
if (record.history && record.history.length > 1) {
    const lastHistory = record.history[record.history.length - 1];
    
    changeInfo = '<br/><small style="color: #9ca3af; font-size: 0.75rem;">';
    if (lastHistory.playsChanged && lastHistory.playsDelta !== undefined) {
        changeInfo += `💰 投幣: +${lastHistory.playsDelta} `;
    }
    if (lastHistory.payoutsChanged && lastHistory.payoutsDelta !== undefined) {
        changeInfo += `📦 出貨: +${lastHistory.payoutsDelta}`;
    }
    changeInfo += '</small>';
}
```

---

### 3️⃣ 增強的 `pollAllMachines()` 函數

**位置**: `index.html` 約 8221-8280 行

**新增統計功能**:
- ✅ 輪詢開始時間記錄
- ✅ 輪詢機台計數
- ✅ 新增記錄計數
- ✅ 更新記錄計數
- ✅ 耗時計算

**新增局部變數**:
```javascript
const pollStartTime = new Date();
let pollCount = 0;      // 輪詢機台數
let updateCount = 0;    // 有變化的記錄
let unchangedCount = 0; // 新增的記錄
```

**統計邏輯**:
```javascript
// 在輪詢後統計結果
if (window.dailyRecords) {
    Object.values(window.dailyRecords).forEach(record => {
        if (record.updateCount > 1) {
            updateCount++;  // 有變化
        } else {
            unchangedCount++;  // 新記錄
        }
    });
}

const pollDuration = ((pollEndTime - pollStartTime) / 1000).toFixed(1);
```

**改進的狀態訊息**:
```javascript
showStatusMessage(`
    ✅ 輪詢完成！
    - 已查詢: ${pollCount} 台機台
    - 新增: ${unchangedCount} 筆記錄
    - 更新: ${updateCount} 筆記錄
    - 耗時: ${pollDuration} 秒
`, 'success');
```

---

### 4️⃣ 增強的 `batchAddAllMachines()` 函數

**位置**: `index.html` 約 2055-2177 行

**新增功能**:
- ✅ 新增/更新/失敗計數
- ✅ 操作型態判斷（新增 vs 更新）
- ✅ 詳細的操作總結
- ✅ 摘要信息記錄

**新增局部變數**:
```javascript
let newCount = 0;         // 新增記錄數
let updateCount = 0;      // 更新記錄數
let unchangedCount = 0;   // 未變化記錄數（新增）
let failedCount = 0;      // 失敗計數

// 統計信息物件
const summaryInfo = {
    new: [],      // 新增的機台
    updated: [],  // 更新的機台
    unchanged: [] // 未變化的機台
};
```

**操作型態判斷邏輯**:
```javascript
if (record.updateCount > 1) {
    // 🔄 更新操作 - 檢測到變化
    console.log(`🔄 檢測到變化 - 投幣數變化: ${record.playsChanged}, 出貨數量變化: ${record.payoutsChanged}`);
    updateCount++;
    summaryInfo.updated.push({
        id: machine.id,
        location: machine.location,
        plays: record.plays,
        payouts: record.payouts,
        playsChanged: record.playsChanged,
        payoutsChanged: record.payoutsChanged
    });
} else {
    // ✨ 新增操作 - 首次記錄
    console.log(`✨ 新增記錄 - 機台: ${machine.id}/${machine.location}`);
    newCount++;
    summaryInfo.new.push({
        id: machine.id,
        location: machine.location,
        plays: record.plays,
        payouts: record.payouts
    });
}
```

**詳細的完成總結**:
```javascript
console.log(`🎉 批量操作完成統計:`);
console.log(`   ✨ 新增記錄: ${newCount} 筆`);
if (summaryInfo.new.length > 0) {
    console.log(`      ${summaryInfo.new.map(m => `${m.id}/${m.location}`).join(', ')}`);
}
console.log(`   🔄 更新記錄: ${updateCount} 筆`);
if (summaryInfo.updated.length > 0) {
    console.log(`      ${summaryInfo.updated.map(m => {
        const changes = [];
        if (m.playsChanged) changes.push(`💰投幣`);
        if (m.payoutsChanged) changes.push(`📦出貨`);
        return `${m.id}/${m.location} (${changes.join('、')})`;
    }).join(', ')}`);
}
console.log(`   ❌ 失敗: ${failedCount} 筆`);
```

---

## 📊 數據結構對比

### 舊版本記錄結構
```javascript
{
    machineId: "A001",
    location: "上1",
    date: "2025-10-23",
    plays: 285,
    payouts: 18,
    createdAt: "2025/10/23 下午 08:57:07",
    updatedAt: "2025/10/23 下午 08:57:09",
    updateCount: 3,
    history: [
        { timestamp: "08:57:07", plays: 280, payouts: 17 },
        { timestamp: "08:57:08", plays: 282, payouts: 17 },
        { timestamp: "08:57:09", plays: 285, payouts: 18 }
    ]
}
```

### 新版本記錄結構 ✅
```javascript
{
    machineId: "A001",
    location: "上1",
    date: "2025-10-23",
    plays: 285,
    payouts: 18,
    createdAt: "2025/10/23 下午 08:57:07",
    updatedAt: "2025/10/23 下午 08:57:09",
    updateCount: 3,
    
    // ✅ 新增：上一次的值（用於比對）
    lastPlays: 280,
    lastPayouts: 17,
    
    // ✅ 新增：變化標記
    playsChanged: true,
    payoutsChanged: true,
    
    // ✅ 新增：詳細的變化歷史
    history: [
        {
            timestamp: "08:57:07",
            plays: 280,
            payouts: 17,
            playsChanged: false,
            payoutsChanged: false,
            playsDelta: 0,
            payoutsDelta: 0
        },
        {
            timestamp: "08:57:08",
            plays: 282,
            payouts: 17,
            playsChanged: true,     // ✅ 投幣數有變化
            payoutsChanged: false,
            playsDelta: 2,          // ✅ 增加了2次投幣
            payoutsDelta: 0
        },
        {
            timestamp: "08:57:09",
            plays: 285,
            payouts: 18,
            playsChanged: true,     // ✅ 投幣數有變化
            payoutsChanged: true,   // ✅ 出貨數量有變化
            playsDelta: 3,          // ✅ 增加了3次投幣
            payoutsDelta: 1         // ✅ 增加了1次出貨
        }
    ]
}
```

---

## 🔄 函數調用流程圖

```
[用戶操作]
    ↓
[按下「立即輪詢所有機台」]
    ↓
pollAllMachines()
    ↓
┌─────────────────────────────────────┐
│ 遍歷所有有 MAC 位址的機台          │
├─────────────────────────────────────┤
│ 1. 選取機台 A001, A002...         │
│ 2. 對每台調用 pollSingleMachine()   │
│ 3. 間隔 500ms 避免伺服器負荷       │
└─────────────────────────────────────┘
    ↓
pollSingleMachine(mac, devid)
    ↓
sendHttpRequest(mac)
    ↓
handleHttpResponse(data, mac, devid)
    ↓
parseHttpData(data, devid)
    ↓
┌─────────────────────────────────────┐
│ 提取投幣次數 (plays) 和出貨數      │
│ 量 (payouts)                        │
└─────────────────────────────────────┘
    ↓
updateDailyRecord()
    ↓
┌─────────────────────────────────────┐
│ 檢測變化：                          │
│ - playsChanged?                     │
│ - payoutsChanged?                   │
│ - 計算 playsDelta & payoutsDelta   │
│ - 記錄到 history 陣列              │
└─────────────────────────────────────┘
    ↓
refreshAutoRecordTable()
    ↓
┌─────────────────────────────────────┐
│ 表格顯示：                          │
│ - 🔄 💰📦 3  (有變化指示符)        │
│ - 💰 投幣: +5 (具體變化值)         │
│ - 📦 出貨: +2                      │
└─────────────────────────────────────┘
    ↓
[用戶檢查表格]
    ↓
[按下「批量新增所有機台」]
    ↓
batchAddAllMachines()
    ↓
┌─────────────────────────────────────┐
│ 遍歷所有輪詢記錄：                  │
├─────────────────────────────────────┤
│ 如果 updateCount > 1:              │
│   → 🔄 更新操作                    │
│   → 記錄 updateCount++             │
│                                     │
│ 如果 updateCount = 1:              │
│   → ✨ 新增操作                    │
│   → 記錄 newCount++                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 填入表單並提交：                    │
│ - 機台選擇器                        │
│ - 日期                              │
│ - 投幣數                            │
│ - 出貨數                            │
│ - 觸發表單提交事件                  │
└─────────────────────────────────────┘
    ↓
[系統自動保存到 Firebase]
    ↓
┌─────────────────────────────────────┐
│ 完成統計顯示：                      │
│ ✨ 新增記錄: X 筆                  │
│ 🔄 更新記錄: Y 筆                  │
│ ❌ 失敗: Z 筆                       │
└─────────────────────────────────────┘
    ↓
[清空輪詢表格]
    ↓
[等待下次輪詢]
```

---

## 📝 日誌追蹤範例

### 完整的輪詢和批量新增流程日誌

```
=== 開始 HTTP 輪詢所有機台 ===
=== 輪詢機台清單 ===
1. 機台ID: A001, MAC: 083A8DE1ED14, DevID: 1
2. 機台ID: A001, MAC: 083A8DE1ED14, DevID: 2
3. 機台ID: A002, MAC: 083A8DE1ED15, DevID: 1
========================

📝 檢查並更新每日記錄 - 機台: A001/上1, plays: 285, payouts: 18
📝 單台 HTTP 輪詢 ===
準備發送 HTTP GET 請求到機台 - MAC: 083A8DE1ED14, DevID: 1
📤 [1] 發送 HTTP GET 請求: http://update.feiloli.com.tw:5539/textselectdata/083A8DE1ED14
📥 收到回應: [Array(1)]
📊 資料類型: object
📏 資料長度: 1534

🔄 處理 HTTP 回應資料: (1) […] 'MAC:' '083A8DE1ED14' 'DevID:' 1
📊 檢測到陣列數據，處理多 devid... (指定DevID: 1)
⭐ 優先解析指定的 devid: 1
📥 開始解析數據，類型: object targetDevid: 1
⚙️ 解析 re_readdata 協議數據...
📝 parm 十六進位字符串: 00000000000000000000000000000000...
📊 parm 字符串長度: 144 字符 (72 字節)
🔍 前 40 個字節值(十進位): 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 1, 40, 0, 0, 135, 0, 9, 0, 210, 0, 94, 1
📍 試 位置32-35 (正確位置): bytes[32]=87, bytes[33]=00, bytes[34]=09, bytes[35]=00 → plays=135, payouts=9, 有效=true
✅ 位置32-35 成功提取: plays=135, payouts=9

✅ devid 1 數據已儲存: {raw: {…}, plays: 135, payouts: 9, timestamp: '14:35:22', format: 're_readdata', hasData: true}
📝 檢查並更新每日記錄 - 機台: A001/上1, plays: 135, payouts: 9
🔄 數據有變化 - 機台: A001/上1
   ⭐ 投幣次數變化: 130 → 135 (增加: +5)
   ⭐ 出貨數量變化: 8 → 9 (增加: +1)
✅ 已更新今日記錄 - 機台: A001/上1, plays: 135, payouts: 9, 更新次數: 3
   📊 更新統計: plays變化=true, payouts變化=true, 歷史記錄數=3

🔄 已刷新自動記帳表格，共 1 筆記錄

✅ 輪詢完成！
- 已查詢: 3 台機台
- 新增: 1 筆記錄
- 更新: 2 筆記錄
- 耗時: 3.2 秒

==============================================

✅ 批量新增所有機台記錄 (增強版)...
✅ 找到 A001/上1 的記錄
✅ 已設置選擇器: docId=doc1, value=doc1
📋 表單已填入: {date: '2025-10-23', machineDocId: 'doc1', plays: 135, payouts: 9}
🔄 檢測到變化 - 投幣數變化: true, 出貨數量變化: true
🔄 已新增/更新 A001/上1 的記錄
✨ 新增記錄 - 機台: A001/上2
🔄 已新增/更新 A001/上2 的記錄
🎉 批量操作完成統計:
   ✨ 新增記錄: 1 筆
      A001/上2
   🔄 更新記錄: 1 筆
      A001/上1 (💰投幣、📦出貨)
   ❌ 失敗: 0 筆

🗑️ 清除 HTTP 輪詢自動記帳表格...
✅ 已刷新自動記帳表格，共 0 筆記錄
```

---

## 🎯 API 參考

### `updateDailyRecord(machineId, location, plays, payouts, date)`

**參數**:
- `machineId` (string): 機台編號 (如 "A001")
- `location` (string): 機台位置 (如 "上1")
- `plays` (number): 投幣次數
- `payouts` (number): 出貨數量
- `date` (string, optional): 日期 (格式: "YYYY-MM-DD", 默認為今天)

**返回值**:
```javascript
{
    status: 'created' | 'updated' | 'unchanged',
    record: { ...記錄物件 },
    playsChanged: boolean,     // ✅ 新增
    payoutsChanged: boolean,   // ✅ 新增
    playsDelta: number,        // ✅ 新增
    payoutsDelta: number       // ✅ 新增
}
```

### `pollAllMachines()`

**功能**: 輪詢所有有 MAC 位址的機台

**參數**: 無

**返回值**: Promise

**副作用**:
- 修改 `window.dailyRecords`
- 顯示狀態訊息
- 輸出詳細日誌

### `batchAddAllMachines()`

**功能**: 批量新增所有機台記錄到系統

**參數**: 無

**返回值**: void

**副作用**:
- 觸發表單提交事件
- 清空 `window.dailyRecords`
- 刷新自動記帳表格

### `refreshAutoRecordTable()`

**功能**: 刷新自動記帳表格顯示

**參數**: 無

**返回值**: void

**副作用**:
- 更新 DOM 中的表格內容
- 顯示變更指示符和變更值

---

## ✨ 改進成果總結

| 方面 | 舊版本 | 新版本 |
|------|--------|--------|
| **變化檢測** | 整體檢測 | 獨立檢測投幣和出貨 |
| **變化值記錄** | 不記錄 | 記錄 Delta 值 |
| **歷史數據** | 簡單列表 | 詳細的變化標記 |
| **表格指示** | 簡單計數 | 複雜的符號指示 |
| **操作分類** | 一律新增 | 智能區分新增/更新 |
| **統計信息** | 缺乏 | 詳細統計 |
| **用戶反饋** | 基礎 | 詳細和層級化 |
| **日誌輸出** | 標準 | 富有信息的詳細日誌 |

---

## 📚 相關文件

- 📄 `HTTP_輪詢自動記帳_改進說明.md` - 功能說明文檔
- 📋 `index.html` - 主程序文件
- 🔍 其他參考：`HTTP_CONFIG_README.md`、`parm破解完成報告.txt` 等

