# Vento - Smart Event Management System 💨

Welcome to the **Vento** repository! Vento is a premium, modern, and sleek event management platform that bridges the gap between individuals planning extraordinary events and the high-quality vendors who make them happen.

## ✨ Features

- **Smart Vendor Discovery:** Easily find, filter, and compare vendors based on the location of your event. 
- **Automated Lifecycle Management:** Events and bookings are automatically tracked. Background schedulers automatically mark past events and bookings as completed.
- **Role-Based Accounts:** Distinct profiles and dynamic dashboards for both Event Planners (Users) and Service Providers (Vendors).
- **Premium User Interface:** A meticulously crafted, glassmorphic dark-mode interface built with bespoke CSS and high-quality Lucide React iconography.
- **Secure Authentication:** Robust JWT-based authentication system supporting user sessions and external social login flows.
- **Vendor Comparison Tool:** Side-by-side data visualization to help you make the best booking decisions faster.

## 💻 Tech Stack

### Frontend
- **Framework:** React.js powered by Vite
- **Styling:** Custom CSS with comprehensive CSS variable-based theming (light/dark mode capabilities)
- **Icons:** `lucide-react` for crisp, minimal, and scalable vector icons
- **State Management:** React Hooks and Context

### Backend
- **Framework:** Java + Spring Boot
- **Database Architecture:** Spring Data JPA / Hibernate (Relational Database)
- **Security:** Spring Security & JWT (JSON Web Tokens) with daily session timeouts
- **Automation:** Spring `@Scheduled` cron jobs for database cleanup and event lifecycle management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- Maven / Gradle
- Your preferred SQL Database (MySQL/PostgreSQL)

### Running the Backend (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your `application.properties` or `application.yml` with your database credentials.
3. Run the application:
   ```bash
   ./gradlew bootRun
   ```
   *(The server usually starts on `http://localhost:8080`)*

### Running the Frontend (Vite + React)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *(The Vite server usually starts on `http://localhost:5173`)*

## 🎨 Design Philosophy
Vento strips away bloated, "AI-generated" UI boilerplates in favor of a bespoke, editorial design. It utilizes beautiful typographic hierarchy, premium portrait photography, subtle gradient blurs, and minimal card borders to ensure the interface looks human-crafted and undeniably professional.

## 🤝 Contributing
Vento is an open-source project and I would love for you to contribute! Whether it's squashing bugs, improving the sleek UI, optimizing backend performance, or adding entirely new features, your help is welcome. 

### How to Contribute
1. **Fork** the repository
2. **Create** a new branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

Feel free to check our issues page for anything marked `good first issue` to get started. Let's build the smartest event management platform together!
