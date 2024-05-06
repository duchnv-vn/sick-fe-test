'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useUser } from '@auth0/nextjs-auth0/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout, ConfigProvider } from 'antd';
import { BaseComponentProps } from '@/utils/type/component.type';
import { useStores } from '@/store/storeProvider';
import TopProgressBar from '@/components/TopProgressBar';
import LayoutHeader from '../LayoutHeader';
import DeviceModal from '@/components/Modal/DeviceModal';
import { Breakpoints, useScreenSize } from '@/utils/hook/screenSize';

import './index.scss';

const PhoneDrawer = dynamic(() => import('../PhoneDrawer'), {
  ssr: false,
});
const Sidebar = dynamic(() => import('../Sidebar'), {
  ssr: false,
});

const { Content } = Layout;
const queryClient = new QueryClient();

const MainLayout = ({ children }: BaseComponentProps) => {
  const { user } = useUser();

  const {
    CommonStore: {
      themeMode,
      setScreenWidth,
      setIsDisplaySidebar,
      isDisplaySidebar,
    },
    UserStore: { setUser },
  } = useStores();

  const { width } = useScreenSize();
  const [isUnderPhoneLgSize, setIsUnderPhoneLgSize] = useState(false);
  const [layoutFlexFlow, setLayoutFlexFlow] = useState<'row' | 'column'>('row');

  useEffect(() => {
    if (!user) return;
    setUser(user);
  }, [user]);

  useEffect(() => {
    if (!width) return;
    setScreenWidth(width);
    setIsDisplaySidebar(width > Breakpoints.tablet);
    setIsUnderPhoneLgSize(width <= Breakpoints['phone-lg']);

    if (width <= Breakpoints['tablet-sm']) {
      setLayoutFlexFlow('row');
    } else if (width <= Breakpoints['tablet']) {
      setLayoutFlexFlow('column');
    }
  }, [width]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <Layout
          style={{ minHeight: '100vh', flexFlow: layoutFlexFlow }}
          className={`main-layout theme-${themeMode} ${isUnderPhoneLgSize ? 'overflow-auto' : ''}`}
        >
          {isDisplaySidebar ? <Sidebar /> : <PhoneDrawer />}
          <Layout>
            <LayoutHeader />
            <TopProgressBar />
            <Content className="content-container">{children}</Content>
            <DeviceModal />
          </Layout>
        </Layout>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default observer(MainLayout);
