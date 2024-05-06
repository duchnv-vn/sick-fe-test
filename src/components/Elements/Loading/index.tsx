'use client';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = () => {
  return (
    <div className="loading absolute flex justify-center items-center bg-reverse-primary opacity-80">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
    </div>
  );
};

export default Loading;
