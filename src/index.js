export default {
    async fetch(request, env, ctx) {
        const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Cloudflare Worker Page</title>
    <style>
        :root {
            --primary: #f6821f;
            --background: #0f172a;
            --text: #f8fafc;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: radial-gradient(circle at top left, #1e293b, #0f172a);
            color: var(--text);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            padding: 3rem;
            border-radius: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            max-width: 500px;
            width: 90%;
            animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .logo {
            width: 80px;
            margin-bottom: 2rem;
            filter: drop-shadow(0 0 10px var(--primary));
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(to right, #f6821f, #fbbf24);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p {
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 0.8rem 2rem;
            border-radius: 9999px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 10px 15px -3px rgba(246, 130, 31, 0.3);
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(246, 130, 31, 0.4);
            filter: brightness(1.1);
        }
        .status {
            margin-top: 2rem;
            font-size: 0.875rem;
            color: #4ade80;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .dot {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            box-shadow: 0 0 10px #4ade80;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <svg class="logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.1 12.1c.3.5.5 1.1.5 1.6 0 .3 0 .7-.1 1-.1.3-.2.6-.4.9-.2.3-.5.5-.8.7-.3.2-.6.3-1 .3h-1.6c-.4 0-.8.1-1.1.3-.3.2-.6.5-.8.8-.2.3-.3.7-.3 1.1s.1.8.3 1.1c.2.3.5.6.8.8.3.2.7.3 1.1.3h.6c.3 0 .7.1 1 .2.3.1.6.3.9.5.3.2.5.5.7.8.2.3.3.7.3 1.1v.2H3.7c-.5 0-.9-.1-1.3-.4-.4-.3-.7-.7-.9-1.2l-.1-.4-.1-.5c0-.8.2-1.5.7-2.1.5-.6 1.1-1 1.9-1.3.4-.1.7-.3 1-.5.3-.2.5-.5.7-.8.2-.3.3-.7.3-1.1 0-.4-.1-.8-.3-1.1s-.5-.6-.8-.8c-.3-.2-.7-.3-1.1-.3h-1.3c-.4 0-.8-.1-1.1-.3-.3-.2-.6-.5-.8-.8-.2-.3-.3-.7-.3-1.1s.1-.8.3-1.1c.2-.3.5-.6.8-.8.3-.2.7-.3 1.1-.3h1.8c.4 0 .8-.1 1.1-.3.3-.2.6-.5.8-.8.2-.3.3-.7.3-1.1 0-.4-.1-.8-.3-1.1-.2-.3-.5-.6-.8-.8-.3-.2-.7-.3-1.1-.3h-.3c-.4 0-.8-.1-1.1-.3-.3-.2-.6-.5-.8-.8-.2-.3-.3-.7-.3-1.1v-.2h17.1l.1.3c.2.5.3 1.1.3 1.6 0 .4-.1.8-.3 1.1-.2.3-.5.6-.8.8-.3.2-.7.3-1.1.3h-1.9c-.4 0-.8.1-1.1.3-.3.2-.6.5-.8.8-.2.3-.3.7-.3 1.1s.1.8.3 1.1c.2.3.5.6.8.8.3.2.7.3 1.1.3h1c.4 0 .8.1 1.1.3.3.2.6.5.8.8.2.3.3.7.3 1.1 0 .4-.1.8-.3 1.1-.2.3-.5.6-.8.8-.3.2-.7.3-1.1.3h-.7c-.4 0-.8.1-1.1.3-.3.2-.6.5-.8.8-.2.3-.3.7-.3 1.1s.1.8.3 1.1c.2.3.5.6.8.8.3.2.7.3 1.1.3h1.3c.4 0 .8.1 1.1.3z" fill="#f6821f"/>
        </svg>
        <h1>Cloudflare Worker</h1>
        <p>这是一个从 Worker 直接生成的精美前端页面。无需服务器，全球加速。</p>
        <a href="https://dash.cloudflare.com" class="btn">前往控制台</a>
        <div class="status">
            <span class="dot"></span>
            运行状态：正常
        </div>
    </div>
</body>
</html>
    `;
        return new Response(html, {
            headers: {
                'content-type': 'text/html;charset=UTF-8',
            },
        });
    },
};
