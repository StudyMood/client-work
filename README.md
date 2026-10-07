# 💼 Client Work & Demo Websites Repository

A centralized GitHub repository by **Abhishek Kumar ([StudyMood](https://github.com/StudyMood))** containing production-ready client websites, interactive demo pages, and web application showcases.

---

## 🌐 Live Demos

| Project Name | Category | Status | Live Demo Link |
| :--- | :--- | :---: | :--- |
| **Client Work Hub** | Portfolio / Showcase Hub | 🟢 Live | [Open Hub](https://studymood.github.io/client-work/) |
| **Ashish Home Classes** | EdTech / Coaching Website | 🟢 Live | [Open Website](https://studymood.github.io/client-work/ashish-home-classes/) |
| **Pushkal Singh Birthday Tribute** | Interactive Tribute App | 🟢 Live | [Open Tribute](https://studymood.github.io/pushkal-sir-birthday/) |
| **Arushi Gym Management** | Fitness / Gym Portal | 🟢 Live | [Open Website](https://studymood.github.io/client-work/gym-manage/) |

---

## 📁 Repository Structure

```plaintext
client-work/
│
├── index.html                 # 🌟 Central Showcase Portal (lists all client projects)
├── README.md                  # 📖 Repository Documentation & Directory
├── .gitignore                 # 🚫 Git Ignore Rules
│
└── ashish-home-classes/       # 🎓 Client 1: Ashish Home Classes (Home Tuition Demo)
    └── index.html             #    Complete standalone website with WhatsApp enquiry
├── gym-manage/                # 🏋️ Client 2: Arushi Gym Management System
    ├── index.html             #    Fitness club & gym booking portal
    ├── css/style.css          #    Modern gym styling & dark UI
    └── js/script.js           #    State management, booking engine & BMI calculator
```

---

## 🚀 Projects Overview

### 1. 🎓 [Ashish Home Classes](./ashish-home-classes/)
- **Target Audience:** Parents & Students (Class 1–12) in Gorakhpur, UP.
- **Features:**
  - Responsive landing page tailored for coaching & private home tuitions.
  - Class-wise course offerings (Class 1–5, 6–8, 9–10 CBSE/UP Board, 11–12 Science/Commerce/Arts).
  - Proven results & stats counters.
  - Direct WhatsApp Enquiry Integration (pre-filled inquiry message with name, class & query).
  - Floating WhatsApp quick-connect button.
- **Tech Stack:** HTML5, CSS3 (Modern Flexbox/Grid), Vanilla JavaScript, Font Awesome 6.

---

### 2. 🏋️ [Arushi Gym Management](./gym-manage/)
- **Target Audience:** Gym members, fitness enthusiasts & gym administrators.
- **Features:**
  - Dynamic Membership Pricing toggle (Monthly vs Yearly 20% discount).
  - Interactive Group Class Timetable (HIIT, Strength, Yoga, Cardio Spin).
  - Live Interactive BMI Calculator with visual health metrics and recommendations.
  - Member Portal Dashboard for booking history, active subscriptions, and receipt generator.
  - Admin Management Panel for package creation/deletion, revenue metrics, and booking status controls.
  - LocalStorage state persistence and interactive toast notifications.
- **Tech Stack:** HTML5, Modern CSS3 (Dark Theme + Glassmorphism), Vanilla JavaScript (ES6+), Font Awesome 6.

---

## ➕ How to Add a New Client Project

1. Create a new folder with the client's project name:
   ```bash
   mkdir new-client-project
   ```
2. Put the project files inside that directory:
   ```plaintext
   new-client-project/
   ├── index.html
   ├── style.css
   └── assets/
   ```
3. Add a project card in the root [`index.html`](./index.html) and update the table in [`README.md`](./README.md).
4. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add new-client-project"
   git push origin main
   ```
5. It will automatically be live on GitHub Pages at:
   `https://studymood.github.io/client-work/new-client-project/`

---

## 👨‍💻 Developer & Contact

- **Developer:** Abhishek Kumar ([@StudyMood](https://github.com/StudyMood))
- **Email:** [studymood9988@gmail.com](mailto:studymood9988@gmail.com)
- **GitHub:** [https://github.com/StudyMood](https://github.com/StudyMood)

---

*Crafted with dedication for delivering high-impact client web experiences.*
