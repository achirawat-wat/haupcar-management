# 🚗 Haupcar Fleet Management System

A modern, responsive, and full-stack web application designed for managing company vehicle data. Built as a job application assignment for Haupcar Co., Ltd.

<img width="1906" height="841" alt="image" src="https://github.com/user-attachments/assets/a38411eb-ce5f-429d-b65f-b253d495e64e" />

## ✨ Features

- **Dashboard Analytics**: Visual representation of fleet data including brand distribution (Pie chart) and car types (Bar chart) with drill-down navigation.
- **Car Management**: Full CRUD (Create, Read, Update, Delete) capabilities for vehicle records.
- **Mobile-First Design**: Responsive UI that switches from a data table on desktop to interactive cards on mobile devices.
- **Data Export**: Export fleet data instantly to CSV and PDF formats (with Thai language support).
- **Advanced Form Handling**: Image uploading via Supabase Storage, dynamic color picking, and quick-add owner functionality.
- **Robust Error Handling**: Prevents duplicate registration numbers and handles API failures gracefully.

## 🛠️ Technology Stack

**Frontend**
- React.js (Vite)
- Ant Design & Tailwind CSS for UI
- Recharts for data visualization
- jspdf & papaparse for exporting reports

**Backend**
- Node.js & Express.js
- Prisma ORM
- PostgreSQL (hosted on Supabase)

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v16+)
- PostgreSQL Database (or Supabase project)

### 1. Clone the repository
```bash
git clone https://github.com/achirawat-wat/haupcar-management.git
cd haupcar-management
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="your_postgresql_connection_string"
DIRECT_URL="your_postgresql_direct_connection_string"
PORT=3000
```
Generate the Prisma client, push the schema, and optionally seed the database with mock data:
```bash
npx prisma generate
npx prisma db push
node seed.js    # Run this to generate mock owners and 200+ cars
```
Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_SUPABASE_URL="your_supabase_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
VITE_API_URL="http://localhost:3000/api"
```
Start the development server:
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cars` | Fetch all cars |
| `POST` | `/api/cars` | Add a new car |
| `PUT` | `/api/cars/:id` | Update car details |
| `DELETE` | `/api/cars/:id` | Delete a car |
| `GET` | `/api/owners` | Fetch all car owners |
| `POST` | `/api/owners` | Add a new car owner |

## 👨‍💻 Author
**Achirawat** - Software Developer Candidate
