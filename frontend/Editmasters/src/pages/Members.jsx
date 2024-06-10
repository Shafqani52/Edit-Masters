import React, { useState, useEffect } from 'react';
import { NavHeader } from '../components/navBar';
import { Switch, Table, Flex, Layout, theme, Typography, Button, Modal, Form, Input, Spin, Alert, Select } from 'antd';
import usersData from '../hooks/usersData';
const { Content } = Layout;

const Members = () => {
  const [fixedTop, setFixedTop] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [memberToView, setMemberToView] = useState(false);
  const { membersInfo, getAllMembers, handleUserStatus, updateUserRole, deleteMember, error, loading } = usersData();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    getAllMembers();
  }, []);

  const columns = [
    {
      title: 'Username',
      width: 250,
      dataIndex: 'username',
      key: 'username',
      fixed: 'left',
    },
    {
      title: 'Email',
      width: 100,
      dataIndex: 'email',
      key: 'email',
      fixed: 'left',
    },
    {
      title: 'Role',
      width: 100,
      dataIndex: 'role',
      key: 'role',
      fixed: 'left',
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 250,
      render: (text, record) => (
        <Flex gap="small">
            <Button type="primary" size="medium" onClick={() => viewMemberModal(record)}>Edit</Button>
            { record.active ? 
                <Button
                    type="primary"
                    size="medium"
                    onClick={() => handleUserStatus(record)}
                >
                    Activate
                </Button> : 
                <Button
                    type="primary"
                    size="medium"
                    danger
                    onClick={() => handleUserStatus(record)}
                >
                    Deactivate
                </Button>
            }
          <Button type="primary" danger size="medium" onClick={() => deleteMember(record)}>Delete</Button>
        </Flex>
      ),
    },
  ];

  const viewMemberModal = (file) => {
    setMemberToView(file);
    setMemberModalVisible(true);
  };

  const closeModal = () => {
    setMemberModalVisible(false);
  };

  return (
    <Flex className="main-content">
      <Flex vertical>
        <NavHeader tab="members" pageTitle="Members" />
      </Flex>
      <Flex flex={1}>
        <Content
          style={{
            padding: 30,
            minHeight: 280,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {membersInfo.length ? (
            <Table
              columns={columns}
              dataSource={membersInfo}
              scroll={{
                x: 1000,
              }}
              summary={() => (
                <Table.Summary fixed={fixedTop ? 'top' : 'bottom'}>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <Switch
                        checkedChildren="Fixed Top"
                        unCheckedChildren="Fixed Top"
                        checked={fixedTop}
                        onChange={() => {
                          setFixedTop(!fixedTop);
                        }}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={1}>
                      Scroll Context
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>Fix Right</Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
              sticky={{
                offsetHeader: 64,
              }}
            />
          ) : (
            <Typography.Title level={3}>No members found!</Typography.Title>
          )}
        </Content>
      </Flex>

       {/* Edit Modal */}
       <Modal
        className='userModal'
        title={memberToView.role === 'admin' ? 'Edit member' : 'Edit user'}
        open={memberModalVisible}
        onCancel={() => closeModal('edit')}
        footer={null}
        width="80%"
      >
        <Form className='userForm' layout='vertical' onFinish={updateUserRole} autoComplete='off' initialValues={{
          role: memberToView.role || 'user',
          user_id: memberToView.id,
        }}>
            <Form.Item label="Role" name="role" rules={[
                {
                    required: true,
                    message: "Please select role!"
                }
            ]}>
                <Select size='large' placeholder="Select role">
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="user_id">
              <Input type="hidden" />
            </Form.Item>
            { error && <Alert description={error} type="error" showIcon closable className='alert' />}
            <Form.Item>
                <Button 
                    type={`${ loading ? '' : 'primary'}`}
                    htmlType='submit' 
                    size='large' 
                    className='btn'>
                        { loading ? <Spin/> : 'Update' }
                </Button>
            </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default Members;