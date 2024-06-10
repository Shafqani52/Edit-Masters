import React, { useEffect, useState } from 'react';
import { NavHeader } from '../components/navBar';
import { Card, Flex, Layout, Space, theme, Button, Modal, Form, Input, Alert } from 'antd';
import userProfile from '../hooks/userProfile';
const { Content } = Layout;

const Profile = () => {
    const { getUser, userData, updateUserBio, error, loading } = userProfile();
    const [userModalVisible, setUserModalVisible] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        getUser()
    }, []);

    const viewUserModal = () => {
        setUserModalVisible(true);
    };
    
    const closeModal = () => {
        setUserModalVisible(false);
    };

    return (
        <Flex className="main-content">
            <Flex vertical>
                <NavHeader tab="profile" pageTitle="Account" />
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
                    <Space direction="vertical" size="middle" style={{ display: 'flex', maxWidth: 1000, width: '100%' }}>
                        <Card style={{ borderRadius: 4, borderColor: 'rgb(232, 232, 232)' }} title="Your Profile" size="small">
                            <div className='user-info'>
                                <span className='key'>Name:</span>
                                <span className='value'>{userData.username}</span>
                            </div>
                            <div className='user-info'>
                                <span className='key'>Email:</span>
                                <span className='value'>{userData.email}</span>
                            </div>
                            <Button 
                                onClick={viewUserModal}
                                type={`${ loading ? '' : 'primary'}`}
                                htmlType='submit' size='large' 
                            className='edit-btn'>
                                    { loading ? <Spin/> : 'Edit Profile' }
                            </Button>
                        </Card>
                    </Space>
                </Content>
            </Flex>
            {/* Edit Modal */}
            <Modal
                className='userModal'
                title="Edit Profile"
                open={userModalVisible}
                onCancel={() => closeModal('edit')}
                footer={null}
                width="80%"
            >
                <Form className='userForm' layout='vertical' onFinish={updateUserBio} autoComplete='off' initialValues={{
                    username: userData.username,
                    email: userData.email,
                }}>
                    <Form.Item label="Full Name" name="username" rules={[
                        {
                            required: true,
                            message: "Please input your full name!"
                        }
                    ]}>
                        <Input size='large' placeholder="Enter your full name"></Input>
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[
                        {
                            required: true,
                            message: "Please input your email!"
                        },
                        {
                            type: 'email',
                            message: "The input is not valid Email!"
                        }
                    ]}>
                        <Input size='large' placeholder="Enter your email"></Input>
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
    )
}

export default Profile
