# 讀取檔案
$filepath = "C:\Users\max-7\OneDrive\Desktop\帳務系統\index .html"
$content = Get-Content -Path $filepath -Raw -Encoding UTF8

# 找到 PSD 區塊的位置
$psdIdx = $content.IndexOf("// 三週 PSD 分析功能")
Write-Host "PSD at position: $psdIdx"

# 找到 === 行的位置 (在 PSD 之前)
$eqLine = $content.LastIndexOf("// ===", $psdIdx)
Write-Host "=== line at: $eqLine"

# 顯示從 === 行到 PSD 的內容
Write-Host "Content from === to PSD:"
Write-Host $content.Substring($eqLine, $psdIdx - $eqLine + 30)

# 現在要替換的舊文字是：從 === 行到 PSD 行
# 用 RegEx 來匹配
$pattern = '// =============================================\r?\n\s+// 三週 PSD 分析功能'

if ($content -match $pattern) {
    Write-Host "Found pattern!"
    
    # 新的替換文字
    $replacement = @"
console.log('✅ 戰情室數據載入完成');
            } catch (error) {
                console.error('載入戰情室數據失敗:', error);
            }
        }

        // =============================================
        // 三週 PSD 分析功能
"@

    # 執行替換
    $content = $content -replace $pattern, $replacement
    
    # 儲存檔案
    Set-Content -Path $filepath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "File saved!"
} else {
    Write-Host "Pattern not found"
}
