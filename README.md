# Summer School 2026 - IEEE Student Branch

A modern, futuristic website for the 5-day Technology Summer School organized by the IEEE Student Branch.

## 🚀 Features
- **Futuristic UI**: Dark theme with neon accents and smooth animations.
- **Event Highlights**: Showcasing robotics, AI, and innovation.
- **Integrated Registration**: Smooth user flow with automated verification.
- **Payment Gateway**: Integrated with Razorpay for secure payments.
- **Admin Dashboard**: Comprehensive management tool for participants.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Payments**: Razorpay SDK
- **Email**: Nodemailer

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rohnroy0/Summer_camp_website.git
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   SMTP_USER=your_email
   SMTP_PASS=your_email_password
   ADMIN_EMAIL=admin_email
   ADMIN_PASSWORD=admin_password
   ```

4. Run the server:
   ```bash
   node server.js
   ```

## 📄 License
This project is for educational purposes as part of the IEEE SB Summer School.
