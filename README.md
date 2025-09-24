# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Running with Docker

You can also run this project using Docker, which provides a consistent environment across different systems.

### Prerequisites for Docker
- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

### Docker Development Setup

**Option 1: Using Docker Compose (Recommended for development)**
```sh
# Start development server with hot reload
docker-compose --profile dev up

# Or for alternative hot reload setup
docker-compose --profile dev-hot up
```

**Option 2: Using Docker directly**
```sh
# Build the development image
docker build --target build -t vaccine-prompter-dev .

# Run development container
docker run -p 5173:5173 -v $(pwd):/app vaccine-prompter-dev npm run dev
```

### Docker Production Setup

**Using Docker Compose:**
```sh
# Build and run production version
docker-compose --profile prod up --build
```

**Using Docker directly:**
```sh
# Build production image
docker build -t vaccine-prompter .

# Run production container
docker run -p 80:80 vaccine-prompter
```

The production setup uses nginx to serve the built static files for optimal performance.

### Docker Commands Summary
docker-compose --profile prod up --build
| Command | Description |
|---------|-------------|
| `docker-compose --profile dev up` | Development with hot reload |
| `docker-compose --profile prod up` | Production build |
| `docker-compose down` | Stop and remove containers |
| `docker-compose logs` | View container logs |

## Available Scripts

From your `package.json`, you have these available commands:

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint for code linting
- `npm run preview` - Preview the production build locally

## Docker vs npm/bun

- **Use npm/bun** for quick local development and when working with Lovable
- **Use Docker** for:
  - Consistent environments across team members
  - Production-like testing
  - Deployment to container platforms
  - When you need isolated dependencies

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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
