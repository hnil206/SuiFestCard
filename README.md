# SuiFest Card Generator

Create your own SuiFest 2025 card and share it on social media!

## Features

- 🎨 Custom card templates
- 👤 Twitter login integration
- 📸 Profile picture upload
- 🚀 Share on X (Twitter) with Open Graph metadata
- 📱 Responsive design
- 🎯 Real-time preview

## Setup

### Frontend

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
```

3. Start the development server:

```bash
pnpm dev
```

### Backend

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
pnpm install
```

3. Create `.env` file in the server directory:

```env
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
REDIRECT_URI=http://localhost:3001/auth/twitter/callback
FRONTEND_URL=http://localhost:5173
```

4. Start the server:

```bash
pnpm dev
```

## Share on X Feature

The Share on X functionality works as follows:

1. **Image Capture**: When users click "Share on X", the app captures the current card as an image using html2canvas
2. **Image Upload**: The image is uploaded to the server and stored temporarily (24-hour cleanup)
3. **URL Generation**: A shareable URL is generated with the format `http://localhost:3001/share/{imageId}`
4. **Twitter Share Intent**: The app opens Twitter's share intent with the generated URL
5. **Twitter Crawler**: When the URL is shared, Twitter's crawler visits the server endpoint and sees the proper meta tags
6. **Image Display**: Twitter displays the card image in the tweet with proper Open Graph metadata

### How Twitter Crawling Works

The server serves a dedicated HTML page at `/share/{imageId}` that includes:

```html
<!-- Open Graph tags for Facebook/Twitter -->
<meta property="og:image" content="http://localhost:3001/api/image/{imageId}" />
<meta property="og:title" content="SuiFest 2025 Card" />
<meta property="og:description" content="Check out this amazing SuiFest 2025 card!" />

<!-- Twitter Card tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="http://localhost:3001/api/image/{imageId}" />
```

When Twitter crawls the URL, it fetches the image from `/api/image/{imageId}` and displays it in the tweet.

### API Endpoints

- `POST /api/upload-image` - Upload card image and get share URL
- `GET /api/image/:imageId` - Serve uploaded image
- `GET /share/:imageId` - Serve share page with meta tags for crawlers

## Technologies Used

- **Frontend**: React, TypeScript, Vite, TanStack Router, Tailwind CSS
- **Backend**: Node.js, Express, Multer
- **Authentication**: Twitter OAuth 2.0
- **Image Processing**: html2canvas
- **Deployment**: Vercel

## Testing the Share Feature

1. Create a card and go to the preview page
2. Click "Share on X" button
3. The image will be uploaded and a share URL generated
4. Twitter share intent will open with the URL
5. When shared, the tweet will show the card image

The share URL format will be: `http://localhost:3001/share/{unique-id}`
