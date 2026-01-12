# mycfworker

一个简单的 Cloudflare Worker 示例，演示如何连接和使用 GitHub API。

## 功能特性

- ✅ 获取 GitHub 用户信息
- ✅ 获取仓库详细信息
- ✅ 获取用户的仓库列表
- ✅ 支持 CORS（跨域资源共享）
- ✅ 可选的 GitHub Token 认证
- ✅ 友好的 Web 界面

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

访问 `http://localhost:8787` 查看 Worker。

### 3. 部署到 Cloudflare

```bash
npm run deploy
```

## API 端点

### 获取用户信息

```
GET /user/{username}
```

示例:
```bash
curl https://your-worker.workers.dev/user/octocat
```

响应:
```json
{
  "login": "octocat",
  "name": "The Octocat",
  "bio": null,
  "public_repos": 8,
  "followers": 9999,
  "following": 9,
  "avatar_url": "https://avatars.githubusercontent.com/u/583231",
  "html_url": "https://github.com/octocat",
  "created_at": "2011-01-25T18:44:36Z"
}
```

### 获取仓库信息

```
GET /repo/{owner}/{repo}
```

示例:
```bash
curl https://your-worker.workers.dev/repo/cloudflare/workers-sdk
```

响应:
```json
{
  "name": "workers-sdk",
  "full_name": "cloudflare/workers-sdk",
  "description": "⛅️ Home to Wrangler, the CLI for Cloudflare Workers®",
  "language": "TypeScript",
  "stargazers_count": 2500,
  "forks_count": 500,
  "open_issues_count": 100,
  "html_url": "https://github.com/cloudflare/workers-sdk",
  "created_at": "2017-04-10T16:14:45Z",
  "updated_at": "2024-01-10T10:20:30Z"
}
```

### 获取用户仓库列表

```
GET /repos/{username}
```

示例:
```bash
curl https://your-worker.workers.dev/repos/octocat
```

## 配置 GitHub Token（可选）

为了提高 GitHub API 的速率限制，建议配置 GitHub Personal Access Token：

### 创建 GitHub Token

1. 访问 [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 为公开数据访问，不需要选择任何权限
4. 复制生成的 token

### 配置 Token

**本地开发：**

创建 `.dev.vars` 文件：
```bash
GITHUB_TOKEN=your_github_token_here
```

**生产环境：**

使用 wrangler 命令：
```bash
wrangler secret put GITHUB_TOKEN
```

或在 Cloudflare Dashboard 中设置环境变量。

## 速率限制

- 未认证请求: 60 次/小时
- 认证请求: 5000 次/小时

## 技术栈

- **Cloudflare Workers** - 边缘计算平台
- **GitHub REST API v3** - 数据来源
- **Wrangler** - Cloudflare Workers CLI 工具

## 项目结构

```
mycfworker/
├── src/
│   └── index.js          # Worker 主文件
├── .env.example          # 环境变量示例
├── .gitignore           # Git 忽略文件
├── package.json         # 项目配置
├── wrangler.toml        # Cloudflare Worker 配置
└── README.md           # 项目文档
```

## 开发说明

### 本地测试

使用 wrangler dev 在本地运行 Worker：

```bash
npm run dev
```

### 部署

部署到 Cloudflare Workers：

```bash
npm run deploy
```

## License

MIT