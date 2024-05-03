import MainLayout from '@/components/layout/MainLayout';

import './page.scss';
import GeneralDataCard from '@/components/layout/DataCard';
import {
  faBoxesStacked,
  faPowerOff,
  faTowerBroadcast,
} from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <MainLayout>
      <main className="homepage">
        <div className="general-data-collection-cards">
          <GeneralDataCard
            {...{
              title: 'TOTAL AVAILABLE DEVICE',
              number: 100,
              icon: faBoxesStacked,
              className: 'total-device',
            }}
          />
          <GeneralDataCard
            {...{
              title: 'TOTAL ONLINE DEVICE',
              number: 65,
              icon: faTowerBroadcast,
              className: 'online-device',
            }}
          />
          <GeneralDataCard
            {...{
              title: 'TOTAL OFFLINE DEVICE',
              number: 35,
              icon: faPowerOff,
              className: 'offline-device',
            }}
          />
        </div>
        <div className="device-table-container"></div>
      </main>
    </MainLayout>
  );
};

export default Home;
