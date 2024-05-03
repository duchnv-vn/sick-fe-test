import { handleAuth, handleCallback, } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  callback: handleCallback((_req) => ({
    authorizationParams: {
      redirect_uri: `${process.env.APP_DOMAIN}/`,
      audience: `${process.env.AUTH0_AUDIENCE}/`,
      scope: 'read:current_user update:current_user_metadata',
    },
  })),
});
