# Email Classifier - MagicSlides Assignment

A full-stack web application that allows users to log in using Google OAuth, fetch their emails from Gmail, and classify them into different categories using OpenAI GPT-4o.

## Features

- **Google OAuth 2.0 Authentication**: Secure login using Google accounts with proper authorization code flow
- **Gmail Integration**: Fetch the last 15 emails from your Gmail inbox
- **AI-Powered Classification**: Classify emails into 6 categories:
  - Important: Personal or work-related emails requiring immediate attention
  - Promotions: Sales, discounts, and marketing campaigns
  - Social: Emails from social networks, friends, and family
  - Marketing: Marketing newsletters and notifications
  - Spam: Unwanted or unsolicited emails
  - General: Emails that don't fit other categories
- **Local Storage**: All data is stored locally in the browser (no database required)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Proper Authentication Flow**: Full OAuth 2.0 authorization code flow with token refresh

## Tech Stack

### Frontend
- React 19
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Express.js
- TypeScript
- OpenAI API
- Gmail API
- Google OAuth 2.0

## Prerequisites

Before you begin, ensure you have the following:

1. **Node.js** (v20 or higher)
2. **npm** or **yarn**
3. **Google Cloud Project** with:
   - Gmail API enabled
   - OAuth 2.0 credentials (Web application)
4. **OpenAI API Key** (GPT-4o access)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd magicslides-assignment
```

### 2. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Email Classifier"
3. Enable the Gmail API:
   - Go to APIs & Services > Library
   - Search for "Gmail API"
   - Click Enable
4. Configure OAuth consent screen:
   - Go to APIs & Services > OAuth consent screen
   - Choose "External" user type
   - Fill in app name, support email, and developer contact
   - Add scopes: `openid`, `email`, `profile`, `https://www.googleapis.com/auth/gmail.readonly`
   - Add test users: `theindianappguy@gmail.com` and your email
5. Create OAuth 2.0 credentials:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5173/callback` (development)
     - `http://localhost:5173` (development)
     - Your production URL when deploying
   - Copy your Client ID and Client Secret

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
# GOOGLE_CLIENT_ID=your_client_id
# GOOGLE_CLIENT_SECRET=your_client_secret
# GOOGLE_REDIRECT_URI=http://localhost:5173/callback
# PORT=5000
# FRONTEND_URL=http://localhost:5173

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
# VITE_GOOGLE_CLIENT_ID=your_client_id
# VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. **Open the Application**: Navigate to `http://localhost:5173`

2. **Enter OpenAI API Key**: 
   - Paste your OpenAI API key in the input field
   - The key is stored locally and never sent to the backend

3. **Login with Google**: 
   - Click the "Sign in with Google" button
   - You'll be redirected to Google's OAuth consent screen
   - Authorize the application to access your Gmail
   - You'll be redirected back to the app and logged in

4. **Fetch Emails**: 
   - Click "Fetch Last 5 Emails"
   - The app will retrieve your recent emails from Gmail

5. **Classify Emails**: 
   - Click "Classify Emails with AI"
   - OpenAI GPT-4o will classify each email into categories
   - View the classification results and statistics

6. **Logout**: 
   - Click the "Logout" button to clear your session and return to login

## API Endpoints

### Authentication
- `POST /api/auth/callback` - Exchange authorization code for access token
  - Body: `{ code: string }`
  - Response: `{ accessToken, refreshToken, idToken, userEmail, userId, expiresIn }`

