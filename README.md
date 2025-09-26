# Vaccine Prompter 25# Vaccine Prompter 25# Welcome to your Lovable project



A React application for generating vaccination posters and materials with QR codes and customized date overlays.



## 🚀 Quick StartA React application for generating vaccination posters and materials with QR codes and customized date overlays.## Project info



**URL**: https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a



### Prerequisites## 🚀 Quick Start**URL**: https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a



- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

- **npm** or **bun** (package manager)

### Prerequisites## How can I edit this code?

### Local Development (Recommended)

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh

# 1. Clone the repository- **npm** or **bun** (package manager)There are several ways of editing your application.

git clone https://github.com/vuhnger/vaccine-prompter-25.git



# 2. Navigate to project directory

cd vaccine-prompter-25### Local Development (Recommended)**Use Lovable**



# 3. Install dependencies

npm install

# or if you have bun installed:```shSimply visit the [Lovable Project](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a) and start prompting.

# bun install

# 1. Clone the repository

# 4. (Optional) Setup HTTPS for development

./setup-ssl.shgit clone https://github.com/vuhnger/vaccine-prompter-25.gitChanges made via Lovable will be committed automatically to this repo.



# 5. Start development server

npm run dev

# or with bun:# 2. Navigate to project directory## Local Development Setup

# bun run dev

cd vaccine-prompter-25

# 6. Open your browser

# Navigate to https://localhost:8080 (with HTTPS) or http://localhost:8080### Prerequisites

```

# 3. Install dependencies- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

The development server will start with hot reload - any changes you make to the code will automatically refresh the browser.

npm install- **npm** or **bun** (package manager)

## 🔒 Security Features

# or if you have bun installed:

This application includes comprehensive security hardening:

# bun install### Quick Start

### HTTPS Configuration

- **Development**: Automatic HTTPS with self-signed certificates

- **Production**: Ready for SSL/TLS deployment with nginx

- **Custom Certificates**: Use `./setup-ssl.sh` to generate local SSL certificates# 4. Start development server```sh



### Security Headersnpm run dev# 1. Clone the repository

- **Content Security Policy (CSP)**: Prevents XSS and code injection attacks

- **X-Frame-Options**: Prevents clickjacking attacks# or with bun:git clone https://github.com/vuhnger/vaccine-prompter-25.git

- **X-Content-Type-Options**: Prevents MIME type confusion attacks

- **Referrer Policy**: Controls referrer information# bun run dev

- **Permissions Policy**: Restricts browser API access

# 2. Navigate to project directory

### Production Security

- Nginx configuration with security headers# 5. Open your browsercd vaccine-prompter-25

- Static asset caching with security controls

- Hidden server tokens for security through obscurity# Navigate to http://localhost:5173



## 🐳 Docker Setup```# 3. Install dependencies



### Development with Dockernpm install

```sh

# Start development server in DockerThe development server will start with hot reload - any changes you make to the code will automatically refresh the browser.# or if you have bun installed:

docker-compose --profile dev up

# Access at http://localhost:8080# bun install

```

## 🐳 Docker Alternative

### Production Build with Docker

```sh# 4. Start development server

# Build and test production version locally

docker-compose --profile prod up --buildIf you prefer containerized development:npm run dev

# Access at http://localhost (port 80)

```# or with bun:



## 📋 Available Scripts### Development with Docker# bun run dev



| Command | Description |```sh

|---------|-------------|

| `npm run dev` | Start development server with HTTPS at https://localhost:8080 |# Start development server in Docker# 5. Open your browser

| `npm run build` | Build for production |

| `npm run build:dev` | Build in development mode |docker-compose --profile dev up# Navigate to http://localhost:5173

| `npm run lint` | Run ESLint for code linting |

| `npm run preview` | Preview the production build locally |```

| `./setup-ssl.sh` | Generate SSL certificates for local HTTPS development |

# Access at http://localhost:8080

## 💡 Development Tips

```The development server will start with hot reload - any changes you make to the code will automatically refresh the browser.

- **Primary Method**: Use `npm run dev` for daily development work - it's the fastest way to see your changes!

- **HTTPS Development**: Run `./setup-ssl.sh` once to enable HTTPS in development

- **Hot Reload**: All changes to code will automatically refresh the browser

- **Preview Function**: Use the preview button in the app to test template generation without creating ZIP files### Production Build with Docker## Alternative: Running with Docker



## When to Use What?```sh



