# /Users/itziklugassy/Downloads/arlo/frontend/server.py
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Point directly to the frontend directory
        super().__init__(*args, directory=os.path.dirname(__file__), **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
        return super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def translate_path(self, path):
        # Special handling for project detail pages
        if path.startswith('/project/'):
            return os.path.join(os.path.dirname(__file__), 'templates', 'project_detail.html')
        return super().translate_path(path)

def run(server_class=HTTPServer, handler_class=CORSRequestHandler, port=8002):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting frontend server at http://localhost:{port}')
    print(f'Serving files from: {os.path.dirname(__file__)}')
    httpd.serve_forever()

if __name__ == '__main__':
    run()