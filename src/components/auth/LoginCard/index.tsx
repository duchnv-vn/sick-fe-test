'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/elements/Button';
import Image from '@/components/elements/Image';
import logo from '../../../assets/image/logo.png';

const LoginCard: React.FC = () => {
  const router = useRouter();

  return (
    <div className="login-card">
      <Image
        {...{
          src: logo,
          alt: 'Viet An services',
          width: 150,
          height: 100,
        }}
      />
      <Button
        {...{
          label: 'Click to login with Auth0',
          className: 'login-button',
          onClick: () => router.push('/api/auth/login'),
        }}
      />
    </div>
  );
};

export default LoginCard;
