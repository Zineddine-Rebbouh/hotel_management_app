#!/bin/bash
# Hotel Management App - Local Setup & Verification Script

echo "======================================"
echo "Hotel Management App - Setup Checker"
echo "======================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "  ✅ Node.js installed: $NODE_VERSION"
else
    echo "  ❌ Node.js not found. Please install Node.js v16+"
    exit 1
fi

echo ""
echo "✓ Checking project structure..."

# Check backend
if [ -d "Backend" ]; then
    echo "  ✅ Backend folder exists"
    if [ -f "Backend/package.json" ]; then
        echo "  ✅ Backend/package.json exists"
    fi
else
    echo "  ❌ Backend folder not found"
fi

# Check frontend
if [ -d "Frontend" ]; then
    echo "  ✅ Frontend folder exists"
    if [ -f "Frontend/package.json" ]; then
        echo "  ✅ Frontend/package.json exists"
    fi
else
    echo "  ❌ Frontend folder not found"
fi

# Check e2e
if [ -d "e2e" ]; then
    echo "  ✅ E2E folder exists"
else
    echo "  ⚠️  E2E folder not found (optional)"
fi

echo ""
echo "✓ Checking environment files..."

if [ -f "Backend/.env" ]; then
    echo "  ✅ Backend/.env exists"
else
    if [ -f "Backend/.env.example" ]; then
        echo "  ⚠️  Backend/.env not found, copy from .env.example"
    else
        echo "  ❌ Backend/.env.example not found"
    fi
fi

echo ""
echo "======================================"
echo "Setup Instructions:"
echo "======================================"
echo ""
echo "1. Install Backend Dependencies:"
echo "   cd Backend && npm install"
echo ""
echo "2. Install Frontend Dependencies:"
echo "   cd Frontend && npm install"
echo ""
echo "3. Configure Backend Environment:"
echo "   cp Backend/.env.example Backend/.env"
echo "   # Edit .env with your MongoDB URI, Stripe keys, etc."
echo ""
echo "4. Start Backend Server:"
echo "   cd Backend && npm run dev"
echo "   (Server will run on http://localhost:8000)"
echo ""
echo "5. Start Frontend Development Server:"
echo "   cd Frontend && npm run dev"
echo "   (App will open at http://localhost:5173)"
echo ""
echo "6. (Optional) Seed Database:"
echo "   cd Backend && npm run seed"
echo ""
echo "======================================"
echo "✓ Setup check complete!"
echo "======================================"
