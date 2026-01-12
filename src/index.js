export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // Common headers for API responses
        const apiHeaders = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
        };

        // Mock Data
        const users = [
            { id: 1, name: 'Alice', role: 'Admin' },
            { id: 2, name: 'Bob', role: 'User' },
            { id: 3, name: 'Charlie', role: 'Developer' }
        ];

        // Router Logic
        if (path.startsWith('/api/')) {
            // GET /api/users - List users
            if (path === '/api/users' && method === 'GET') {
                return new Response(JSON.stringify(users, null, 2), { headers: apiHeaders });
            }

            // POST /api/users - Create user (Mock)
            if (path === '/api/users' && method === 'POST') {
                try {
                    const body = await request.json();
                    return new Response(JSON.stringify({
                        status: 'success',
                        message: 'User created',
                        data: body
                    }, null, 2), { headers: apiHeaders, status: 201 });
                } catch (e) {
                    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { headers: apiHeaders, status: 400 });
                }
            }

            // GET /api/info - Server Info
            if (path === '/api/info' && method === 'GET') {
                const info = {
                    time: new Date().toISOString(),
                    method: method,
                    headers: Object.fromEntries(request.headers),
                    cf: request.cf
                };
                return new Response(JSON.stringify(info, null, 2), { headers: apiHeaders });
            }

            // 404 for unknown API routes
            return new Response(JSON.stringify({ error: 'Not Found' }), { headers: apiHeaders, status: 404 });
        }

        // Serve HTML Dashboard for root
        if (path === '/' || path === '/index.html') {
            const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudflare Worker Backend</title>
    <style>
        :root {
            --primary: #f6821f;
            --background: #0f172a;
            --text: #f8fafc;
            --code-bg: #1e293b;
        }
        body {
            margin: 0;
            padding: 2rem;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: radial-gradient(circle at top left, #1e293b, #0f172a);
            color: var(--text);
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            background: linear-gradient(to right, #f6821f, #fbbf24);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        h2 { margin-top: 0; color: #e2e8f0; }
        code {
            background: var(--code-bg);
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-family: 'Fira Code', monospace;
            color: #fbbf24;
        }
        pre {
            background: var(--code-bg);
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            color: #e2e8f0;
        }
        .btn {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 500;
            margin-top: 1rem;
            cursor: pointer;
            border: none;
        }
        .btn:hover { filter: brightness(1.1); }
        .response-area {
            margin-top: 1rem;
            display: none;
        }
        .response-area.active { display: block; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Worker Backend API</h1>
        
        <div class="card">
            <h2>🌍 Get Users</h2>
            <p>Method: <code>GET</code> Endpoint: <code>/api/users</code></p>
            <p>Fetches a list of mock users.</p>
            <button class="btn" onclick="testEndpoint('/api/users')">Test Endpoint</button>
            <div id="res-users" class="response-area"><pre></pre></div>
        </div>

        <div class="card">
            <h2>📝 Create User</h2>
            <p>Method: <code>POST</code> Endpoint: <code>/api/users</code></p>
            <p>Sends a JSON payload to create a new user.</p>
            <button class="btn" onclick="testPost()">Test POST</button>
            <div id="res-post" class="response-area"><pre></pre></div>
        </div>

        <div class="card">
            <h2>ℹ️ Server Info</h2>
            <p>Method: <code>GET</code> Endpoint: <code>/api/info</code></p>
            <p>Returns server time and request information.</p>
            <button class="btn" onclick="testEndpoint('/api/info')">Test Info</button>
            <div id="res-info" class="response-area"><pre></pre></div>
        </div>
    </div>

    <script>
        async function testEndpoint(url) {
            const btn = event.target;
            const resArea = btn.nextElementSibling;
            const pre = resArea.querySelector('pre');
            
            btn.textContent = 'Loading...';
            try {
                const res = await fetch(url);
                const data = await res.json();
                pre.textContent = JSON.stringify(data, null, 2);
                resArea.classList.add('active');
            } catch (err) {
                pre.textContent = 'Error: ' + err.message;
                resArea.classList.add('active');
            }
            btn.textContent = 'Test Endpoint';
        }

        async function testPost() {
            const btn = event.target;
            const resArea = btn.nextElementSibling;
            const pre = resArea.querySelector('pre');
            
            btn.textContent = 'Sending...';
            try {
                const res = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: 'New User', role: 'Guest', timestamp: Date.now() })
                });
                const data = await res.json();
                pre.textContent = JSON.stringify(data, null, 2);
                resArea.classList.add('active');
            } catch (err) {
                pre.textContent = 'Error: ' + err.message;
                resArea.classList.add('active');
            }
            btn.textContent = 'Test POST';
        }
    </script>
</body>
</html>
            `;
            return new Response(html, {
                headers: { 'content-type': 'text/html;charset=UTF-8' },
            });
        }

        // 404 for other defaults
        return new Response('Not Found', { status: 404 });
    },
};
