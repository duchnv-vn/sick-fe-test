'use client';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useUser } from '@auth0/nextjs-auth0/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from 'antd';
import { BaseComponentProps } from '@/utils/type/component.type';
import Sidebar from '../Sidebar';
import LayoutHeader from '../LayoutHeader';
import LayoutFooter from '../LayoutFooter';
import { useStores } from '@/store/storeProvider';
import TopProgressBar from '@/components/TopProgressBar';

import './index.scss';

const { Content } = Layout;
const queryClient = new QueryClient();

const MainLayout = ({ children }: BaseComponentProps) => {
  const { user } = useUser();

  const {
    CommonStore: { themeMode },
    UserStore: { setUser },
  } = useStores();

  useEffect(() => {
    if (!user) return;
    setUser(user);
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout
        style={{ minHeight: '100vh' }}
        className={`main-layout theme-${themeMode}`}
      >
        <Sidebar />
        <Layout>
          <LayoutHeader />
          <TopProgressBar />
          <Content className="content-container">{children}</Content>
          <LayoutFooter />
        </Layout>
      </Layout>
    </QueryClientProvider>
  );
};

export default observer(MainLayout);
