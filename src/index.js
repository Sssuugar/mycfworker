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

            // POST /api/login - Login with D1
            if (path === '/api/login' && method === 'POST') {
                try {
                    const { username, password } = await request.json();

                    if (!username || !password) {
                        return new Response(JSON.stringify({ error: 'Missing username or password' }), { headers: apiHeaders, status: 400 });
                    }

                    // Query D1
                    const stmt = env.DB.prepare('SELECT * FROM user WHERE username = ? AND password = ?');
                    const { results } = await stmt.bind(username, password).all();

                    if (results && results.length > 0) {
                        // In a real app, you would return a token here
                        const user = results[0];
                        // Don't return the password
                        delete user.password;

                        return new Response(JSON.stringify({
                            status: 'success',
                            message: 'Login successful',
                            user: user
                        }, null, 2), { headers: apiHeaders });
                    } else {
                        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { headers: apiHeaders, status: 401 });
                    }
                } catch (e) {
                    return new Response(JSON.stringify({ error: 'Server Error: ' + e.message }), { headers: apiHeaders, status: 500 });
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


        // 404 for other defaults
        return new Response('Not Found', { status: 404 });
    },
};
