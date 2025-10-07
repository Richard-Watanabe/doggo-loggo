# Doggo Loggo

A full-stack web application for dog-owners who want to track/share their dog's daily activities!

I chose to build this project because I am a dog-owner myself, and wanted a convenient application to track my dog's daily activities, and be able to share them with my family-members and friends. With this application, there's no more need to check with your family/friends if your dog have been walked, fed, brushed, washed, etc., througout the day.

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- React 18
- React Router v6
- Bootstrap 5
- Moment.js
- Vite

### Backend / Cloud Services
- Firebase Authentication
- Cloud Firestore (Database)
- Firebase Storage (File Uploads)
- Firebase Hosting (Deployment + CDN)

## Live Demo

Try the application live at [https://doggo-loggo.web.app](https://doggo-loggo.web.app)

## Features

- User can create a log.
- User can view the current day’s logs.
- User can add a picture of their dog.
- User can sign up for an account.
- User can sign into their account.
- User can give a name to a dog.
- User can add a new dog.
- User can see a list of their dog.
- User can switch between dogs.
- User can delete logs.

## Preview

![Sep-26-2021 21-42-48](https://private-user-images.githubusercontent.com/85139853/498058279-25efbbf2-55f7-4b50-bb94-dbe8ed66a3ff.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTk3OTU1NjYsIm5iZiI6MTc1OTc5NTI2NiwicGF0aCI6Ii84NTEzOTg1My80OTgwNTgyNzktMjVlZmJiZjItNTVmNy00YjUwLWJiOTQtZGJlOGVkNjZhM2ZmLmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTEwMDclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUxMDA3VDAwMDEwNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWU2NzExOGM4MTIzYjVhZjc0NDNmMjliY2ZkMWNlMTRmNDhmZmE0YmQ5MzY2ZGZkYjJkMTBiOTQ5YTRkODg0NmImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.1iIJ7OG4z7T_aaFISncQ5dih36ziSfchGuKInvdtcDg)

## Getting Started

1. Clone the repository
    ```shell
    git clone git@github.com:Richard-Watanabe/doggo-loggo.git
    cd doggo-loggo
    ```

2. Install all dependencies
    ```shell
    npm install
    ```

3. Create a `.env` file
    ```shell
    cp .env.example .env
    ```

4. Add your Firebase configuration** to the `.env` file

    Example:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

5. Run the development server
    ```shell
    npm run dev
    ```

6. Open your browser and visit:
    ```
    http://localhost:5173
    ```

## Project Architecture

Doggo Loggo is a React Single Page Application powered by Firebase’s serverless backend.
Data flows securely between Firebase Auth, Firestore, and Storage, enabling real-time updates without traditional backend APIs.
The app is built and served through Vite, providing fast HMR, minimal build times, and optimized static output.
