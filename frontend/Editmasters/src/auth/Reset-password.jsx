import React, { useEffect, useState } from 'react';
import { Card, Typography, Form, Input, Button, Alert, Spin, Flex } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import RegisterImage from '../assets/auth-image.jpg';
import UseForgetPassword from '../hooks/forgetPassword';

const ResetPassword = () => {
    const { loading, error, isUserExist, checkUserExistence, checkingUser, resetPassword } = UseForgetPassword();
    const [queryParams, setQueryParams] = useState({ token: null, email: null });
    const location = useLocation();

    useEffect(() => {
        const { token, email } = getQueryParams(location.search);
        setQueryParams({ token, email });

        checkUserExistence({email});
    }, [location.search]);

    function getQueryParams(search) {
        const params = new URLSearchParams(search);
        const token = params.get('token');
        const email = params.get('user_id');
        
        return { token, email };
    }

    const handleFormSubmit = (values) => {
        const { email } = queryParams;
        resetPassword({ email, password: values.password });
    };

    return (
      <Card className='form-container login-form-container'>
        <Flex gap='large' style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            {checkingUser ? (
                <Spin size="large"/>
            ) : (
                isUserExist ? (
                    <>
                        <Flex vertical flex={1}>
                            <Typography.Title level={3} strong className="title">Reset Password</Typography.Title>
                            <Typography.Text type="secondary" strong className="slogan">Unlock your world!</Typography.Text>
                            <Form layout='vertical' autoComplete='off' style={{ marginTop: 20 }} onFinish={handleFormSubmit}>
                                <Form.Item label="Password" name="password" rules={[
                                    { required: true, message: "Please input your password!" }
                                ]}>
                                    <Input.Password size='large' placeholder="Enter your password" />
                                </Form.Item>
                                <Form.Item label="Confirm Password" name="passwordConfirm" rules={[
                                    { required: true, message: "Please confirm your password!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords do not match!'));
                                        },
                                    }),
                                ]}>
                                    <Input.Password size='large' placeholder="Confirm your password" />
                                </Form.Item>
                                {error && <Alert description={error} type="error" showIcon closable className='alert' />}
                                <Flex gap='small'>
                                    <Form.Item style={{ flex: 1 }}>
                                        <Button 
                                            type="primary" 
                                            htmlType='submit' 
                                            size='large' 
                                            className='btn'
                                            loading={loading}>
                                                {loading ? <Spin /> : 'Submit'}
                                        </Button>
                                    </Form.Item>
                                    <Form.Item style={{ flex: 1 }}>
                                        <Link to="/login">
                                            <Button type="primary" size='large' className='btn'>Back to Login</Button>
                                        </Link>
                                    </Form.Item>
                                </Flex>
                            </Form>
                        </Flex>
                        <Flex flex={1}>
                            <img src={RegisterImage} alt="Reset Password" className='auth-image'/>
                        </Flex>
                    </>
                ) : (
                    <Typography.Text type="secondary" strong className="slogan">User does not exist</Typography.Text>
                )
            )}
        </Flex>
      </Card>
    )
}

export default ResetPassword;