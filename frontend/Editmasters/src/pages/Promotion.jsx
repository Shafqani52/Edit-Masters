import React, { useState, useEffect } from 'react';
import { NavHeader } from '../components/navBar';
import { Layout, Form, Input, Button, Alert, Modal, Table, Space, message, Flex } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Content } = Layout;

const Promotion = () => {
  const storedData = JSON.parse(localStorage.getItem('user_data'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [form] = Form.useForm();

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/promotions/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedData.access_token}`
        }
      });
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreatePromotion = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/promotions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedData.access_token}`
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('Failed to create promotion');
      }
      fetchPromotions();
      setModalVisible(false);
      message.success("Promotion created successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPromotion = async (id, values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/promotions/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedData.access_token}`
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('Failed to update promotion');
      }
      fetchPromotions();
      setModalVisible(false);
      message.success("Promotion updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromotion = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/promotions/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedData.access_token}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete promotion');
      }
      fetchPromotions();
      message.success("Promotion deleted successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusPromotion = async (record) => {
    const updatedStatus = !record.isActive;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/promotions/activate/${record.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedData.access_token}`
        },
        body: JSON.stringify({ 
          isActive: updatedStatus
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update promotion status');
      }
      fetchPromotions();
      message.success(`Promotion ${updatedStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      width: 250,
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (isActive ? 'Active' : 'Disabled'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="medium"
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          {record.isActive ? 
            <Button
              type="primary"
              size="medium"
              danger
              onClick={() => handleStatusPromotion(record)}
            >
              Deactivate
            </Button> : 
            <Button
              type="primary"
              size="medium"
              onClick={() => handleStatusPromotion(record)}
            >
              Activate
            </Button>
          }
          <Button
            type="primary"
            danger
            size="medium"
            onClick={() => handleDeletePromotion(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const openCreateModal = () => {
    setCurrentPromotion(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (promotion) => {
    setCurrentPromotion(promotion);
    form.setFieldsValue(promotion);
    setModalVisible(true);
  };

  const handleModalSubmit = (values) => {
    if (currentPromotion) {
      handleEditPromotion(currentPromotion.id, values);
    } else {
      handleCreatePromotion(values);
    }
  };

  return (
    <Flex className="main-content">
      <Flex vertical>
        <NavHeader tab="promotion" pageTitle="Promotions" />
      </Flex>
      <Flex flex={1}>
        <Content
          style={{
            padding: 30,
            minHeight: 280,
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Table style={{ width: "100%" }} columns={columns} dataSource={promotions} rowKey="id" loading={loading} />
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openCreateModal} style={{ marginBottom: 20 }}>
            Create Promotion
          </Button>
          <Modal
            title={currentPromotion ? 'Edit Promotion' : 'Create Promotion'}
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            centered
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={handleModalSubmit}
              initialValues={{ title: '', message: '' }}
              autoComplete="off"
            >
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: 'Please input title!',
                  },
                ]}
              >
                <Input size="large" placeholder="Enter title" />
              </Form.Item>
              <Form.Item
                label="Message"
                name="message"
                rules={[
                  {
                    required: true,
                    message: 'Please input message!',
                  },
                ]}
              >
                <Input.TextArea rows={5} size="large" placeholder="Enter message" />
              </Form.Item>
              {error && <Alert description={error} type="error" showIcon closable />}
              <Form.Item style={{ marginTop: 20 }}>
                <Button type="primary" htmlType="submit" size="large" loading={loading}>
                  {currentPromotion ? 'Update Promotion' : 'Create Promotion'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Flex>
    </Flex>
  );
};

export default Promotion;