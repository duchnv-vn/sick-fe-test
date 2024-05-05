import { UserProvider } from '@auth0/nextjs-auth0/client';

type Props = {
  children: JSX.Element;
};

const Auth0ProviderWrapper: React.FC<Props> = ({ children }) => {
  return (
    <UserProvider {...{ loginUrl: `${process.env.APP_DOMAIN}/login` }}>
      {children}
    </UserProvider>
  );
};

export default Auth0ProviderWrapper;
