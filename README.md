# Vaccine Prompter 25# Welcome to your Lovable project



A React application for generating vaccination posters and materials with QR codes and customized date overlays.## Project info



## 🚀 Quick Start**URL**: https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a



### Prerequisites## How can I edit this code?

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

- **npm** or **bun** (package manager)There are several ways of editing your application.



### Local Development (Recommended)**Use Lovable**



```shSimply visit the [Lovable Project](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a) and start prompting.

# 1. Clone the repository

git clone https://github.com/vuhnger/vaccine-prompter-25.gitChanges made via Lovable will be committed automatically to this repo.



# 2. Navigate to project directory## Local Development Setup

cd vaccine-prompter-25

### Prerequisites

# 3. Install dependencies- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

npm install- **npm** or **bun** (package manager)

# or if you have bun installed:

# bun install### Quick Start



# 4. Start development server```sh

npm run dev# 1. Clone the repository

# or with bun:git clone https://github.com/vuhnger/vaccine-prompter-25.git

# bun run dev

# 2. Navigate to project directory

# 5. Open your browsercd vaccine-prompter-25

# Navigate to http://localhost:5173

```# 3. Install dependencies

npm install

The development server will start with hot reload - any changes you make to the code will automatically refresh the browser.# or if you have bun installed:

# bun install

## 🐳 Docker Alternative

# 4. Start development server

If you prefer containerized development:npm run dev

# or with bun:

### Development with Docker# bun run dev

```sh

# Start development server in Docker# 5. Open your browser

docker-compose --profile dev up# Navigate to http://localhost:5173

```

# Access at http://localhost:8080

```The development server will start with hot reload - any changes you make to the code will automatically refresh the browser.



### Production Build with Docker## Alternative: Running with Docker

```sh

# Build and test production version locallyIf you prefer containerized development or want to test production builds:

docker-compose --profile prod up --build

### Docker Development (with hot reload)

# Access at http://localhost (port 80)```sh

```# Start development server in Docker

docker-compose --profile dev up

## 📋 Available Scripts

# Or with alternative hot reload setup

| Command | Description |docker-compose --profile dev-hot up

|---------|-------------|```

| `npm run dev` | Start development server with hot reload at http://localhost:5173 |

| `npm run build` | Build for production |### Docker Production Build

| `npm run build:dev` | Build in development mode |```sh

| `npm run lint` | Run ESLint for code linting |# Build and test production version locally

| `npm run preview` | Preview the production build locally |docker-compose --profile prod up --build



## 💡 Development Tips# Access at http://localhost (port 80)

```

- **Primary Method**: Use `npm run dev` for daily development work - it's the fastest way to see your changes!

- **Hot Reload**: All changes to code will automatically refresh the browser## When to Use What?

- **Preview Function**: Use the preview button in the app to test template generation without creating ZIP files

| Method | Best For |

## 🛠️ Project Technologies|--------|----------|

| **npm run dev** | 🏃‍♂️ Daily development (fastest, easiest debugging) |

- **⚡ Vite** - Fast build tool and development server| **Docker dev** | 👥 Team consistency, testing containerization |

- **⚛️ React 18** - UI library with hooks and modern patterns  | **Docker prod** | 🚀 Testing production builds before deployment |

- **📘 TypeScript** - Type-safe JavaScript

- **🎨 Tailwind CSS** - Utility-first CSS framework## Available Development Scripts

- **🧩 shadcn/ui** - Beautiful, accessible component library

- **📋 React Hook Form** - Performant forms with validation| Command | Description |

- **🔍 Zod** - Schema validation|---------|-------------|

- **📄 PDF-lib** - PDF generation and manipulation| `npm run dev` | Start development server with hot reload at http://localhost:5173 |

- **📱 QR Code generation** - Dynamic QR code creation| `npm run build` | Build for production |

- **🖼️ Canvas API** - Image manipulation and overlay processing| `npm run build:dev` | Build in development mode |

| `npm run lint` | Run ESLint for code linting |

## 📁 Project Structure| `npm run preview` | Preview the production build locally |



