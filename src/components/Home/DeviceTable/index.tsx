'use client';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { faEdit, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { Tabs, Checkbox, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import Button from '@/components/elements/Button';
import { useStores } from '@/store/storeProvider';
import { DeviceStatus, DeviceTypes } from '@/utils/enum/device';
import {
  Device,
  DeviceType,
  TabHeader,
  TableDataType,
} from '@/utils/type/device.type';
import LabelBox from '@/components/elements/LabelBox';
import {
  DEFAULT_DEVICE_STATUS,
  DEFAULT_DEVICE_TYPE,
  deviceStatusLabels,
} from '../../../utils/constant/device';
import { getNow } from '@/utils/helpers/date';
import { DATETIME_FORMAT } from '@/utils/constant';
import serverService from '@/lib/server';

const UPDATE_PERIOD_TIME = 5 * 1000;

const convertTableItems = ({
  _id,
  name,
  serialNumber,
  status,
  type,
}: Device): TableDataType => ({ key: _id, name, serialNumber, status, type });

const DeviceTableContainer = () => {
  const {
    DeviceStore: {
      getDevicesByTypes,
      setDevices: storeSetDevices,
      onlineDevices,
      offlineDevices,
    },
  } = useStores();

  const [isRefetchData, setIsRefetchData] = useState(false);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatus[]>(
    DEFAULT_DEVICE_STATUS,
  );
  const [selectDeviceType, setSelectDeviceType] =
    useState<DeviceType>(DEFAULT_DEVICE_TYPE);
  const [devices, setDevices] = useState<TableDataType[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [updatedTime, setUpdatedTime] = useState('');

  const fetchDevices = async () => {
    if (isRefetchData) return;
    setIsRefetchData(true);
    setUpdatedTime(getNow(DATETIME_FORMAT.hhmmss));
    const { devices, isSuccess } = await serverService.getDevices();
    setIsRefetchData(false);
    if (!isSuccess) return;
    storeSetDevices(devices);
  };

  useEffect(() => {
    const filtedDevices = getDevicesByTypes(selectDeviceType, deviceStatuses);
    setDevices(filtedDevices.map(convertTableItems));
  }, [deviceStatuses, selectDeviceType]);

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    setDevices(
      getDevicesByTypes(selectDeviceType, deviceStatuses).map(
        convertTableItems,
      ),
    );
  }, [onlineDevices, offlineDevices]);

  const RefetchDataButton = () => {
    return (
      <Button
        {...{
          icon: faRotateRight,
          className: `refetch-button ${isRefetchData ? 'rotate-360' : ''}`,
          onClick: () => {
            fetchDevices();
          },
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
        <div className="buttons-container">
          <div className="device-status-select-buttons">
            <Checkbox.Group
              options={options}
              defaultValue={DEFAULT_DEVICE_STATUS}
              onChange={(values) => setDeviceStatuses(values)}
            />
          </div>
          <RefetchDataButton />
        </div>
        <div className="updated-time-container">
          <span className="time">
            <b>Updated at:</b> {updatedTime}
          </span>
        </div>
      </div>
    );
  };

  const DeviceTable = () => {
    return (
      <Table columns={columns} dataSource={devices} loading={isRefetchData} />
    );
  };

  const columns: TableColumnsType<TableDataType> = [
    { title: 'Device name', dataIndex: 'name', key: 'name', width: '30%' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
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
      width: '20%',
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
      width: '20%',
    },
    {
      width: '10%',
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
