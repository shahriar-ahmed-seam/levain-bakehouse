# Local Development Setup Guide

## Prerequisites

Before running the Sweet Home Bakery application locally, ensure you have the following installed:

### Required Software
1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Python** (v3.9 or higher) - [Download](https://www.python.org/)
3. **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)

### Verify Installations
```bash
node --version
npm --version
python --version
mongosh --version
```

---

## MongoDB Setup

### Windows
**Option 1: Install as a Service**
```powershell
# Download MongoDB Community Server from mongodb.com
# Install and check if service is running
net start MongoDB
```

**Option 2: Run Manually**
```powershell
# Create data directory
mkdir C:\data\db
# Start MongoDB
mongod --dbpath C:\data\db
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
sudo systemctl status mongod
```

### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify
brew services list
```

---

## Quick Start

### Method 1: Use Startup Scripts (Recommended)

#### Windows (PowerShell)
```powershell
# Terminal 1 - Backend
cd backend
.\start-backend.ps1

# Terminal 2 - Frontend
cd frontend
.\start-frontend.ps1
```

#### Linux/macOS
```bash
# Make scripts executable
chmod +x backend/start-backend.sh
chmod +x frontend/start-frontend.sh

# Terminal 1 - Backend
cd backend
./start-backend.sh

# Terminal 2 - Frontend
cd frontend
./start-frontend.sh
```

### Method 2: Manual Setup

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

---

## Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## Configuration Files

### Backend Environment Variables (`backend/.env`)
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
```

### Frontend Environment Variables (`frontend/.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:8000
WDS_SOCKET_PORT=3000
ENABLE_HEALTH_CHECK=false
```

---

## Project Structure

```
Online Shop/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── models.py           # Pydantic models
│   ├── seed_data.py        # Database seed data
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables
│   ├── start-backend.ps1  # Windows startup script
│   └── start-backend.sh   # Linux/Mac startup script
├── frontend/
│   ├── src/               # React source code
│   ├── public/            # Static files
│   ├── package.json       # Node.js dependencies
│   ├── .env              # Environment variables
│   ├── start-frontend.ps1 # Windows startup script
│   └── start-frontend.sh  # Linux/Mac startup script
└── README.md             # This file
```

---

## Database

The application uses MongoDB with the following collections:
- **products** - Bakery products catalog
- **orders** - Customer orders
- **reviews** - Customer reviews

The database is automatically seeded with sample data on first startup.

---

## Technology Stack

### Frontend
- React 19.0.0
- Tailwind CSS
- Shadcn UI Components
- Axios for API calls
- React Router for navigation

### Backend
- FastAPI 0.110.1
- Motor (Async MongoDB driver)
- Pydantic for data validation
- Uvicorn ASGI server

---

## Common Issues

### Port Already in Use
**Frontend (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Backend (Port 8000):**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### MongoDB Connection Error
1. Ensure MongoDB is running: `mongosh` (should connect successfully)
2. Check the MONGO_URL in `backend/.env`
3. Verify MongoDB is listening on port 27017

### CORS Errors
- Ensure backend is running on port 8000
- Check CORS_ORIGINS in `backend/.env`
- Verify REACT_APP_BACKEND_URL in `frontend/.env`

### Module Not Found Errors
**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Development Commands

### Backend
```bash
# Run with auto-reload
uvicorn server:app --reload

# Run tests
pytest

# Format code
black .
isort .
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create new product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get single order
- `POST /api/orders` - Create new order

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create new review

Visit http://localhost:8000/docs for interactive API documentation.

---

## Stopping the Servers

Press `Ctrl+C` in each terminal window to stop the servers.

---

## Production Build

### Frontend
```bash
cd frontend
npm run build
# Build files will be in frontend/build/
```

### Backend
For production deployment, use a production ASGI server like Gunicorn with Uvicorn workers:
```bash
pip install gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## Support

For issues or questions, please check:
- Backend logs in the terminal running the backend server
- Frontend logs in the browser console
- MongoDB logs: `mongod --logpath /var/log/mongodb/mongod.log`

---

**Happy coding!** 🎂✨
