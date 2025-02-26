#!/bin/bash

# Exit on error
set -e

# Variables
domains=(genify-ai.com www.genify-ai.com)
email="your-email@example.com"  # Use from .env
data_path="./certbot"
rsa_key_size=4096

# Load .env file
if [ -f .env ]; then
  source .env
  email=$DOMAIN_EMAIL
fi

# Create required directories
mkdir -p "$data_path/www/.well-known/acme-challenge"
mkdir -p "$data_path/conf/live/$DOMAIN_URL"
mkdir -p ./nginx/ssl

# Start nginx to handle ACME challenge
docker-compose up -d nginx

# Run certbot
docker-compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $email \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d ${domains[0]} -d ${domains[1]}

# Copy certificates to nginx ssl directory
cp "$data_path/conf/live/$DOMAIN_URL/fullchain.pem" ./nginx/ssl/cert.pem
cp "$data_path/conf/live/$DOMAIN_URL/privkey.pem" ./nginx/ssl/key.pem
chmod 644 ./nginx/ssl/cert.pem
chmod 600 ./nginx/ssl/key.pem

# Restart nginx to apply SSL
docker-compose restart nginx

echo "SSL certificates successfully obtained!" 