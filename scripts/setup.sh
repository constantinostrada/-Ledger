#!/bin/bash

# Ledger Setup Script

echo "🚀 Setting up Ledger..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  echo "✅ .env file created. Please update it with your configuration."
else
  echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start Docker containers
echo "🐳 Starting Docker containers..."
npm run docker:up

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run migrations
echo "🗄️  Running database migrations..."
npm run db:migrate

echo ""
echo "✨ Setup complete!"
echo ""
echo "Start the development server with: npm run dev"
echo "Visit: http://localhost:3000"
echo ""
