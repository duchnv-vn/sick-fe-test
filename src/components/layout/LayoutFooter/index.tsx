'use client';
import { observer } from 'mobx-react-lite';
import { Layout } from 'antd';

const { Footer } = Layout;

const LayoutFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      Device Management platform ©{new Date().getFullYear()} Created by Duc
      Huynh
    </Footer>
  );
};

export default observer(LayoutFooter);
