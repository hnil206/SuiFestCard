import { TwitterClientId, TwitterRedirectUri } from '@/utils/constant';

export default function getAuthUrl() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TwitterClientId,
    redirect_uri: TwitterRedirectUri,
    scope: 'tweet.write tweet.read users.read media.write offline.access',
    state: 'state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain',
  });
  return `https://x.com/i/oauth2/authorize?${params.toString()}`;
}
