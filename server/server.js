import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { TwitterApi } from 'twitter-api-v2';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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
