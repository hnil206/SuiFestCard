export default function getAuthUrl() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: import.meta.env.VITE_TWITTER_CLIENT_ID!,
    redirect_uri: import.meta.env.VITE_TWITTER_REDIRECT_URI!,
    scope: 'tweet.write tweet.read users.read media.write offline.access',
    state: 'state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain',
  });
  return `https://x.com/i/oauth2/authorize?${params.toString()}`;
}
