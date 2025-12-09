
# LunaCare - Holistic Women's Health Companion

LunaCare is a comprehensive, AI-powered progressive web application designed to empower women to track, understand, and improve their reproductive health. It combines cycle tracking, pregnancy monitoring, community support, and an educational hub into a single, intuitive interface.

## 🌟 Key Features

### 1. Core Health Tracking
- **Cycle Tracker**: Visualize menstrual cycles, predict ovulation, and log symptoms (flow, mood, physical).
- **Pregnancy Journey**: Track baby growth (size visualizations), kick counter, and trimester milestones.
- **Womb Health Index**: Get daily summaries of reproductive system status based on logged data.

### 2. AI & Diagnostics (Luna AI)
- **Symptom Analysis**: Chat with Luna AI (powered by Google Gemini) to analyze symptoms and get lifestyle advice.
- **Pattern Recognition**: Identify irregularities in cycles or mood patterns.
- **Multilingual AI**: The AI assistant responds in your selected language.

### 3. Community & Support
- **Discussion Forums**: Public boards for topics like PCOS, Fertility, and Postpartum care.
- **Real-time Chat**: Global group chat for instant community connection.
- **Expert Workshops**: Register for live sessions on health and wellness.

### 4. Marketplace & Education
- **Wellness Shop**: Browse and "purchase" (mock) hygiene, fertility, and pregnancy products.
- **Learn Hub**: Access curated articles and webinars on reproductive anatomy and nutrition.

### 5. Personalization & Settings
- **Health Reports**: Generate monthly summaries of symptoms and cycle data for doctor visits.
- **Dark Mode**: Fully supported system-wide dark theme.
- **Multilingual Support**: Interface and AI support for 9 languages.

## 🌍 Supported Languages
LunaCare is localized for a global audience:
- 🇺🇸 English (`en`)
- 🇪🇸 Spanish (`es`)
- 🇫🇷 French (`fr`)
- 🇩🇪 German (`de`)
- 🇧🇷 Portuguese (`pt`)
- 🇨🇳 Simplified Chinese (`zh`)
- 🇮🇳 Hindi (`hi`)
- 🇱🇰 Sinhala (`si`)
- 🇮🇳 Tamil (`ta`)

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API & LocalStorage persistence

## 🚀 Getting Started

1. **API Key Setup**:
   - The application requires a Google Gemini API key for the AI features (Symptom Checker).
   - The key is accessed via `process.env.API_KEY`.

2. **Installation**:
   - Clone the repository.
   - Run `npm install` to install dependencies.
   - Run `npm start` to launch the development server.

## 🔒 Privacy Note
This is a demo application. Data is stored locally in the browser's `localStorage` to simulate persistence. No personal health data is sent to external servers except for the text prompts sent to the Gemini API for analysis, which are processed according to Google's AI data policies.
