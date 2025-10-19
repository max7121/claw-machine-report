# Firebase 安全規則設定指南

為了讓登入系統能夠正常寫入和讀取 Firebase，您需要在 Firebase 控制台中設定正確的安全規則。

## 🔧 設定步驟：

### 1. 開啟 Firebase 控制台
- 前往：https://console.firebase.google.com/
- 選擇您的專案 "claw-machine-report"

### 2. 設定 Firestore 安全規則
- 點選左側選單的 "Firestore Database"
- 點選上方的 "規則" 標籤
- 將規則替換為以下內容：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允許所有讀寫操作（開發/測試環境）
    match /{document=**} {
      allow read, write: if true;
    }
    
    // 或者更安全的規則（生產環境建議）：
    // match /admin_config/{document} {
    //   allow read, write: if true;
    // }
    // match /groups/{groupId} {
    //   allow read, write: if true;
    //   match /{document=**} {
    //     allow read, write: if true;
    //   }
    // }
  }
}
```

### 3. 發佈規則
- 點選 "發佈" 按鈕
- 等待規則部署完成

## 🧪 測試步驟：

1. **管理員登入測試**：
   - 使用帳號 `admin` 密碼 `password` 登入
   - 點選右上角「管理」按鈕
   - 檢查是否能進入管理界面

2. **設定管理測試**：
   - 嘗試更改管理員密碼
   - 新增一個訪客帳號
   - 檢查 Firebase 控制台中是否出現 `admin_config` 集合

3. **訪客帳號測試**：
   - 使用新建的訪客帳號登入
   - 檢查是否只能看到授權的群組
   - 確認無法看到「管理」按鈕

## 📊 Firebase 資料結構：

系統會在 Firebase 中創建以下結構：

```
/admin_config/system_config
├── adminCredentials
│   ├── username: "admin"
│   └── password: "password"
├── guestAccounts
│   └── [array of guest objects]
├── settings
│   ├── allowGuestRegistration: false
│   ├── sessionTimeout: 86400000
│   └── maxLoginAttempts: 5
└── updatedAt: [timestamp]
```

## 🔍 故障排除：

1. **如果登入時出現錯誤**：
   - 檢查瀏覽器控制台是否有 Firebase 錯誤
   - 確認安全規則已正確設定
   - 檢查網路連接

2. **如果無法儲存設定**：
   - 檢查 Firebase 專案配置是否正確
   - 確認已設定正確的安全規則
   - 檢查是否有足夠的 Firebase 配額

3. **如果出現權限錯誤**：
   - 檢查 Firestore 安全規則
   - 確認規則中允許讀寫操作

## 📝 注意事項：

- 目前為測試方便，安全規則設為允許所有操作
- 在生產環境中，建議實施更嚴格的安全規則
- 定期備份管理員設定以防資料遺失
- 訪客密碼以明文儲存，生產環境建議加密處理

## 🎯 功能特色：

✅ **Firebase 同步**：所有設定自動同步到雲端
✅ **本地備份**：自動備份到瀏覽器本地儲存
✅ **故障恢復**：Firebase 連接失敗時自動使用本地備份
✅ **即時更新**：設定變更即時生效
✅ **跨設備同步**：多設備間設定自動同步