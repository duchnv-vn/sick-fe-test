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
import { useQuery } from '@tanstack/react-query';

const UPDATE_PERIOD_TIME = 15 * 1000;
const REFETCH_DELAY_TIME = 1.5 * 1000;

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

  const [isAutoRefetch, setIsAutoRefetch] = useState(true);
  const [isManualRefetching, setIsManualRefetching] = useState(false);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['devices'],
    queryFn: serverService.getDevices,
    refetchInterval: !isManualRefetching && isAutoRefetch && UPDATE_PERIOD_TIME,
  });

  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatus[]>(
    DEFAULT_DEVICE_STATUS,
  );
  const [selectDeviceType, setSelectDeviceType] =
    useState<DeviceType>(DEFAULT_DEVICE_TYPE);
  const [devices, setDevices] = useState<TableDataType[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [updatedTime, setUpdatedTime] = useState('');

  useEffect(() => {
    !isRefetching && setUpdatedTime(getNow(DATETIME_FORMAT.hhmmss));
  }, [isRefetching]);

  useEffect(() => {
    setTimeout(() => {
      isManualRefetching && setIsManualRefetching(false);
    }, REFETCH_DELAY_TIME);
  }, [isManualRefetching]);

  useEffect(() => {
    const filtedDevices = getDevicesByTypes(selectDeviceType, deviceStatuses);
    setDevices(filtedDevices.map(convertTableItems));
  }, [deviceStatuses, selectDeviceType]);

  useEffect(() => {
    if (data) {
      const { devices, isSuccess } = data;
      isSuccess && storeSetDevices(devices);
    }
  }, [data]);

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
          className: `refetch-button ${isManualRefetching ? 'rotate-360' : ''}`,
          onClick: () => {
            refetch();
            setIsManualRefetching(true);
          },
        }}
      />
    );
  };

  const AutoRefetchCheckBox = () => {
    return (
      <div className="auto-refetch-checkbox-container">
        <Checkbox
          id="auto-refetch-checkbox"
          defaultChecked={true}
          onChange={(value) => setIsAutoRefetch(value.target.checked)}
        />
        <label htmlFor="auto-refetch-checkbox">Auto refetch data</label>
      </div>
    );
  };

  const UpdateTime = () => {
    return (
      <div className="updated-time-container">
        <span className="time">
          <b>Updated at:</b> {updatedTime}
        </span>
      </div>
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
          <AutoRefetchCheckBox />
          <RefetchDataButton />
        </div>
        <UpdateTime />
      </div>
    );
  };

  const DeviceTable = () => {
    return (
      <Table
        columns={columns}
        dataSource={devices}
        loading={isLoading || isManualRefetching}
      />
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
