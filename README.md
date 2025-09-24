# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

## Local Development Setup

### Prerequisites
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** (package manager)

### Quick Start

```sh
# 1. Clone the repository
git clone https://github.com/vuhnger/vaccine-prompter-25.git

# 2. Navigate to project directory
cd vaccine-prompter-25

# 3. Install dependencies
npm install
# or if you have bun installed:
# bun install

# 4. Start development server
npm run dev
# or with bun:
# bun run dev

# 5. Open your browser
# Navigate to http://localhost:5173
```

The development server will start with hot reload - any changes you make to the code will automatically refresh the browser.

## Alternative: Running with Docker

If you prefer containerized development or want to test production builds:

### Docker Development (with hot reload)
```sh
# Start development server in Docker
docker-compose --profile dev up

# Or with alternative hot reload setup
docker-compose --profile dev-hot up
```

### Docker Production Build
```sh
# Build and test production version locally
docker-compose --profile prod up --build

# Access at http://localhost (port 80)
```

## When to Use What?

| Method | Best For |
|--------|----------|
| **npm run dev** | 🏃‍♂️ Daily development (fastest, easiest debugging) |
| **Docker dev** | 👥 Team consistency, testing containerization |
| **Docker prod** | 🚀 Testing production builds before deployment |

## Available Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload at http://localhost:5173 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | Run ESLint for code linting |
| `npm run preview` | Preview the production build locally |

💡 **Tip**: Use `npm run dev` for daily development work - it's the fastest way to see your changes!

## Project Technologies

This project is built with modern web technologies:

- **⚡ Vite** - Fast build tool and development server
- **⚛️ React 18** - UI library with hooks and modern patterns  
- **📘 TypeScript** - Type-safe JavaScript
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - Beautiful, accessible component library
- **📋 React Hook Form** - Performant forms with validation
- **🔍 Zod** - Schema validation
- **📄 PDF-lib** - PDF generation and manipulation
- **📱 QR Code generation** - Dynamic QR code creation

## Working with Lovable

- **Lovable Sync**: Changes pushed to this repo automatically sync with your [Lovable project](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a)
- **Local Development**: Work locally with your favorite IDE, push changes to see them in Lovable
- **Docker Deployment**: Lovable will automatically use Docker for production builds when you push this code

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript  
- React
- shadcn-ui
- Tailwind CSS

*See the [Project Technologies](#project-technologies) section above for detailed information.*

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