- `POST /api/auth/refresh\` - Refresh access token using refresh token
  - Body: `{ refreshToken: string }`
  - Response: `{ accessToken, expiresIn }`

- `POST /api/auth/verify` - Verify token validity
  - Headers: `Authorization: Bearer <access_token>`
  - Response: `{ valid: boolean, userId, email, expiresIn }`

### Emails
- `GET /api/emails` - Fetch emails from Gmail
  - Headers: `Authorization: Bearer <access_token>`
  - Query: `limit=5` (optional)
  - Response: `{ emails: Email[] }`

### Classification
- `POST /api/classify` - Classify emails using OpenAI
  - Body: `{ emails: Email[], openaiKey: string }`
  - Response: `{ classifications: Classification[] }`

## Project Structure

```
magicslides-assignment/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── utils/
│   │   │   ├── oauth.ts
│   │   │   ├── email-parser.ts
│   │   │   └── classification-prompt.ts
│   │   └── routes/
│   │       ├── auth.ts
│   │       ├── emails.ts
│   │       └── classification.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── components/
│   │   │   ├── GoogleLoginButton.tsx
│   │   │   ├── OpenAIKeyInput.tsx
│   │   │   ├── EmailList.tsx
│   │   │   ├── EmailListItem.tsx
│   │   │   ├── EmailDetail.tsx
│   │   │   ├── ClassificationStats.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorAlert.tsx
│   │   │   └── SuccessAlert.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── utils/
│   │       ├── api.ts
│   │       ├── storage.ts
│   │       └── validators.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── package.json
├── README.md
├── QUICK_START.md
├── COMPLETE_SETUP_GUIDE.md
├── OAUTH_FLOW_EXPLAINED.md
├── TROUBLESHOOTING.md
├── IMPLEMENTATION_SUMMARY.md
└── FIXES_APPLIED.md
```

## Security Considerations

1. **API Keys**: 
   - OpenAI key is stored in localStorage and never sent to the backend
   - Google tokens are handled securely via OAuth 2.0 flow
   - Client secret is never exposed to frontend

2. **OAuth 2.0 Security**:
   - Authorization code is exchanged for tokens on the backend only
   - Access tokens are temporary and expire after ~1 hour
   - Refresh tokens are used to obtain new access tokens
   - HTTPS required in production

3. **CORS**: 
   - Backend is configured with CORS to accept requests from frontend only

4. **Environment Variables**: 
   - Sensitive credentials are stored in .env files
   - Never commit .env files to version control

## Performance Optimization

- Emails are cached in localStorage to avoid refetching
- Classifications are cached to prevent re-running the same analysis
- Batch processing of emails for efficient API usage
- Token refresh implemented for long-lived sessions

## Future Enhancements

- Add database support for persistent storage
- Implement email search and filtering
- Add custom classification categories
- Support for multiple email accounts
- Real-time email sync
- Advanced analytics and insights
- Webhook support for real-time notifications

## License

This project is created for the MagicSlides.app internship assignment.

## Contact

For questions or issues, please reach out to:
- Email: jobs@magicslides.app
- Twitter/LinkedIn: @theindianappguy

## Submission Checklist

- [x] Frontend: React + Vite + Tailwind CSS (no UI libraries)
- [x] Backend: Express with TypeScript
- [x] Google OAuth 2.0 authentication with proper authorization code flow
- [x] Gmail API integration with proper access tokens
- [x] OpenAI GPT-4o classification
- [x] Email classification into 6 categories
- [x] Local storage for emails and classifications
- [x] Responsive UI design using only Tailwind CSS
- [x] Error handling and validation
- [x] Comprehensive documentation
- [x] Code quality and best practices
- [x] Test user added (theindianappguy@gmail.com)
- [x] All bugs fixed (redirect, headers, authentication)
- [x] Access token sent in Authorization header
- [x] Proper logout with redirect to login

## Running the Application

### Development Mode

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Production Build

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Notes

- The application fetches the last 15 emails by default (configurable via the `limit` parameter)
- Classifications are performed using OpenAI GPT-4o with a temperature of 0.3 for consistent results
- All data is stored locally in the browser's localStorage
- The application does not require a database for basic functionality
- OAuth 2.0 authorization code flow is fully implemented for secure Gmail API access
- Access tokens are temporary and refresh tokens are used for long-lived sessions
- For production deployment, ensure HTTPS is enabled and update redirect URIs