| Method | Best For |# Build and test production version locallyIf you prefer containerized development or want to test production builds:

|--------|----------|

| **npm run dev** | 🏃‍♂️ Daily development (fastest, easiest debugging) |docker-compose --profile prod up --build

| **Docker dev** | 👥 Team consistency, testing containerization |

| **Docker prod** | 🚀 Testing production builds before deployment |### Docker Development (with hot reload)



## 🛠️ Project Technologies# Access at http://localhost (port 80)```sh



- **⚡ Vite** - Fast build tool and development server```# Start development server in Docker

- **⚛️ React 18** - UI library with hooks and modern patterns  

- **📘 TypeScript** - Type-safe JavaScriptdocker-compose --profile dev up

- **🎨 Tailwind CSS** - Utility-first CSS framework

- **🧩 shadcn/ui** - Beautiful, accessible component library## 📋 Available Scripts

- **📋 React Hook Form** - Performant forms with validation

- **🔍 Zod** - Schema validation# Or with alternative hot reload setup

- **📄 PDF-lib** - PDF generation and manipulation

- **📱 QR Code generation** - Dynamic QR code creation| Command | Description |docker-compose --profile dev-hot up

- **🖼️ Canvas API** - Image manipulation and overlay processing

- **🔒 Security Headers** - CSP, HTTPS, and other security measures|---------|-------------|```



## 📁 Project Structure| `npm run dev` | Start development server with hot reload at http://localhost:5173 |



```| `npm run build` | Build for production |### Docker Production Build

src/

├── components/          # React components| `npm run build:dev` | Build in development mode |```sh

│   ├── ui/             # shadcn/ui components

│   └── VaccinationForm.tsx| `npm run lint` | Run ESLint for code linting |# Build and test production version locally

├── services/           # Business logic services  

│   ├── imageService.ts # Canvas-based image manipulation| `npm run preview` | Preview the production build locally |docker-compose --profile prod up --build

│   ├── fileService.ts  # File generation and ZIP creation

│   ├── qrService.ts    # QR code generation

│   └── emailService.ts # Email template generation

├── types/              # TypeScript type definitions## 💡 Development Tips# Access at http://localhost (port 80)

└── assets/

    └── templates/      # Template images and resources```

        └── cleaned_templates/ # Clean templates for overlay

ssl/                    # SSL certificates for development (generated)- **Primary Method**: Use `npm run dev` for daily development work - it's the fastest way to see your changes!

nginx.conf              # Production nginx configuration with security headers

setup-ssl.sh            # SSL certificate generation script- **Hot Reload**: All changes to code will automatically refresh the browser## When to Use What?

```

- **Preview Function**: Use the preview button in the app to test template generation without creating ZIP files

## 🎯 Key Features

| Method | Best For |

- **Template Processing**: Automatically processes all template images in `cleaned_templates/` folder

- **Smart Text Placement**: ## 🛠️ Project Technologies|--------|----------|

  - Files with "booking" → Black date text in upper left corner

  - Files with "mission" → No date text (QR code only)| **npm run dev** | 🏃‍♂️ Daily development (fastest, easiest debugging) |

  - Other files → White date text in standard position

- **QR Code Overlay**: Consistent QR code placement on all templates with mint green backgrounds for graphic templates- **⚡ Vite** - Fast build tool and development server| **Docker dev** | 👥 Team consistency, testing containerization |

- **Preview Mode**: Test template generation without creating files

- **Multi-language Support**: Norwegian and English template variants- **⚛️ React 18** - UI library with hooks and modern patterns  | **Docker prod** | 🚀 Testing production builds before deployment |

- **Selective Downloads**: Choose which files to include in the ZIP package

- **Security Hardened**: HTTPS, CSP headers, and secure nginx configuration- **📘 TypeScript** - Type-safe JavaScript



## 🏗️ How It Works- **🎨 Tailwind CSS** - Utility-first CSS framework## Available Development Scripts



1. **Form Input**: Fill in company details, dates, and booking link- **🧩 shadcn/ui** - Beautiful, accessible component library

2. **Template Selection**: Choose from predefined alternatives

3. **Preview**: Test the output using the preview function- **📋 React Hook Form** - Performant forms with validation| Command | Description |

4. **Generate**: Create a complete ZIP package with selected materials

- **🔍 Zod** - Schema validation|---------|-------------|

### Template Processing Logic

- **📄 PDF-lib** - PDF generation and manipulation| `npm run dev` | Start development server with hot reload at http://localhost:5173 |

The application processes templates based on filename patterns:

- **📱 QR Code generation** - Dynamic QR code creation| `npm run build` | Build for production |

```typescript