```💡 **Tip**: Use `npm run dev` for daily development work - it's the fastest way to see your changes!

src/

├── components/          # React components## Project Technologies

│   ├── ui/             # shadcn/ui components

│   └── VaccinationForm.tsxThis project is built with modern web technologies:

├── services/           # Business logic services  

│   ├── imageService.ts # Canvas-based image manipulation- **⚡ Vite** - Fast build tool and development server

│   ├── fileService.ts  # File generation and ZIP creation- **⚛️ React 18** - UI library with hooks and modern patterns  

│   ├── qrService.ts    # QR code generation- **📘 TypeScript** - Type-safe JavaScript

│   └── emailService.ts # Email template generation- **🎨 Tailwind CSS** - Utility-first CSS framework

├── types/              # TypeScript type definitions- **🧩 shadcn/ui** - Beautiful, accessible component library

└── assets/- **📋 React Hook Form** - Performant forms with validation

    └── templates/      # Template images and resources- **🔍 Zod** - Schema validation

        └── cleaned_templates/ # Clean templates for overlay- **📄 PDF-lib** - PDF generation and manipulation

```- **📱 QR Code generation** - Dynamic QR code creation



## 🎯 Key Features## Working with Lovable



- **Template Processing**: Automatically processes all template images in `cleaned_templates/` folder- **Lovable Sync**: Changes pushed to this repo automatically sync with your [Lovable project](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a)

- **Smart Text Placement**: - **Local Development**: Work locally with your favorite IDE, push changes to see them in Lovable

  - Files with "booking" → Black date text in upper left corner- **Docker Deployment**: Lovable will automatically use Docker for production builds when you push this code

  - Files with "mission" → No date text (QR code only)

  - Other files → White date text in standard position- Navigate to the desired file(s).

- **QR Code Overlay**: Consistent QR code placement on all templates- Click the "Edit" button (pencil icon) at the top right of the file view.

- **Preview Mode**: Test template generation without creating files- Make your changes and commit the changes.

- **Multi-language Support**: Norwegian and English template variants

**Use GitHub Codespaces**

## 🏗️ How It Works

- Navigate to the main page of your repository.

1. **Form Input**: Fill in company details, dates, and booking link- Click on the "Code" button (green button) near the top right.

2. **Template Selection**: Choose from predefined alternatives- Select the "Codespaces" tab.

3. **Preview**: Test the output using the preview function- Click on "New codespace" to launch a new Codespace environment.

4. **Generate**: Create a complete ZIP package with all materials- Edit files directly within the Codespace and commit and push your changes once you're done.



### Template Processing Logic## What technologies are used for this project?



The application processes templates based on filename patterns:This project is built with:



```typescript- Vite

// QR Code: Always placed at 75% width, 85% height- TypeScript  

// Date Text Rules:- React

if (filename.includes('booking')) {- shadcn-ui

  // Black text in upper left (5% width, 5% height)- Tailwind CSS

} else if (filename.includes('mission')) {

  // No date text - QR code only*See the [Project Technologies](#project-technologies) section above for detailed information.*

} else {

  // White text at standard position (17% width, 54% height)## How can I deploy this project?

}

```Simply open [Lovable](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a) and click on Share -> Publish.



## 🔧 Development## Can I connect a custom domain to my Lovable project?



### Adding New TemplatesYes, you can!



1. Add image files to `src/assets/templates/cleaned_templates/`To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

2. Follow naming convention:

   - Include `booking` for booking posters (gets black date text)Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

   - Include `mission` for mission materials (gets QR code only)
   - Include `eng` for English variants

### Customizing Positioning

Modify positioning in `src/services/imageService.ts`:

- QR code position: `qrCenterX` and `qrCenterY` percentages
- Date text position: `dateX` and `dateY` percentages  
- Font sizes: Update `ctx.font` values

### Testing Changes

Use the preview function in the UI to test changes without generating full ZIP files.

## 🚀 Deployment

The project includes Docker configurations for easy deployment:

- **Development**: Hot reload with Docker
- **Production**: Optimized build with nginx
- **Multi-stage builds**: Efficient container images

## 📝 License

This project is private and proprietary.