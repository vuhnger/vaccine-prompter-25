#!/bin/bash

# Script to generate self-signed SSL certificates for local development
# This enables HTTPS in development mode

CERT_DIR="./ssl"
DAYS=365
KEY_FILE="$CERT_DIR/localhost.key"
CERT_FILE="$CERT_DIR/localhost.crt"

echo "Setting up HTTPS for local development..."

# Create ssl directory if it doesn't exist
mkdir -p "$CERT_DIR"

# Generate private key
echo "Generating private key..."
openssl genrsa -out "$KEY_FILE" 2048

# Generate self-signed certificate
echo "Generating self-signed certificate..."
openssl req -new -x509 -key "$KEY_FILE" -out "$CERT_FILE" -days "$DAYS" \
  -subj "/C=NO/ST=Oslo/L=Oslo/O=Dr. Dropin/OU=Development/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:127.0.0.1,IP:127.0.0.1,IP:::1"

# Set appropriate permissions
chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"

echo "SSL certificates generated successfully!"
echo "Key file: $KEY_FILE"
echo "Certificate file: $CERT_FILE"
echo ""
echo "Note: You'll need to accept the self-signed certificate in your browser"
echo "or add it to your system's trusted certificates for seamless development."
echo ""
echo "To start the development server with HTTPS:"
echo "npm run dev"