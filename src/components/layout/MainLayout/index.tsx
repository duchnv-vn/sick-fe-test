'use client';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Layout } from 'antd';
import { BaseComponentProps } from '@/utils/type/component.type';
import Sidebar from '../Sidebar';
import LayoutHeader from '../LayoutHeader';
import LayoutFooter from '../LayoutFooter';
import { useStores } from '@/store/storeProvider';
import TopProgressBar from '@/components/TopProgressBar';

import './index.scss';

const { Content } = Layout;

const MainLayout = ({ children }: BaseComponentProps) => {
  const { user } = useUser();

  const {
    CommonStore: { themeMode },
    UserStore: { setUser },
  } = useStores();

  useEffect(() => {
    user && setUser(user);
  }, [user]);

  return (
    <Layout
      style={{ minHeight: '100vh' }}
      className={`main-layout ${themeMode}`}
    >
      <Sidebar />
      <Layout>
        <LayoutHeader />
        <TopProgressBar />
        <Content className="content-container">{children}</Content>
        <LayoutFooter />
      </Layout>
    </Layout>
  );
};

export default observer(MainLayout);
