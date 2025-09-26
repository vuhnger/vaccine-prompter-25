# Vaksinasjonsmateriell Generator

En komplett løsning for å generere tilpassede vaksinasjonsmaterialer for bedriftsvaksinering. Utviklet av DR.DROPIN BHT AS for å effektivisere prosessen med å lage plakater, informasjonsmateriell og booking-lenker for bedrifter.

## 🚀 Live Demo

Applikasjonen er hostet på Lovable.dev og tilgjengelig på:

[DrD BHT Vaksinasjonsmateriell Generator](https://preview--vaccine-prompter-25.lovable.app/)

## 📋 Funksjonalitet

### Hovedfunksjoner
- **Automatisk plakat-generering** med bedriftsspesifikk informasjon
- **QR-kode generering** for booking-lenker
- **Fire alternative design-varianter** (Alt 1-4) med ulike vaksinasjonsopplegg
- **Flerspråklig støtte** (norsk og engelsk)
- **Mission-spesifikke plakater** for oppdrag
- **Informasjonsmateriell** inkludert i alle pakker
- **Forhåndsvisning og seleksjon** av spesifikke filer
- **Responsivt design** som fungerer på alle enheter

### Generert innhold
- **Booking-plakater** med QR-koder og bedriftsinformasjon
- **Mission-plakater** for oppdragsbasert vaksinering  
- **Informasjonsark** om vaksiner (Boostrix Polio og Influensa)
- **Egenerklæringer** på norsk og engelsk

## �️ Teknisk Oversikt

### Tech Stack
- **Frontend**: React 18 med TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form med Zod validering
- **QR Code**: qrcode library
- **Deployment**: Docker + Nginx

### Sikkerhet
- **HTTPS/SSL** støtte i både utvikling og produksjon
- **Content Security Policy (CSP)** headers
- **Sikkerhetshoder** (X-Frame-Options, X-Content-Type-Options, etc.)
- **Input validering** med Zod schemas

## 🏗️ Utvikling og Installasjon

### Forutsetninger
- Node.js 18+ 
- npm eller yarn
- Docker (for containerisering)

### Lokal Utvikling

1. **Klon prosjektet**
```bash
git clone git@github.com:vuhnger/vaccine-prompter-25.git
cd vaccine-prompter-25
```

2. **Installer dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Applikasjonen kjører lokalt på `http://localhost:8080` (automatisk HTTPS hvis SSL-sertifikater er tilgjengelig).

### SSL for Lokal Utvikling (Valgfritt)

Generer lokale SSL-sertifikater for HTTPS i utvikling:

```bash
# Gjør script kjørbart
chmod +x setup-ssl.sh

# Generer SSL-sertifikater
./setup-ssl.sh

# Start med HTTPS
npm run dev
# Tilgjengelig på https://localhost:8080
```

### Bygging for Produksjon

```bash
# Bygg produksjonsversjon
npm run build

# Forhåndsvis produksjonsbygg lokalt
npm run preview
```

Produksjonsfilene genereres i `dist` mappen.

## 🐳 Docker Deployment

### Lokal Docker

```bash
# Bygg og kjør produksjonscontainer
docker-compose --profile prod up --build

# Tilgjengelig på http://localhost
```

### Docker Commands

```bash
# Bygg image
docker build -t vaccine-prompter-25 .

# Kjør container
docker run -p 80:80 vaccine-prompter-25

# Med environment variables
docker run -p 80:80 \
  -e NODE_ENV=production \
  vaccine-prompter-25
```

## 📁 Prosjektstruktur

```
vaccine-prompter-25/
├── src/
│   ├── components/          # React komponenter
│   │   └── VaccinationForm.tsx
│   ├── services/           # Business logic og API calls
│   │   ├── fileService.ts
│   │   ├── imageService.ts
│   │   ├── qrService.ts
│   │   └── pdfService.ts
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Statiske ressurser
│   │   ├── templates/      # Plakat-templates
│   │   │   ├── alt1/       # Alternative 1 templates
│   │   │   ├── alt2/       # Alternative 2 templates  
│   │   │   ├── alt3/       # Alternative 3 templates
│   │   │   └── alt4/       # Alternative 4 templates
│   │   ├── information/    # Info-ark og egenerklæringer
│   │   └── logos/          # Dr. Dropin logo
│   └── styles/             # CSS og Tailwind konfiguration
├── docker-compose.yml      # Docker konfiguration
├── Dockerfile             # Container definisjon
├── nginx.conf             # Produksjon web server konfig
├── tailwind.config.ts     # Tailwind CSS konfig
├── vite.config.ts         # Vite build konfig
└── package.json
```

## 🎨 Design System

### Fargepalett
- **Moss Green** (Primær): `#2E4F4E`
- **Light Mint** (Accent 1): `#D6E8E5` 
- **Mint** (Accent 2): `#75D1C6`

### Template Alternativer
- **Alt 1**: Kun influensa, bedrift betaler
- **Alt 2**: Kun influensa, arbeidsgiver betaler  
- **Alt 3**: Kombo-vaksinering, bedrift betaler
- **Alt 4**: Kombo-vaksinering, arbeidsgiver betaler

## 📦 Deployment

### Lovable.dev (Anbefalt)

Prosjektet er automatisk deployert på Lovable.dev. Endringer pushes automatisk ved commit til main branch:

```bash
git add .
git commit -m "Beskrivelse av dine endringer"
git push
```

### Manuell Deployment

For deployment til andre tjenester, bruk Docker-containeren:

```bash
# Bygg for produksjon
docker build -t vaccine-prompter-25 .

# Deploy til sky-tjeneste av ditt valg
# (AWS, Google Cloud, Azure, DigitalOcean, etc.)
```

## 🔧 Konfiguration

### Environment Variables

For produksjon kan følgende environment variables settes:

```bash
NODE_ENV=production
VITE_API_URL=https://your-api.com
```

### Nginx Konfiguration

Produksjon bruker Nginx med sikkerhetshoder. Se `nginx.conf` for full konfiguration.

## 🧪 Testing

```bash
# Kjør tester (når implementert)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📈 Performance

### Optimalisering
- **Lazy loading** av templates og assets
- **Image compression** for optimale filstørrelser  
- **Caching** av genererte QR-koder
- **Gzip komprimering** i produksjon
- **CDN** via Lovable.dev

### Bundle Size
- Optimalisert bundle size med tree shaking
- Dynamiske imports for store dependencies
- Asset optimalisering med Vite

## 🤝 Bidrag

Dette er et internt DR.DROPIN BHT AS prosjekt. For endringer eller forbedringer:

1. Opprett en branch fra main
2. Gjør dine endringer  
3. Test lokalt med `npm run dev`
4. Commit og push til Lovable.dev

## 📞 Support

For spørsmål eller problemer, kontakt utvecklingsteamet:

**DR.DROPIN BHT AS**
- Organisasjonsnummer: 927 103 036
- Adresse: Sørkedalsveien 8A, 0369 Oslo, Norge

## � Lisens

© 2025 DR.DROPIN BHT AS - Alle rettigheter forbeholdt

Dette produktet er utviklet for bedriftsvaksinering og er eiet av DR.DROPIN BHT AS.

---

**Vaksinasjonsmateriell Generator** - Effektiv løsning for bedriftsvaksinering