// QR Code: Always placed at 75% width, 85% height with mint background for graphic templates- **🖼️ Canvas API** - Image manipulation and overlay processing| `npm run build:dev` | Build in development mode |

// Date Text Rules:

if (filename.includes('booking')) {| `npm run lint` | Run ESLint for code linting |

  // Black text in upper left (5.3% width, 5% height)

} else if (filename.includes('mission')) {## 📁 Project Structure| `npm run preview` | Preview the production build locally |

  // No date text - QR code only

} else {

  // White text at standard position (17% width, 54% height)

}```💡 **Tip**: Use `npm run dev` for daily development work - it's the fastest way to see your changes!

```

src/

## 🔧 Development

├── components/          # React components## Project Technologies

### Adding New Templates

│   ├── ui/             # shadcn/ui components

1. Add image files to `src/assets/templates/cleaned_templates/`

2. Follow naming convention:│   └── VaccinationForm.tsxThis project is built with modern web technologies:

   - Include `booking` for booking posters (gets black date text)

   - Include `mission` for mission materials (gets QR code only)├── services/           # Business logic services  

   - Include `eng` for English variants

│   ├── imageService.ts # Canvas-based image manipulation- **⚡ Vite** - Fast build tool and development server

### Customizing Positioning

│   ├── fileService.ts  # File generation and ZIP creation- **⚛️ React 18** - UI library with hooks and modern patterns  

Modify positioning in `src/services/imageService.ts`:

- QR code position: `qrCenterX` and `qrCenterY` percentages│   ├── qrService.ts    # QR code generation- **📘 TypeScript** - Type-safe JavaScript

- Date text position: `dateX` and `dateY` percentages  

- Font sizes: Update `ctx.font` values│   └── emailService.ts # Email template generation- **🎨 Tailwind CSS** - Utility-first CSS framework



### Testing Changes├── types/              # TypeScript type definitions- **🧩 shadcn/ui** - Beautiful, accessible component library



Use the preview function in the UI to test changes without generating full ZIP files.└── assets/- **📋 React Hook Form** - Performant forms with validation



## 🚀 Deployment    └── templates/      # Template images and resources- **🔍 Zod** - Schema validation



The project includes Docker configurations for easy deployment:        └── cleaned_templates/ # Clean templates for overlay- **📄 PDF-lib** - PDF generation and manipulation



- **Development**: Hot reload with Docker and HTTPS support```- **📱 QR Code generation** - Dynamic QR code creation

- **Production**: Optimized build with nginx and comprehensive security headers

- **Multi-stage builds**: Efficient container images

- **Security**: CSP headers, HTTPS ready, and secure nginx configuration

## 🎯 Key Features## Working with Lovable

## 🔐 Security Considerations



- All security headers are configured for both development and production

- HTTPS is enabled by default in development mode- **Template Processing**: Automatically processes all template images in `cleaned_templates/` folder- **Lovable Sync**: Changes pushed to this repo automatically sync with your [Lovable project](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a)

- Production nginx includes comprehensive security measures

- No hardcoded sensitive data (all demo/placeholder content)- **Smart Text Placement**: - **Local Development**: Work locally with your favorite IDE, push changes to see them in Lovable

- Ready for environment-based configuration for sensitive values

  - Files with "booking" → Black date text in upper left corner- **Docker Deployment**: Lovable will automatically use Docker for production builds when you push this code

## Working with Lovable

  - Files with "mission" → No date text (QR code only)

- **Use Lovable**: Simply visit the [Lovable Project](https://lovable.dev/projects/1507ea50-6f3f-4812-ab2d-7fb092f3f01a) and start prompting

- **Lovable Sync**: Changes made via Lovable will be committed automatically to this repo  - Other files → White date text in standard position- Navigate to the desired file(s).

- **Local Development**: Work locally with your favorite IDE, push changes to see them in Lovable

- **Docker Deployment**: Lovable will automatically use Docker for production builds when you push this code- **QR Code Overlay**: Consistent QR code placement on all templates- Click the "Edit" button (pencil icon) at the top right of the file view.



## 📝 License- **Preview Mode**: Test template generation without creating files- Make your changes and commit the changes.



This project is private and proprietary.- **Multi-language Support**: Norwegian and English template variants

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