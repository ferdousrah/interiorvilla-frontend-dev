import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sendEmailHandler from './api/send-email.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Add error handling for server startup
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(cors());
app.use(express.json());

// API route
app.post('/api/send-email', sendEmailHandler);

// Team members API endpoint
app.get('/api/team-members', (req, res) => {
  const teamData = {
    "docs": [
      {
        "id": 2,
        "name": "Nashiba Shahariar",
        "designation": "Head of Business",
        "licenseNumber": null,
        "photo": 16,
        "photoUrl": "https://cms.interiorvillabd.com/api/media/file/nashiba.jpeg?v=1755157615735",
        "updatedAt": "2025-08-14T07:46:59.862Z",
        "createdAt": "2025-08-14T07:46:59.861Z"
      },
      {
        "id": 1,
        "name": "Md Ashikur Rahman",
        "designation": "Founder & CEO",
        "licenseNumber": null,
        "photo": 15,
        "photoUrl": "https://cms.interiorvillabd.com/api/media/file/ashikur-rahman.jpeg?v=1755157308373",
        "updatedAt": "2025-08-14T07:41:55.124Z",
        "createdAt": "2025-08-14T07:41:55.124Z"
      }
    ],
    "hasNextPage": false,
    "hasPrevPage": false,
    "limit": 10,
    "nextPage": null,
    "page": 1,
    "pagingCounter": 1,
    "prevPage": null,
    "totalDocs": 2,
    "totalPages": 1
  };
  
  res.json(teamData);
});

// Serve static files from dist directory (for production)
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing (for production)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server successfully started on port ${PORT}`);
  console.log(`🌐 API endpoint available at: http://localhost:${PORT}/api/send-email`);
}).on('error', (error) => {
  console.error('❌ Server failed to start:', error);
  process.exit(1);
});