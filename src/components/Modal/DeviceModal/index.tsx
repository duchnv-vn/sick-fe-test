'use client';
import { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Select } from 'antd';
import { isEmpty, isInteger } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/store/storeProvider';
import { DeviceTypeLabels } from '@/utils/enum/device';
import { CreateDeviceBody, Device } from '@/utils/type/device.type';
import serverService from '@/lib/server';
import { DeviceResponseMsg } from '@/utils/enum/message';

import './index.scss';

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

const DeviceModal: React.FC = () => {
  const {
    CommonStore: {
      isDeviceModalOpen,
      isCreateModal,
      setIsDeviceModalOpen,
      displayMessage,
    },
    UserStore: { getUserId },
    DeviceStore: { addDevice, updateDevice, deviceToEdit, setDeviceToEdit },
  } = useStores();

  const [form] = Form.useForm<Omit<CreateDeviceBody, 'userId'>>();
  const {
    resetFields,
    getFieldsValue,
    validateFields,
    setFieldsValue,
    setFieldValue,
  } = form;

  const [confirmLoading, setConfirmLoading] = useState(false);

  const isEditModal = !isCreateModal && !isEmpty(deviceToEdit);

  const validateFormFields = async () => {
    try {
      await validateFields();
      return true;
    } catch (error) {
      return false;
    }
  };

  const baseSubmitAction = async () => {
    setConfirmLoading(true);
    const isValid = await validateFormFields();
    const userId = getUserId();
    const isError = !isValid || !isInteger(userId);

    if (isError) {
      displayMessage({ type: 'warning', content: 'Invalid form values' });
      setConfirmLoading(false);
    }

    return { isError, userId };
  };

  const handleEdit = async () => {
    const { isError } = await baseSubmitAction();
    if (isError) return;

    const values = getFieldsValue();
    const { device, isSuccess } = await serverService.editDevice(
      {
        ...values,
        status: Number(values.status),
      },
      deviceToEdit?._id as number,
    );

    if (!isSuccess) {
      displayMessage({
        type: 'error',
        content: DeviceResponseMsg.EDIT_FAIL.replace('{name}', values.name),
      });
      setConfirmLoading(false);
      return;
    }

    updateDevice(device as Device);

    displayMessage({
      type: 'success',
      content: DeviceResponseMsg.EDIT_SUCCESS.replace('{name}', values.name),
    });
    handleCloseModal();
  };

  const handleCreate = async () => {
    const { isError, userId } = await baseSubmitAction();
    if (isError) return;

    const values = getFieldsValue();
    const { device, isSuccess } = await serverService.createDevice({
      ...values,
      status: Number(values.status),
      userId: userId as number,
    });

    if (!isSuccess) {
      displayMessage({ type: 'error', content: DeviceResponseMsg.CREATE_FAIL });
      setConfirmLoading(false);
      return;
    }

    addDevice(device as Device);
    displayMessage({
      type: 'success',
      content: DeviceResponseMsg.CREATE_SUCCESS,
    });
    handleCloseModal();
  };

  const handleCloseModal = () => {
    resetFields();
    setIsDeviceModalOpen(false);
    setConfirmLoading(false);
    setDeviceToEdit();
  };

  useEffect(() => {
    isEditModal && setFieldsValue(deviceToEdit);
  }, [isEditModal]);

  return (
    <Modal
      title={`${isCreateModal ? 'New' : 'Edit'} Device Modal`}
      open={isDeviceModalOpen}
      onOk={isCreateModal ? handleCreate : handleEdit}
      okText={isCreateModal ? 'Add' : 'Update'}
      confirmLoading={confirmLoading}
      onCancel={handleCloseModal}
      className="device-modal"
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Item
          {...{
            label: 'Name',
            name: 'name',
            rules: [{ required: true }],
            className: 'form-item',
          }}
        >
          <Input />
        </Item>
        <Item
          {...{
            label: 'Serial number',
            name: 'serialNumber',
            rules: [{ required: true }],
            className: 'form-item',
          }}
        >
          <Input />
        </Item>
        <Item
          {...{
            label: 'Device type',
            name: 'type',
            rules: [{ required: true }],
            className: 'form-item',
          }}
        >
          <Select>
            {Object.values(DeviceTypeLabels)
              .filter((v) => isNaN(Number(v)))
              .map((label, index) => (
                <Option value={index} key={index}>
                  {label}
                </Option>
              ))}
          </Select>
        </Item>
        <Item
          {...{
            label: 'Online status',
            name: 'status',
            className: 'form-item',
            initialValue: true,
          }}
        >
          <Switch {...{ defaultChecked: true }} />
        </Item>
        <Item
          {...{
            label: 'Description',
            name: 'description',
            className: 'form-item',
          }}
        >
          <TextArea rows={4} />
        </Item>
      </Form>
    </Modal>
  );
};

export default observer(DeviceModal);
