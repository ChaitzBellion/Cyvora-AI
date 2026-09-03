# Cyvora AI

> An AI-powered technical copilot for cloud engineering, DevOps, Linux troubleshooting, automation, and developer workflows.

Cyvora AI is a full-stack AI platform designed to help engineers understand, troubleshoot, and solve real-world technical problems through conversational AI.

The platform combines **Google Gemini**, **Firebase Authentication**, **Cloud Firestore**, and a production-ready web application architecture to provide a persistent, authenticated AI workspace.

Instead of functioning as a simple AI chat interface, Cyvora AI is designed around the workflow of an engineer — allowing users to maintain conversations, switch between technical contexts, create reusable workflows, and preserve their work across sessions.

---

## 🚀 What is Cyvora AI?

Cyvora AI is an AI-powered technical assistant focused on areas such as:

- ☁️ Cloud computing
- 🐧 Linux administration
- 🔧 DevOps
- 🐳 Docker & containerization
- ☸️ Kubernetes
- 🔄 CI/CD pipelines
- 🏗️ Cloud architecture
- 🛠️ Infrastructure troubleshooting
- 📊 Technical analysis
- 🐍 Python automation
- 💻 Backend development
- 🔐 Security and production hardening

The goal is to provide engineers with an interactive environment where they can ask questions, investigate problems, build reusable workflows, and maintain persistent technical conversations.

---

# ✨ Key Features

## 🤖 AI Technical Copilot

Cyvora AI uses Google's Gemini models to provide conversational technical assistance.

Users can ask questions such as:

