'use client';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { faEdit, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { Tabs, Checkbox, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import Button from '@/components/elements/Button';
import { useStores } from '@/store/storeProvider';
import { DeviceStatus, DeviceTypes } from '@/utils/enum/device';
import { Device } from '@/utils/type/device.type';
import LabelBox from '@/components/elements/LabelBox';

type DeviceType = `${DeviceTypes}` | 'ALL';
type TabHeader = {
  key: string;
  label: string;
  children: JSX.Element;
};
interface TableDataType {
  key: number;
  name: string;
  serialNumber: number;
  type: DeviceTypes;
  status: DeviceStatus;
}

const DEFAULT_DEVICE_STATUS = [0, 1];
const DEFAULT_DEVICE_TYPE = 'ALL';
const deviceStatusLabels = {
  0: 'Offline devices',
  1: 'Online devices',
} as Record<number, string>;

const convertTableItems = ({
  _id,
  name,
  serialNumber,
  status,
  type,
}: Device): TableDataType => ({ key: _id, name, serialNumber, status, type });

const DeviceTableContainer = () => {
  const {
    DeviceStore: { getDevicesByTypes },
  } = useStores();

  const [isRefetchData, setIsRefetchData] = useState(false);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatus[]>(
    DEFAULT_DEVICE_STATUS,
  );
  const [selectDeviceType, setSelectDeviceType] =
    useState<DeviceType>(DEFAULT_DEVICE_TYPE);
  const [devices, setDevices] = useState<TableDataType[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const filtedDevices = getDevicesByTypes(selectDeviceType, deviceStatuses);
    setDevices(filtedDevices.map((device) => convertTableItems(device)));
  }, [deviceStatuses, selectDeviceType]);

  useEffect(() => {
    setTimeout(() => {
      isRefetchData && setIsRefetchData(false);
    }, 1500);
  }, [isRefetchData]);

  const RefetchDataButton = () => {
    return (
      <Button
        {...{
          icon: faRotateRight,
          className: `refetch-button ${isRefetchData ? 'rotate-360' : ''}`,
          onClick: () => setIsRefetchData(true),
        }}
      />
    );
  };

  const ActionButtons = () => {
    const options = DEFAULT_DEVICE_STATUS.map((value) => ({
      label: deviceStatusLabels[value],
      value,
    }));
    return (
      <div className="action-buttons">
        <div className="device-status-select-buttons">
          <Checkbox.Group
            options={options}
            defaultValue={DEFAULT_DEVICE_STATUS}
            onChange={(values) => setDeviceStatuses(values)}
          />
        </div>
        <RefetchDataButton />
      </div>
    );
  };

  const DeviceTable = () => {
    return <Table columns={columns} dataSource={devices} />;
  };

  const columns: TableColumnsType<TableDataType> = [
    { title: 'Device name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, { status }: TableDataType) => (
        <LabelBox
          {...{
            name: DeviceStatus[status],
            className: `device-status-${status}`,
          }}
        />
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (_: any, { type }: TableDataType) => (
        <LabelBox
          {...{
            name: DeviceTypes[type],
            className: `device-type-label-box`,
          }}
        />
      ),
    },
    {
      title: 'Serial number',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      render: (_: any, { key }: TableDataType) => (
        <Button
          {...{
            icon: faEdit,
            onClick: () => setActiveId(key),
            className: 'edit-button',
          }}
        />
      ),
    },
  ];

  const tabHeaders = [
    {
      key: DEFAULT_DEVICE_TYPE,
      label: 'All devices',
    },
    {
      key: `${DeviceTypes.LAPTOP}`,
      label: 'Latop',
    },
    {
      key: `${DeviceTypes.PC}`,
      label: 'Desktop',
    },
    {
      key: `${DeviceTypes.MODEM}`,
      label: 'Modem',
    },
    {
      key: `${DeviceTypes.OTHER}`,
      label: 'Other devices',
    },
  ].map((header) => ({
    ...header,
    children: <DeviceTable />,
  })) as TabHeader[];

  return (
    <div className="device-table-container">
      <Tabs
        tabBarExtraContent={ActionButtons()}
        items={tabHeaders}
        onChange={(value) => setSelectDeviceType(value as DeviceType)}
      />
    </div>
  );
};

export default observer(DeviceTableContainer);
