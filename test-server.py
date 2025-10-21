#!/usr/bin/env python3
"""
簡單的 HTTP 測試服務器
用於測試 CORS 問題的解決方案
"""

import http.server
import socketserver
import json
from urllib.parse import urlparse, parse_qs

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加 CORS 標頭
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # 解析 URL 路徑
        parsed_path = urlparse(self.path)
        
        # 如果請求是 /textselectdata/ 開頭的路徑
        if parsed_path.path.startswith('/textselectdata/'):
            # 提取 MAC 地址
            mac_address = parsed_path.path.split('/')[-1]
            
            # 模擬回應資料
            test_data = {
                "mac": mac_address,
                "data": [
                    {
                        "時間": "2024-10-21 10:30:00",
                        "機台": "A01",
                        "投幣": 50,
                        "出貨": 1,
                        "營收": 50
                    },
                    {
                        "時間": "2024-10-21 11:15:00", 
                        "機台": "A02",
                        "投幣": 100,
                        "出貨": 2,
                        "營收": 100
                    },
                    {
                        "時間": "2024-10-21 12:00:00",
                        "機台": "B01", 
                        "投幣": 75,
                        "出貨": 1,
                        "營收": 75
                    }
                ],
                "總營收": 225,
                "總投幣": 225,
                "總出貨": 4,
                "狀態": "正常",
                "最後更新": "2024-10-21 12:30:00"
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.end_headers()
            
            # 回傳 JSON 資料
            json_data = json.dumps(test_data, ensure_ascii=False, indent=2)
            self.wfile.write(json_data.encode('utf-8'))
            
        else:
            # 其他請求使用預設處理
            super().do_GET()

    def do_OPTIONS(self):
        # 處理 preflight 請求
        self.send_response(200)
        self.end_headers()

def run_server(port=5539):
    """啟動測試服務器"""
    try:
        with socketserver.TCPServer(("", port), CORSHTTPRequestHandler) as httpd:
            print(f"🚀 測試服務器已啟動於 http://localhost:{port}")
            print(f"📡 測試 URL: http://localhost:{port}/textselectdata/083A8DE1ED14")
            print("🔧 此服務器已正確設定 CORS 標頭，應該可以解決跨域問題")
            print("🛑 按 Ctrl+C 停止服務器")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✅ 服務器已停止")
    except OSError as e:
        if e.errno == 10048:  # Windows: Address already in use
            print(f"❌ 埠 {port} 已被占用，請嘗試其他埠號")
            print(f"💡 使用方法: python test-server.py [埠號]")
        else:
            print(f"❌ 啟動服務器時發生錯誤: {e}")

if __name__ == "__main__":
    import sys
    
    # 允許自訂埠號
    port = 5539
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ 埠號必須是數字")
            sys.exit(1)
    
    run_server(port)