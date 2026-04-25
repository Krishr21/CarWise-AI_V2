<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CarWise-AI 🚗

CarWise-AI is an intelligent, live-search powered used car assistant. It uses the Google Gemini API with native **Google Search Grounding** to scour the web in real-time, fetching genuine, up-to-date car listings matching your exact criteria.

Instead of hallucinating fake listings, CarWise-AI provides real, clickable links to actual cars on major marketplaces, complete with AI-generated pros, cons, and summaries for each vehicle.

## Project Structure
This repository contains two main applications:
- **Web App**: A React + Vite web frontend located in the root directory.
- **Mobile App**: A cross-platform mobile app built with React Native and Expo located in the `/mobile` directory.

## Features

- **Live Web Search**: Uses Google Search Grounding to pull 100% genuine, verifiable used car listings.
- **Smart Analysis**: Automatically generates pros, cons, and summaries for each listing.
- **Cross-Platform**: Available as both a modern web app and a native mobile experience (iOS/Android).
- **Graceful Error Handling**: Intelligently handles missing data when scraping complex real-world listings.

## Run Locally (Web App)

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   Copy the example environment file and add your Gemini API Key.
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set `VITE_GEMINI_API_KEY` to your actual Google AI Studio key.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open the localhost link provided by Vite in your browser.

## Run Locally (Mobile App)

**Prerequisites:** Node.js, Expo CLI, iOS Simulator or Android Emulator (or Expo Go app on your physical device).

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the `mobile` directory and add your Gemini API Key.
   ```bash
   EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the Expo development server:
   ```bash
   npx expo start
   ```

5. Follow the terminal instructions to open the app in a simulator or on your physical device using the Expo Go app.

## Built With
- **Web Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Mobile Frontend**: React Native, Expo, Expo Router
- **AI**: `@google/genai` (Gemini Flash / Gemini Pro)
