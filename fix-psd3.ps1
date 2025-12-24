# 讀取檔案使用 .NET
$filepath = "C:\Users\max-7\OneDrive\Desktop\帳務系統\index .html"
$content = [System.IO.File]::ReadAllText($filepath, [System.Text.Encoding]::UTF8)

Write-Host "File length: $($content.Length)"

# 找到 PSD 區塊的位置
$psdIdx = $content.IndexOf("// 三週 PSD 分析功能")
Write-Host "PSD at position: $psdIdx"

# 找到 === 行的位置 (在 PSD 之前)
$eqLine = $content.LastIndexOf("// ===", $psdIdx)
Write-Host "=== line at: $eqLine"

# 顯示從 === 行到 PSD+30 的內容
$len = $psdIdx - $eqLine + 30
Write-Host "Content from === to PSD:"
Write-Host $content.Substring($eqLine, $len)
Write-Host "---END---"

# 現在要替換的舊文字是：從 === 行到 PSD 行結束
# 要替換的是這整個區塊
$oldText = $content.Substring($eqLine, $len)

# 新的替換文字
$newText = @"
console.log('✅ 戰情室數據載入完成');
            } catch (error) {
                console.error('載入戰情室數據失敗:', error);
            }
        }

        // =============================================
        // 三週 PSD 分析功能
        // =====
"@

Write-Host "Replacing..."
$content = $content.Replace($oldText, $newText)

# 儲存檔案
[System.IO.File]::WriteAllText($filepath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done! File saved."
