import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// Check if SSL certificates exist for development
const getHttpsConfig = () => {
  const keyPath = path.resolve(__dirname, "ssl/localhost.key");
  const certPath = path.resolve(__dirname, "ssl/localhost.crt");
  
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }
  // Return undefined to let Vite generate its own self-signed certificate
  return undefined;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";
  const isLocalDevelopment = isDevelopment && !process.env.CODESPACE_NAME && !process.env.GITPOD_WORKSPACE_ID;
  
  return {
    server: {
      host: "::",
      port: 8080,
      https: isLocalDevelopment ? getHttpsConfig() : undefined,
      headers: {
        // Content Security Policy headers (development-optimized)
        'Content-Security-Policy': isDevelopment ? [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Vite HMR in dev
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "img-src 'self' data: blob: https:",
          "connect-src 'self' https: wss:", // wss: needed for Vite HMR
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'"
        ].join('; ') : [
          "default-src 'self'",
          "script-src 'self'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "img-src 'self' data: blob: https:",
          "connect-src 'self' https:",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'"
        ].join('; '),
        // Additional security headers
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      }
    },
    plugins: [react(), isDevelopment && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Production build optimizations
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-checkbox'],
            utils: ['jszip', 'qrcode', 'zod']
          }
        }
      }
    }
  };
});
