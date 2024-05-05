'use client';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  faEdit,
  faPlus,
  faRotateRight,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Tabs, Checkbox, Table, Popconfirm } from 'antd';
import type { TableColumnsType } from 'antd';
import Button from '@/components/Elements/Button';
import { useStores } from '@/store/storeProvider';
import {
  DeviceStatus,
  DeviceTypeLabels,
  DeviceTypes,
} from '@/utils/enum/device';
import {
  Device,
  DeviceType,
  TabHeader,
  TableDataType,
} from '@/utils/type/device.type';
import LabelBox from '@/components/Elements/LabelBox';
import {
  DEFAULT_DEVICE_STATUS,
  DEFAULT_DEVICE_TYPE,
  deviceStatusLabels,
} from '../../../utils/constant/device';
import { getNow } from '@/utils/helpers/date';
import { DATETIME_FORMAT } from '@/utils/constant';
import serverService from '@/lib/server';
import { useQuery } from '@tanstack/react-query';
import { DeviceResponseMsg } from '@/utils/enum/message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UPDATE_PERIOD_TIME = 15 * 1000;
const REFETCH_DELAY_TIME = 1.5 * 1000;

const convertTableItems = ({
  _id,
  name,
  serialNumber,
  status,
  type,
}: Device): TableDataType => ({ key: _id, name, serialNumber, status, type });

const DeviceTableContainer: React.FC = () => {
  const {
    DeviceStore: {
      getDevicesByTypes,
      setDevices: storeSetDevices,
      onlineDevices,
      offlineDevices,
      setDeviceToEdit,
      removeDevice,
    },
    CommonStore: { displayMessage, setIsDeviceModalOpen },
  } = useStores();

  const [isAutoRefetch, setIsAutoRefetch] = useState(true);
  const [isManualRefetching, setIsManualRefetching] = useState(false);

  const { data, isLoading, refetch, isRefetching, isRefetchError } = useQuery({
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
  const [updatedTime, setUpdatedTime] = useState('');

  const deleteDevice = async (device: TableDataType) => {
    const { key, name, type, status } = device;
    const { isSuccess } = await serverService.deleteDevice(key);

    if (!isSuccess) {
      displayMessage({
        type: 'error',
        content: DeviceResponseMsg.DELETE_FAIL.replace('{name}', name),
      });
      return;
    }

    removeDevice(key, status, type);

    displayMessage({
      type: 'success',
      content: DeviceResponseMsg.DELETE_SUCCESS.replace('{name}', name),
    });
  };

  useEffect(() => {
    !isRefetching && setUpdatedTime(getNow(DATETIME_FORMAT.hhmmss));
  }, [isRefetching]);

  useEffect(() => {
    setTimeout(() => {
      isManualRefetching && setIsManualRefetching(false);
    }, REFETCH_DELAY_TIME);
  }, [isManualRefetching]);

  useEffect(() => {
    isRefetchError &&
      displayMessage({
        type: 'error',
        content: DeviceResponseMsg.FETCH_FAIL,
      });
  }, [isRefetchError]);

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
          checked={isAutoRefetch}
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

  const NewDeviceCreateButton = () => {
    return (
      <Button
        {...{
          label: 'Add device',
          icon: faPlus,
          iconPosition: 'left',
          className: 'new-device-create-button button-1',
          onClick: () => setIsDeviceModalOpen(true),
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
        <NewDeviceCreateButton />
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
      render: (_: any, device: TableDataType) => (
        <div className="device-row-action-buttons">
          <Button
            {...{
              icon: faEdit,
              onClick: () => {
                setDeviceToEdit(device.key);
                setIsDeviceModalOpen(true, false);
              },
              className: 'edit-button',
            }}
          />
          <Popconfirm
            placement="bottomRight"
            title={'Delete confirm box'}
            description={`Are you sure to delete device ${device.name}`}
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteDevice(device)}
            className="delete-button"
          >
            <FontAwesomeIcon icon={faTrash} className="icon" />
          </Popconfirm>
        </div>
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
      label: DeviceTypeLabels[DeviceTypes.LAPTOP],
    },
    {
      key: `${DeviceTypes.PC}`,
      label: DeviceTypeLabels[DeviceTypes.PC],
    },
    {
      key: `${DeviceTypes.MODEM}`,
      label: DeviceTypeLabels[DeviceTypes.MODEM],
    },
    {
      key: `${DeviceTypes.OTHER}`,
      label: DeviceTypeLabels[DeviceTypes.OTHER],
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
