# 讀取檔案
$content = [System.IO.File]::ReadAllText("C:\Users\max-7\OneDrive\Desktop\帳務系統\index .html", [System.Text.Encoding]::UTF8)

# 找出 PSD 區塊的位置
$psdStart = $content.IndexOf("// 三週 PSD 分析功能")
Write-Host "PSD section at position: $psdStart"

# 檢查 PSD 區塊前面是否有正確的函數結束
$before = $content.Substring($psdStart - 200, 200)
Write-Host "Content before PSD section:"
Write-Host $before

# 找到要替換的文字 - 在 PSD 區塊前面加上 loadCommandCenterData 的結束括號
# 搜尋目前的結構
$searchPattern = "document.getElementById('command-center-last-update').textContent"
$idx = $content.IndexOf($searchPattern)
Write-Host "Found update element at: $idx"

if ($idx -gt 0) {
    # 找到這行之後的內容
    $afterUpdate = $content.Substring($idx, 500)
    Write-Host "After update element:"
    Write-Host $afterUpdate
}

# 執行替換 - 在 PSD 區塊前加上正確的函數結束
$oldPattern = "document.getElementById('command-center-last-update').textContent = ``最後更新：`${commandCenterData.lastUpdate.toLocaleString('zh-TW')}``;"

# 取得 old pattern 的實際位置
$oldIdx = $content.IndexOf("command-center-last-update")
if ($oldIdx -gt 0) {
    # 找到這一整行
    $lineEnd = $content.IndexOf(";", $oldIdx)
    $lineStart = $content.LastIndexOf("`n", $oldIdx)
    Write-Host "Line from $lineStart to $lineEnd"
    
    $theLine = $content.Substring($lineStart + 1, $lineEnd - $lineStart)
    Write-Host "The line: $theLine"
}

# 嘗試直接用索引位置修復
# PSD 區塊在 951690 左右開始
# 我們需要在 "// 三週 PSD 分析功能" 之前加上函數結束碼

$psdCommentStart = $content.IndexOf("// =============================================`r`n        // 三週 PSD 分析功能")
if ($psdCommentStart -eq -1) {
    # 嘗試不同的換行符
    $psdCommentStart = $content.IndexOf("// ==============================================`n        // 三週 PSD 分析功能")
}

Write-Host "PSD comment block at: $psdCommentStart"

# 直接找 "// 三週 PSD 分析功能" 然後往前找 ===
$psdIdx = $content.IndexOf("// 三週 PSD 分析功能")
if ($psdIdx -gt 0) {
    $searchBack = $content.LastIndexOf("// =====", $psdIdx)
    Write-Host "=== line at: $searchBack"
    Write-Host "Content: " + $content.Substring($searchBack, 100)
}
