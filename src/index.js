/**
 * Cloudflare Worker that connects to GitHub API
 * This worker demonstrates basic GitHub API integration
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Route handling
    if (url.pathname === '/') {
      return new Response(getHomePage(), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }
    
    // Get GitHub user information
    if (url.pathname.startsWith('/user/')) {
      const username = url.pathname.split('/user/')[1];
      if (!isValidUsername(username)) {
        return new Response('Invalid username', { status: 400 });
      }
      return await getGitHubUser(username, env);
    }
    
    // Get repository information
    if (url.pathname.startsWith('/repo/')) {
      const repoPath = url.pathname.split('/repo/')[1]; // format: owner/repo
      if (!isValidRepoPath(repoPath)) {
        return new Response('Invalid repository path. Format: owner/repo', { status: 400 });
      }
      return await getGitHubRepo(repoPath, env);
    }
    
    // Get user's repositories
    if (url.pathname.startsWith('/repos/')) {
      const username = url.pathname.split('/repos/')[1];
      if (!isValidUsername(username)) {
        return new Response('Invalid username', { status: 400 });
      }
      return await getGitHubUserRepos(username, env);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

/**
 * Get GitHub user information
 */
async function getGitHubUser(username, env) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: getGitHubHeaders(env)
    });
    
    if (!response.ok) {
      return new Response(`GitHub API Error: ${response.status}`, { 
        status: response.status 
      });
    }
    
    const data = await response.json();
    
    // Return formatted user information
    const userInfo = {
      login: data.login,
      name: data.name,
      bio: data.bio,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      created_at: data.created_at
    };
    
    return new Response(JSON.stringify(userInfo, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

/**
 * Get GitHub repository information
 */
async function getGitHubRepo(repoPath, env) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
      headers: getGitHubHeaders(env)
    });
    
    if (!response.ok) {
      return new Response(`GitHub API Error: ${response.status}`, { 
        status: response.status 
      });
    }
    
    const data = await response.json();
    
    // Return formatted repository information
    const repoInfo = {
      name: data.name,
      full_name: data.full_name,
      description: data.description,
      language: data.language,
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
      open_issues_count: data.open_issues_count,
      html_url: data.html_url,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return new Response(JSON.stringify(repoInfo, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

/**
 * Get user's repositories
 */
async function getGitHubUserRepos(username, env) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
      {
        headers: getGitHubHeaders(env)
      }
    );
    
    if (!response.ok) {
      return new Response(`GitHub API Error: ${response.status}`, { 
        status: response.status 
      });
    }
    
    const data = await response.json();
    
    // Return formatted repositories list
    const repos = data.map(repo => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      html_url: repo.html_url
    }));
    
    return new Response(JSON.stringify(repos, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

/**
 * Get headers for GitHub API requests
 */
function getGitHubHeaders(env) {
  const headers = {
    'User-Agent': 'Cloudflare-Worker',
    'Accept': 'application/vnd.github.v3+json'
  };
  
  // Add authorization if GITHUB_TOKEN is available
  if (env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
  }
  
  return headers;
}

/**
 * Home page HTML
 */
function getHomePage() {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudflare Worker - GitHub API</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #0366d6;
            padding-bottom: 10px;
        }
        h2 {
            color: #0366d6;
            margin-top: 30px;
        }
        code {
            background: #f6f8fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            color: #e83e8c;
        }
        pre {
            background: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            border: 1px solid #e1e4e8;
        }
        .endpoint {
            margin: 15px 0;
            padding: 10px;
            background: #f0f7ff;
            border-left: 4px solid #0366d6;
            border-radius: 4px;
        }
        .example {
            color: #0366d6;
            text-decoration: none;
        }
        .example:hover {
            text-decoration: underline;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin: 8px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Cloudflare Worker - GitHub API 示例</h1>
        <p>这是一个简单的 Cloudflare Worker，演示如何连接和使用 GitHub API。</p>
        
        <h2>📚 API 端点</h2>
        
        <div class="endpoint">
            <strong>获取 GitHub 用户信息</strong>
            <pre>GET /user/{username}</pre>
            <p>示例: <a class="example" href="/user/octocat">/user/octocat</a></p>
        </div>
        
        <div class="endpoint">
            <strong>获取仓库信息</strong>
            <pre>GET /repo/{owner}/{repo}</pre>
            <p>示例: <a class="example" href="/repo/cloudflare/workers-sdk">/repo/cloudflare/workers-sdk</a></p>
        </div>
        
        <div class="endpoint">
            <strong>获取用户的仓库列表</strong>
            <pre>GET /repos/{username}</pre>
            <p>示例: <a class="example" href="/repos/octocat">/repos/octocat</a></p>
        </div>
        
        <h2>🔧 使用说明</h2>
        <ul>
            <li>所有端点返回 JSON 格式数据</li>
            <li>GitHub API 有速率限制：未认证 60 次/小时，认证后 5000 次/小时</li>
            <li>建议配置 <code>GITHUB_TOKEN</code> 环境变量以提高速率限制</li>
            <li>支持 CORS，可直接从前端调用</li>
        </ul>
        
        <h2>⚙️ 配置 GitHub Token（可选）</h2>
        <p>为了提高 API 速率限制，可以配置 GitHub Personal Access Token：</p>
        <pre>wrangler secret put GITHUB_TOKEN</pre>
        <p>或在 Cloudflare Dashboard 中配置环境变量。</p>
        
        <h2>📖 技术栈</h2>
        <ul>
            <li>Cloudflare Workers - 边缘计算平台</li>
            <li>GitHub REST API v3 - 数据来源</li>
            <li>JavaScript ES Modules - 代码实现</li>
        </ul>
    </div>
</body>
</html>
  `;
}

/**
 * Validate GitHub username
 * GitHub usernames can only contain alphanumeric characters and hyphens
 * Cannot start or end with a hyphen, and cannot have consecutive hyphens
 */
function isValidUsername(username) {
  if (!username || typeof username !== 'string') {
    return false;
  }
  // GitHub username rules: 1-39 characters, alphanumeric and hyphens, no consecutive hyphens
  const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
  return usernameRegex.test(username) && !username.includes('--');
}

/**
 * Validate GitHub repository path (owner/repo format)
 */
function isValidRepoPath(repoPath) {
  if (!repoPath || typeof repoPath !== 'string') {
    return false;
  }
  const parts = repoPath.split('/');
  // Must have exactly 2 parts: owner and repo name
  if (parts.length !== 2) {
    return false;
  }
  const [owner, repo] = parts;
  // Both owner and repo must be valid
  return isValidUsername(owner) && isValidRepoName(repo);
}

/**
 * Validate GitHub repository name
 */
function isValidRepoName(repoName) {
  if (!repoName || typeof repoName !== 'string') {
    return false;
  }
  // Repository names can contain alphanumeric, hyphens, underscores, and dots
  // Max length is 100 characters
  const repoNameRegex = /^[a-zA-Z0-9._-]{1,100}$/;
  return repoNameRegex.test(repoName);
}
