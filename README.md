# find-doctor-webapp

Readme (Find Doctor Web Application)
Find Doctor Web Application
Graduate Project – Online Medical Appointment System
📖 Project Description
The
Find Doctor Web Application
is a digital healthcare platform that allows users to register, log in, and connect with licensed medical professionals based on hospital, specialization, availability, and other criteria.
Patients can register, book appointments (in-person or online), and provide feedback.
Admins can manage doctors, patients, and appointments.
Doctors can view dashboards with patient statistics, recent visits, and ratings.
✨ Features
Role-based access:
Admin, Doctor, Patient
Patient registration & profile management
Appointment booking (in-person & online)
Feedback system for doctors
Doctor dashboard (recent patients, consultations, demographics, ratings)
Stripe payment integration
Search & filter for doctors and appointments
🏗 Project Structure
find-doctor-webapp/├── backend/ (Spring Boot project)│ ├── src/main/java/...│ ├── pom.xml│ └── application.properties└── frontend/ (Next.js project) ├── pages/ ├── components/ ├── package.json └── next.config.js
⚙️
Prerequisites
Maven:
3.9.9
Java:
23.0.2
Node.js:
24.1.0
MySQL:
9.3.0
📦 Dependencies
Backend (Maven)
Spring Boot Starters: web, data-jpa, security, thymeleaf, validation, mail, actuator
MySQL Connector
Readme (Find Doctor Web Application) 1
Lombok
MapStruct (DTO mapping)
JWT (authentication)
Stripe Java SDK (payment processing)
SpringDoc OpenAPI (API documentation)
Frontend (npm)
Next.js, React, React DOM
Tailwind CSS, PostCSS
FullCalendar (calendar features)
Framer Motion, Sonner (animations & notifications)
Axios (API requests)
Stripe.js (payment)
React Hook Form (form handling)
Chart.js / Recharts (charts & visualizations)
🚀 Setup & Running
1. Backend1.
Configure database & secret keys in
application.properties
:
spring.datasource.url=jdbc:mysql://localhost:3306/appointment_dbspring.datasource.username=YOUR_DB_USERNAMEspring.datasource.password=YOUR_DB_PASSWORDjwt.secret=YOUR_SECRET_KEYjwt.expiration=86400000stripe.secret.key=YOUR_STRIPE_SECRET_KEYstripe.webhook.key=YOUR_STRIPE_WEBHOOK_KEY2.
Create test accounts for
Admin, Doctor, and Patient
.3.
Run backend:
cd backendmvn spring-boot:run4.
Stripe payment test:
stripe listen --forward-to localhost:8080/api/webhookstripe trigger payment_intent.succeeded
2. Frontend1.
Install dependencies:
cd frontendnpm install
Readme (Find Doctor Web Application) 2
2.
Run development server:
npm run dev3.
Open in browser:
http://localhost:3000
🔑 Test Credentials (for committee)
Role
Email
Password
Admin
admin@gmail.com
admin123
Doctor
doctor@gmail.com
doctor123
Patient
nitahun@gmail.com
nita123
Readme (Find Doctor Web Application) 3