#!/bin/bash

# Create SSL directory if it doesn't exist
mkdir -p ./nginx/ssl

# Copy certificates
cp ./certbot/conf/live/${DOMAIN_URL}/fullchain.pem ./nginx/ssl/cert.pem
cp ./certbot/conf/live/${DOMAIN_URL}/privkey.pem ./nginx/ssl/key.pem

# Set proper permissions
chmod 644 ./nginx/ssl/cert.pem
chmod 600 ./nginx/ssl/key.pem

# Reload nginx to apply new certificates
docker exec genify-nginx nginx -s reload 