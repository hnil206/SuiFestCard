import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import { TwitterApi } from 'twitter-api-v2';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// In-memory storage for uploaded images (in production, use cloud storage like AWS S3)
const uploadedImages = new Map();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://1td35nyksqqhwehzziwo0rr8ubzbh9rb42vci7u5dj3rqd0web.localhost:3000', // Your specific Walrus site
  /^http:\/\/.*\.localhost:3000$/, // Allow any subdomain on localhost:3000
  /^https:\/\/.*\.walrus\.site$/, // Future public Walrus portals
  /^http:\/\/.*\.walrus\.site$/, // Future public Walrus portals (http)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      // Check if origin matches any allowed origins or patterns
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === 'string') {
          return origin === allowedOrigin;
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Twitter OAuth client
const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
});

// Store for OAuth state (in production, use Redis or database)
const oauthStates = new Map();

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Twitter OAuth server is running' });
});

// Upload image for sharing
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageId = uuidv4();
    const imageData = {
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
      timestamp: Date.now(),
    };

    uploadedImages.set(imageId, imageData);

    // Clean up old images (older than 24 hours)
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (const [key, value] of uploadedImages.entries()) {
      if (value.timestamp < twentyFourHoursAgo) {
        uploadedImages.delete(key);
      }
    }

    // Return server's share URL instead of frontend URL
    const shareUrl = `${req.protocol}://${req.get('host')}/share/${imageId}`;

    res.json({
      success: true,
      shareUrl,
      imageId,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Serve uploaded image
app.get('/api/image/:imageId', (req, res) => {
  try {
    const { imageId } = req.params;
    const imageData = uploadedImages.get(imageId);

    if (!imageData) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', imageData.mimetype);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(imageData.buffer);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// Serve share page with proper meta tags for Twitter crawler
app.get('/share/:imageId', (req, res) => {
  try {
    const { imageId } = req.params;
    const imageData = uploadedImages.get(imageId);

    if (!imageData) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Image Not Found</title>
        </head>
        <body>
          <h1>Image Not Found</h1>
          <p>The requested image could not be found.</p>
        </body>
        </html>
      `);
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/api/image/${imageId}`;
    const shareUrl = `${req.protocol}://${req.get('host')}/share/${imageId}`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SuiFest</title>
        <meta name="description" content="Check out this amazing SuiFest! Create your own and join the community.">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="${shareUrl}">
        <meta property="og:title" content="SuiFest Card">
        <meta property="og:description" content="Check out this amazing SuiFest Card! Create your own and join the community.">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="${shareUrl}">
        <meta name="twitter:title" content="SuiFest">
        <meta name="twitter:description" content="Check out this amazing SuiFest! Create your own and join the community.">
        <meta name="twitter:image" content="${imageUrl}">
        
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            text-align: center;
            max-width: 500px;
            padding: 20px;
          }
          .card-image {
            max-width: 100%;
            border-radius: 16px;
            margin: 20px 0;
            box-shadow: 0 8px 32px rgba(255,255,255,0.1);
          }
          .cta-button {
            display: inline-block;
            background: #fff;
            color: #000;
            padding: 12px 24px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
            transition: background 0.2s;
          }
          .cta-button:hover {
            background: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>SuiFest</h1>
          <img src="${imageUrl}" alt="SuiFest" class="card-image">
          <p>Create your own SuiFest and join the community!</p>
          <a href="${process.env.FRONTEND_URL}" class="cta-button">Create Your Card</a>
        </div>
      </body>
      </html>
    `;

    res.set('Content-Type', 'text/html');
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(html);
  } catch (error) {
    console.error('Error serving share page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start Twitter OAuth flow
app.get('/auth/twitter', async (req, res) => {
  try {
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(process.env.REDIRECT_URI, {
      scope: ['tweet.read', 'users.read', 'offline.access'],
    });

    // Store the code verifier and state (in production, use session/database)
    oauthStates.set(state, { codeVerifier, timestamp: Date.now() });

    // Clean up old states (older than 10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    for (const [key, value] of oauthStates.entries()) {
      if (value.timestamp < tenMinutesAgo) {
        oauthStates.delete(key);
      }
    }

    res.json({ authUrl: url });
  } catch (error) {
    console.error('Error generating Twitter auth link:', error);
    res.status(500).json({ error: 'Failed to generate auth link' });
  }
});

// Handle Twitter OAuth callback
app.get('/auth/twitter/callback', async (req, res) => {
  const { code, state } = req.query;

  try {
    // Retrieve the stored code verifier
    const storedData = oauthStates.get(state);
    if (!storedData) {
      throw new Error('Invalid or expired state parameter');
    }

    const { codeVerifier } = storedData;
    oauthStates.delete(state); // Clean up

    // Exchange code for access token
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
    } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: process.env.REDIRECT_URI,
    });

    // Get user information
    const user = await loggedClient.v2.me({
      'user.fields': ['profile_image_url', 'public_metrics', 'verified'],
    });

    // In a real app, you'd store the tokens securely and create a session
    const userData = {
      id: user.data.id,
      username: user.data.username,
      name: user.data.name,
      profileImageUrl: user.data.profile_image_url,
      verified: user.data.verified,
      publicMetrics: user.data.public_metrics,
      accessToken, // In production, don't send this to frontend
      refreshToken, // In production, don't send this to frontend
    };

    // Redirect back to frontend with user data
    const frontendUrl = new URL(process.env.FRONTEND_URL);
    frontendUrl.searchParams.set('auth', 'success');
    frontendUrl.searchParams.set('user', btoa(JSON.stringify(userData)));

    res.redirect(frontendUrl.toString());
  } catch (error) {
    console.error('Twitter OAuth callback error:', error);

    // Redirect to frontend with error
    const frontendUrl = new URL(process.env.FRONTEND_URL);
    frontendUrl.searchParams.set('auth', 'error');
    frontendUrl.searchParams.set('message', error.message);

    res.redirect(frontendUrl.toString());
  }
});

// Get user profile (protected route)
app.get('/api/user/:userId', async (req, res) => {
  try {
    // In production, validate the user's token here
    const { userId } = req.params;

    const user = await twitterClient.v2.user(userId, {
      'user.fields': ['profile_image_url', 'public_metrics', 'verified'],
    });

    res.json(user.data);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Export for Vercel
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Twitter OAuth server running on http://localhost:${PORT}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`🔄 Redirect URI: ${process.env.REDIRECT_URI}`);
  });
}
