<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CarWise-AI 🚗

CarWise-AI is an intelligent, live-search powered used car assistant. It uses the Google Gemini API with native **Google Search Grounding** to scour the web in real-time, fetching genuine, up-to-date car listings matching your exact criteria.

Instead of hallucinating fake listings, CarWise-AI provides real, clickable links to actual cars on major marketplaces, complete with AI-generated pros, cons, and summaries for each vehicle.

## Features

- **Live Web Search**: Uses Google Search Grounding to pull 100% genuine, verifiable used car listings.
- **Smart Analysis**: Automatically generates pros, cons, and summaries for each listing.
- **Comparison Grid**: View and compare mileage, price, location, and sources side-by-side.
- **Graceful Error Handling**: Intelligently handles missing data when scraping complex real-world listings.

## Run Locally

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
   Open `.env.local` and set `GEMINI_API_KEY` to your actual Google AI Studio key.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Built With
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **AI**: `@google/genai` (Gemini 3 Flash Preview)
