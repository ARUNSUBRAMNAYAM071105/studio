# CropSafe AI - AI-Powered Early Warning and Management of Crop Diseases

CropSafe AI is a comprehensive web application designed to assist farmers in managing crop health. It leverages AI to provide instant disease diagnosis, localized treatment advice, harvest yield predictions, and early warnings for potential disease outbreaks. The platform also fosters a community where farmers can share knowledge and access up-to-date market information.

## Features

- **Disease Detection**: Upload or take a photo of a crop to get an AI-powered diagnosis.
- **Localized Treatment Advice**: Receive tailored treatment recommendations based on the diagnosed disease, crop type, and region.
- **Harvest Predictor**: Get AI-powered predictions for harvest yield and potential market prices.
- **Remedy Cost Estimator**: Estimate the cost of various treatments in your local area.
- **Early Warning System**: Analyze environmental data to assess the risk of disease outbreaks.
- **Community Forum**: Connect with other farmers to ask questions and share insights.
- **Knowledge Hub**: Access a curated library of articles and guides on best farming practices.
- **Market Analysis**: View current market prices for various crops.
- **AI Chatbot Advisor**: Get instant answers to your farming questions from an AI assistant.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

First, clone the project repository to your local machine.

### 2. Install Dependencies

Navigate to the project directory and install the required npm packages:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a new file named `.env` in the root of your project directory. This file will hold your secret keys for various services.

Copy the following content into your `.env` file and replace the placeholder values with your actual credentials:

```env
# Google AI API Key for Genkit
# Get yours from Google AI Studio: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"


```

**Note:** The `GEMINI_API_KEY` is required for the AI features to work.

### 4. Run the Development Servers

This project requires two separate processes to be run concurrently in two different terminal windows:

**Terminal 1: Start the Genkit AI Flows**
This command starts the Genkit server, which powers all the AI functionalities.

```bash
npm run genkit:dev
```

**Terminal 2: Start the Next.js Frontend**
This command starts the Next.js development server for the user interface.

```bash
npm run dev
```

Once both servers are running, you can open your browser and navigate to `http://localhost:9002` to see the application.

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run genkit:dev`: Starts the Genkit AI flow server.
- `npm run build`: Creates a production build of the application.
- `npm run start`: Starts the production server (requires a build first).
- `npm run lint`: Lints the codebase for errors.
- `npm run typecheck`: Runs TypeScript to check for type errors.