```text
Explain Google Cloud Run in detail.

How do I troubleshoot a Linux service that keeps restarting?

Explain this Dockerfile and identify potential issues.

How should I design a production architecture for a Node.js application?

How can I troubleshoot a failed CI/CD deployment?

The AI is configured with a technical engineering persona focused on practical explanations and problem solving.

💬 Persistent Conversations

Conversations are persisted using Cloud Firestore.

Each authenticated user has an isolated conversation space:

users/
 └── {uid}/
      └── conversations/
           └── {conversationId}/
                └── messages/
                     ├── {messageId}
                     ├── {messageId}
                     └── ...

This allows users to:

Create multiple conversations
Switch between conversations
Continue previous discussions
Refresh the browser without losing conversations
Maintain multi-turn technical context
🔐 Google Authentication

Cyvora AI uses Firebase Authentication with Google Sign-In.

The authentication flow ensures that users have an authenticated identity before accessing their private application data.

User-specific Firestore data is isolated using Firebase Security Rules.

🧠 Multi-Turn AI Context

Cyvora AI maintains conversational context when interacting with Gemini.

Recent conversation history is supplied to the AI so that follow-up questions can reference previous messages.

For example:

User:
Explain Cloud Run.

AI:
Cloud Run is a fully managed container platform...

User:
How would I deploy a Node.js application to it?

AI:
Based on the Cloud Run architecture we just discussed...

This makes the interaction more useful than isolated single-prompt requests.

⚙️ Custom AI Workflows

One of the core features of Cyvora AI is the ability to create reusable technical workflows.

Users can create workflows containing:

Workflow name
Category
Prompt template
System instructions
Temperature configuration
Output token limits
Metadata/tags

Example workflow:

Terraform GCP Hardener

A workflow can provide predefined instructions for repeatedly performing a specific technical task.

This allows Cyvora AI to evolve from a simple chatbot into a more structured AI engineering workspace.

🧩 Workflow Launcher

Users can launch configured workflows directly from the workspace.

A workflow can accept additional contextual information such as:

Infrastructure code
Configuration files
Error messages
Technical requirements
Architecture details

The workflow configuration is then passed to the backend AI orchestration layer.

🛡️ Security Architecture

Security was considered throughout the application architecture.

Gemini API Key Protection

The Gemini API key is never exposed to the frontend.

The architecture follows:

Browser
   │
   │ Firebase ID Token
   ▼
Cyvora Backend
   │
   │ Server-side Gemini API request
   ▼
Google Gemini

The browser communicates with the Cyvora backend rather than directly exposing the Gemini API key.

Firebase Authentication Verification

Requests to the AI backend include the authenticated Firebase ID token.

The backend verifies the token before processing the request.

Conceptually:

User
 │
 ▼
Firebase Authentication
 │
 ▼
Firebase ID Token
 │
 ▼
Cyvora API
 │
 ├── Verify token
 ├── Extract authenticated UID
 ├── Validate request
 └── Execute Gemini request

Unauthenticated or invalid requests are rejected.

🔒 Firestore Security

Firestore rules enforce user-level isolation.

The application follows the principle:

request.auth.uid == userId

Users cannot access another user's:

Conversations
Messages
Workflows
Knowledge
Settings

The repository includes the Firestore security rules used by the application.

🧹 Input Hardening

The backend validates and constrains incoming AI requests.

Examples include:

Maximum message length
Conversation history limits
Allowed message roles
Workflow instruction limits
Temperature bounds
Output token limits
Request validation

This helps prevent malformed requests and uncontrolled model parameters.

🏗️ Architecture

The application follows a full-stack architecture:

                    ┌─────────────────────┐
                    │      User Browser   │
                    │                     │
                    │ React + TypeScript  │
                    │ Vite + Tailwind CSS │
                    └──────────┬──────────┘
                               │
                     Firebase Authentication
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Cyvora Backend   │
                    │                     │
                    │ Express / Node.js   │
                    │                     │
                    │ /api/chat           │
                    │ /api/health         │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └─────────────┐
                 ▼                              ▼
        ┌─────────────────┐            ┌─────────────────┐
        │  Google Gemini  │            │ Cloud Firestore │
        │                 │            │                 │
        │ AI Generation   │            │ Conversations   │
        │ Multi-turn AI   │            │ Messages        │
        └─────────────────┘            │ Workflows       │
                                       │ User data       │
                                       └─────────────────┘
🛠️ Technology Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Backend
Node.js
Express
TypeScript
Google GenAI SDK
AI
Google Gemini
Authentication
Firebase Authentication
Google Sign-In
Database
Cloud Firestore
Deployment
Vercel / Google Cloud Run compatible production architecture
📁 Project Structure
cyvora-ai/
│
├── src/
│   ├── components/
│   │   └── workspace/
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── lib/
│   │   └── firebase.ts
│   │
│   ├── pages/
│   │   └── WorkflowsPage.tsx
│   │
│   ├── services/
│   │   ├── authService.ts
│   │   ├── firestoreService.ts
│   │   └── geminiService.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── App.tsx
│
├── server.ts
├── firestore.rules
├── firestore.indexes.json
├── firebase-blueprint.json
├── vite.config.ts
├── package.json
├── .env.example
└── README.md
🔄 Application Flow

When a user sends a message:

1. User enters a message
          ↓
2. Firebase authentication verifies identity
          ↓
3. Client obtains Firebase ID token
          ↓
4. Message is sent to /api/chat
          ↓
5. Backend verifies Firebase ID token
          ↓
6. Backend validates request
          ↓
7. Conversation context is prepared
          ↓
8. Gemini generates response
          ↓
9. User message is persisted in Firestore
          ↓
10. AI response is persisted in Firestore
          ↓
11. Response is returned to frontend
          ↓
12. Conversation UI is updated
💾 Data Model

Cyvora AI uses a user-scoped Firestore structure.

users/{uid}
Conversations
users/{uid}/conversations/{conversationId}

Example conceptual fields:

id
userId
title
snippet
category
messageCount
isPinned
isArchived
createdAt
updatedAt
Messages
users/{uid}/conversations/{conversationId}/messages/{messageId}

Messages contain the conversation content and relevant metadata.

Workflows
users/{uid}/workflows/{workflowId}

Custom workflows are stored independently for each authenticated user.

🔑 Environment Variables

Create a .env file based on .env.example.

Firebase client configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

These variables are used by the frontend Firebase SDK.

Server configuration
GEMINI_API_KEY=
GEMINI_MODEL=
PORT=3000

⚠️ Never commit .env or expose GEMINI_API_KEY in frontend code.

🚀 Local Development
1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd cyvora-ai
2. Install dependencies
npm install
3. Configure environment variables

Create:

.env

and populate the required Firebase and Gemini configuration.

4. Start development server
npm run dev

The application should then be available through the local development URL displayed by Vite.

🏭 Production Build

Create a production build using:

npm run build

The build generates the frontend assets and production backend bundle.

The production backend is:

dist/server.cjs
▶️ Production Start

The production application can be started using:

npm start

which launches:

node dist/server.cjs

The server uses the PORT environment variable provided by the hosting platform.

☁️ Deployment

Cyvora AI is designed so that the same production application can be deployed to a container-based platform such as Google Cloud Run.

A typical production architecture is:

Internet
   │
   ▼
Cloud Run
   │
   ├── React static application
   │
   ├── Express backend
   │
   └── /api/chat
          │
          ▼
       Gemini API

Firebase Authentication and Firestore remain managed services.

🔐 Production Checklist

Before deploying:

 Configure Firebase Authentication
 Configure Google Sign-In
 Configure Firestore
 Deploy Firestore security rules
 Configure Gemini API credentials
 Verify Gemini API key is server-side only
 Configure Firebase authorized domains
 Configure production environment variables
 Run TypeScript validation
 Run production build
 Test /api/health
 Test authentication
 Test conversation persistence
 Test AI generation
 Test workflow creation
 Test workflow execution
🧪 Functional Testing

Cyvora AI has been tested against the following scenarios:

Authentication
Google Sign-In
Authentication hydration
Sign-out
Re-authentication
Conversations
Create conversation
Send messages
Persist messages
Refresh persistence
Switch conversations
Maintain conversation isolation
AI
Gemini generation
Multi-turn context
Technical explanations
Markdown responses
Code block rendering
Workflows
Create workflow
Edit workflow
Delete workflow
Enable/disable workflow
Persist workflow
Execute workflow
🛡️ Production Hardening

The backend includes several production-oriented protections:

Firebase ID token verification
User-scoped Firestore access
Input validation
Prompt size limits
Conversation history limits
Workflow parameter bounds
Security response headers
Server-side Gemini credentials
Sanitized diagnostic logging
SPA routing fallback
Cloud Run-compatible dynamic port binding
🎯 Project Goals

Cyvora AI was built with a broader objective than simply creating another AI chatbot.

The project explores how generative AI can be integrated into an engineering workflow while maintaining:

Persistent context
Authentication
Data isolation
Reusable AI workflows
Server-side AI orchestration
Production-oriented security
Cloud-native architecture

The long-term vision is to evolve Cyvora AI into a broader technical productivity platform for engineers.

🌱 Future Improvements

Potential future features include:

📚 Knowledge-base integration
📄 Document analysis
🧠 Retrieval-Augmented Generation (RAG)
🔍 Infrastructure diagnostics
🖥️ Cloud resource integrations
🔄 Automated DevOps workflows
📊 AI-powered monitoring analysis
🧩 More advanced workflow orchestration
👥 Team collaboration
📈 Usage analytics
🔐 Additional authentication providers
🤝 Contributing

Contributions, suggestions, and feedback are welcome.

If you find an issue or have an idea for improving Cyvora AI, please open an issue or submit a pull request.

📜 License

Add your preferred license here.

For example:

MIT License
👨‍💻 Author

Chinni Suman Chaitanya

Cloud Engineer | GCP | Linux | Automation | Generative AI

Cyvora AI is an independent project exploring practical applications of generative AI, cloud infrastructure, and developer productivity.

⭐ If you find Cyvora AI interesting

Consider starring the repository and sharing your feedback.

The project is continuously evolving toward a more capable AI-powered engineering workspace.
