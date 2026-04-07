# Dafal LLC - Cargo Transportation Web Application

A modern, high-conversion transportation and cargo logistics web application built with React.js, Tailwind CSS, and FastAPI.

## Project Structure

```
Dafal/
├── api/
│   └── main.py              # FastAPI backend with configurable port
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── data/            # Mock data
│   │   ├── App.jsx          # Main app router
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   └── tailwind.config.js   # Tailwind configuration
├── requirements.txt         # Python dependencies
└── .gitignore              # Git ignore file
```

## Company Information

- **Company Name:** Dafal LLC
- **Phone:** 8326499452
- **Email:** dafalllc@proton.me
- **Address:** 4500 Travis St Apt 5531, Houston, TX 77002

## Features

### Homepage
- Sticky navigation bar with smooth transitions
- Hero section with background image and CTAs
- Order tracking feature with live status updates
- Services section with hover animations
- Fleet section with truck images and availability
- Trust & security section with badges
- Testimonials with slider animation
- Contact section with form

### Customer Features
- Order tracking system (Try: DFL-001, DFL-002, DFL-003)
- Booking form with validation
- Real-time progress updates

### Admin Dashboard
- Dashboard overview with stats
- Orders management with status updates
- Fleet management with CRUD operations
- Customer management
- Messages & complaints handling
- Notifications system

## Tech Stack

- **Frontend:** React.js 18, Vite, Tailwind CSS, Framer Motion
- **Backend:** FastAPI (Python)
- **Icons:** Lucide React

## Getting Started

### Backend (FastAPI)

1. Navigate to the project directory:
   ```bash
   cd Dafal
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend (default port 8000):
   ```bash
   python api/main.py
   ```

   Or specify a custom port:
   ```bash
   python api/main.py --port 8080
   ```

4. The API will be available at `http://localhost:8000`

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The app will be available at `http://localhost:5173`

### Production Build

```bash
cd frontend
npm run build
```

## Design System

### Colors
- **Primary:** #0B3C5D (Deep Blue - Trust & Professionalism)
- **Secondary:** #FFFFFF (White - Clean & Clarity)
- **Accent:** #F97316 (Orange - Action/Conversion)

### Typography
- Font Family: Inter (Google Fonts)

## Admin Access

The admin dashboard is available at `/admin` route with:
- Dashboard overview
- Orders management
- Fleet management
- Customer management
- Messages handling
- Notifications

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check

## License

Proprietary - Dafal LLC