import { redirect } from 'next/navigation';
import { getSession } from '@auth0/nextjs-auth0';
import LoginCard from '@/components/auth/LoginCard';

import './page.scss';

const LoginPage = async () => {
  const session = await getSession();

  if (session?.user) {
    redirect(`${process.env.APP_DOMAIN}/`);
  }

  return (
    <main className="login-page">
      <LoginCard />
    </main>
  );
};

export default LoginPage;
