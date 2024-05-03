'use client';
import { observer } from 'mobx-react-lite';
import {
  faBoxesStacked,
  faTowerBroadcast,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import GeneralDataCard from '@/components/Home/DataCard';
import { useStores } from '@/store/storeProvider';

const GeneralDataCollectionCards: React.FC = () => {
  const {
    DeviceStore: {
      totalDeviceNumber,
      totalOfflineDeviceNumber,
      totalOnlineDeviceNumber,
    },
  } = useStores();

  return (
    <div className="general-data-collection-cards">
      <GeneralDataCard
        {...{
          title: 'TOTAL AVAILABLE DEVICE',
          number: totalDeviceNumber,
          icon: faBoxesStacked,
          className: 'total-device',
        }}
      />
      <GeneralDataCard
        {...{
          title: 'TOTAL ONLINE DEVICE',
          number: totalOnlineDeviceNumber,
          icon: faTowerBroadcast,
          className: 'online-device',
        }}
      />
      <GeneralDataCard
        {...{
          title: 'TOTAL OFFLINE DEVICE',
          number: totalOfflineDeviceNumber,
          icon: faPowerOff,
          className: 'offline-device',
        }}
      />
    </div>
  );
};

export default observer(GeneralDataCollectionCards);
