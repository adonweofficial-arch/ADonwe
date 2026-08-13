# ADonWe – Bihar's #1 Outdoor Advertising Network 🚀

**ADonWe** is a modern, high-performance web platform for Bihar's premier digital billboard and outdoor advertising company. From massive highway hoardings to metro station displays, residential complexes, and gym networks, ADonWe connects brands with millions of daily commuters across Patna, Muzaffarpur, Gaya, and beyond.

---

## 🌟 Key Features

- **Responsive & Modern UI**: Built with a sleek dark-mode theme, glassmorphism card aesthetics, subtle micro-animations, and dynamic particle effects.
- **Adaptive Grid Engine (`homepage-content.js`)**: Dynamically fetches active billboard locations and service offerings from Cloud Firestore with zero-lag fallback to local static data when offline.
- **Firebase Authentication & Security**: Staff-only admin authentication via Firebase Auth (Email/Password & Google Sign-In) with declarative Firestore security rules (`firestore.rules`).
- **Interactive Widgets**: Includes counter animations, card hover-tilt effects, smooth anchor scrolling, and a floating WhatsApp customer support widget.
- **SEO & Performance Optimized**: Pre-rendered meta tags, clean semantic HTML5 markup, lazy-loaded visual assets, and pre-connected Google Fonts.

---

## 📁 Project Structure

```text
d:/claude txt/
├── README.md                 # Project documentation
├── firebase.json             # Firebase Hosting configuration
├── firestore.rules           # Security rules for Cloud Firestore
├── package.json              # Project dependencies
└── ADonwe-main/              # Web application root
    ├── index.html            # Homepage with hero, services & locations preview
    ├── services.html         # Detailed advertising formats & specifications
    ├── locations.html        # Coverage map & city network breakdown
    ├── about.html            # Company vision, mission, and leadership team
    ├── contact.html          # Inquiries, brand partnerships & quote request forms
    ├── login.html            # Staff & admin login portal
    ├── admin.html            # Admin dashboard stub (protected route)
    ├── css/
    │   └── style.css         # Main design tokens, layout grids, animations & utilities
    ├── js/
    │   ├── main.js           # UI interactions, counters, tilt cards & WhatsApp widget
    │   ├── auth.js           # Firebase Auth & API backend communication helpers
    │   ├── firebase-config.js# Firebase Web SDK initialization & export
    │   └── homepage-content.js# Firestore fetch engine with static fallbacks
    └── images/               # Optimized web imagery for cities, services & team
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Firebase CLI (`npm install -g firebase-tools`)

### Running Locally

1. **Serve with local web server**:
   ```bash
   npx serve ADonwe-main -p 3000
   ```
   Or open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔥 Firebase Configuration

The app is configured using the Firebase Modular Web SDK v12.

1. **Config File (`ADonwe-main/js/firebase-config.js`)**:
   Update `firebaseConfig` credentials with your actual project keys from the [Firebase Console](https://console.firebase.google.com/):
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

2. **Admin Login Credentials**:
   The admin workflow requires two parts:
   - A Firebase Authentication user account.
   - A matching Firestore admin record in the `admins` collection.

   Setup steps:
   - Open **Firebase Console → Authentication → Users**.
   - Create a new email/password user or allow Google Sign-In for the admin email.
   - Open **Cloud Firestore → Data** and create the collection `admins`.
   - Add a document with the **Document ID equal to the admin email** (case-sensitive exact email).
     - Example: `admin@adonwe.in`
     - The document body can be empty or include fields such as:
       ```json
       {
         "addedAt": "2026-08-12T00:00:00Z",
         "role": "admin"
       }
       ```

   This repo uses the `admins` collection to authorize access to `admin.html` and the backend admin APIs.

3. **Local backend credentials**:
   - If you run the backend locally, download a Firebase service account JSON key from the Firebase Console.
   - Place it at `serviceAccountKey.json` in the repo root.
   - This file is already ignored by `.gitignore`.
   - Use the local admin test script:
     ```bash
     npm run admin:connect
     ```

4. **Deploying to Firebase Functions**:
   ```bash
   firebase deploy --only functions
   ```

---

## 📄 License & Attribution

© 2026 ADonWe Outdoor Pvt. Ltd. All rights reserved.
