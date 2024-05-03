import MainLayout from '@/components/layout/MainLayout';
import GeneralDataCollectionCards from '@/components/Home/GeneralDataCollectionCards';
import DeviceTableContainer from '@/components/Home/DeviceTable';

import './page.scss';

const Home = () => {
  return (
    <MainLayout>
      <main className="homepage">
        <GeneralDataCollectionCards />
        <DeviceTableContainer />
      </main>
    </MainLayout>
  );
};

export default Home;
