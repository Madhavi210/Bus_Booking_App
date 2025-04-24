# 🚌 Smart Bus Booking System

A complete solution for managing bus routes, scheduling, bookings, and payments with real-time validation and user safety in mind.

## ✨ Features

### 🔐 Admin Panel
- Create routes with unique IDs, distance, and stations
- Add buses with details and assign them to routes
- Set fare per km + tax, manage coupons
- Prevent overlapping schedules
- Get notified when a bus is 70%+ booked

### 👤 User Portal
- Search buses by route and date
- Book seats with real-time availability
- Gender-based seat restriction for safety
- Smart seat reuse between non-overlapping stations
- Dynamic fare calculation with tax
- Pay via Cash (free), Card, or UPI (+₹26 fee)

## 💻 Tech Stack
- **Frontend**: Angular, HTML, CSS, Bootstrap 
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB
- **APIs**: RESTful APIs built with Express  
- **Tools**: Postman (API testing), VS Code (Editor), Git & GitHub (Version Control), Nodemon  

## 📦 How to Run

```bash
git clone https://github.com/Madhavi210/Bus_Booking_App
cd Bus_Booking_App
npm install
npm start
