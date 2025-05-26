# 📘 DayCache — Frontend

**DayCache** is an AI-powered diary app that lets you record, reflect, and rediscover your thoughts with ease. This repository contains the **React-based frontend** of the application, designed to interface with a FastAPI backend.

---

## 🌐 Live Demo

🔗 [DayCache](https://daycache-fe.vercel.app)

---

## ✨ Features

- 📝 **Rich Diary Entries** — Text editor with support for image and file uploads  
- 💡 **AI-Powered Day Summaries** — Generate smart summaries of each day  
- 💬 **Chat with Your Diary** — Converse with your past entries using AI  
- 🧠 **Smart Autocomplete** — Predictive typing to speed up journaling  
- 📅 **Calendar View** — Browse and access entries by date  
- 🔍 **Search & Filter** — Quickly find entries by keyword or time period  
- 🌙 **Dark Mode** — Theme toggle for day or night journaling  
- 🔐 **Authentication** — Secure login via backend API

---

## 🖥️ Tech Stack

- **Frontend**: React (Hooks, Context API)  
- **UI**: Tailwind CSS 
- **HTTP Client**: Axios  
- **Routing**: React Router  
- **State Management**: Context API  
- **AI Integration**: OpenAI API (via FastAPI)  
- **Authentication**: JWT via FastAPI  
- **Deployment**: Vercel

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vinayak-jaybhaye/daycache-fe
cd daycache-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.sample` to `.env` and edit as needed:

```bash
cp .env.sample .env
```

`.env` example:
```env
VITE_API_URL=http://localhost:8000
```

### 4. Start the development server

```bash
npm start
```

> ⚠️ Ensure the FastAPI backend is running and accessible at the specified API base URL.

---

## 📂 Project Structure

```
daycache-fe/
├── public/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Views and routes
│   ├── store/             # redux store
│   └── App.ts
├── .envsample
├── .env
├── package.json
└── README.md
```

<!--
---

## 🧪 Running Tests

```bash
npm test
```
-->
---

<!--
## 📷 Screenshots
-->
<!-- You can include visual previews of the interface here -->
<!--
![Screenshot](./screenshots/main-ui.png)
![AI Summary](./screenshots/ai-summary.png)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
-->

## 🙌 Contributing

We welcome contributions!

- Fork the repo  
- Create a feature branch  
- Submit a pull request

<!-- Please open an issue first to discuss major changes. -->

---

## 📫 Contact

- Email: [vinayakjaybhaye795@gmail.com](mailto:vinayakjaybhaye795@gmail.com)  
- Backend API: [DayCache FastAPI Backend](https://github.com/vinayak-jaybhaye/daycache-backend)

---

> _“DayCache helps you not just write your days, but understand them.”_