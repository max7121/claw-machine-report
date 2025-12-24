# 讀取檔案
$filepath = 'C:\Users\max-7\OneDrive\Desktop\帳務系統\index .html'
$content = Get-Content -LiteralPath $filepath -Encoding UTF8 | Out-String

Write-Host "File length: $($content.Length)"

# 找到要替換的位置
$searchStr = "console.log"
$idx = $content.IndexOf("戰情室數據載入完成")
Write-Host "Found at: $idx"

# 要找的舊程式碼模式 - 用更簡單的方式
$oldPattern = "console.log"
$completeIdx = $content.IndexOf("戰情室數據載入完成")

# 找到這個位置前後的內容
$beforeText = $content.Substring($completeIdx - 200, 250)
Write-Host "Before complete:"
Write-Host $beforeText

# 使用行號方式修復
$lines = Get-Content -LiteralPath $filepath -Encoding UTF8

# 找到 "戰情室數據載入完成" 所在的行
$targetLineIdx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "戰情室數據載入完成") {
        $targetLineIdx = $i
        Write-Host "Found 'complete' at line $($i + 1): $($lines[$i])"
        break
    }
}

if ($targetLineIdx -gt 0) {
    # 在這行之前插入更新函數呼叫
    $insertCode = @(
        "",
        "                // 檢查快照狀態",
        "                await checkSnapshotStatus(storesSnapshot.docs);",
        "",
        "                // 更新 KPI 卡片",
        "                updateKPICards(totalRevenue, totalPlays, totalPayouts, totalMachines, activeStores, storesSnapshot.size);",
        "",
        "                // 更新門市排行榜",
        "                updateStoreRanking();",
        "",
        "                // 更新營收趨勢圖",
        "                await updateRevenueTrendChart();",
        "",
        "                // 更新異常警示",
        "                updateAlerts();",
        "",
        "                // 更新快速統計",
        "                updateQuickStats();",
        "",
        "                // 更新待處理事項",
        "                updatePendingItems();",
        "",
        "                // 更新門市表格",
        "                updateStoresTable();",
        "",
        "                // 更新機台績效",
        "                await updateTopMachines();",
        ""
    )
    
    # 建立新的行陣列
    $newLines = @()
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($i -eq $targetLineIdx) {
            # 在這行之前插入新程式碼
            $newLines += $insertCode
        }
        $newLines += $lines[$i]
    }
    
    Write-Host "Original lines: $($lines.Count)"
    Write-Host "New lines: $($newLines.Count)"
    
    # 儲存
    $newLines | Set-Content -LiteralPath $filepath -Encoding UTF8
    Write-Host "File saved!"
} else {
    Write-Host "Target line not found!"
}
