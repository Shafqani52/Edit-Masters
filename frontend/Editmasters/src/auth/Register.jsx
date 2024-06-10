import React from 'react';
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import RegisterImage from '../assets/auth-image.jpg'
import useSignUp from '../hooks/useSignup';

const Register = () => {
    const { loading, error, registerUser } = useSignUp();
    const handleRegister = (values) => {
        registerUser(values)
    }
    return (
        <Card className='form-container'>
          <Flex gap='large'>
            <Flex vertical flex={1}>
                <Typography.Title level={3} strong className="title">Create an account</Typography.Title>
                <Typography.Text type="secondary" strong className="slogan">Join for exclusive access!</Typography.Text>
                <Form layout='vertical' onFinish={handleRegister} autoComplete='off' style={{ marginTop: 10 }}>
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
                    <Form.Item label="Password" name="password" rules={[
                        {
                            required: true,
                            message: "Please input your password!"
                        }
                    ]}>
                        <Input.Password size='large' placeholder="Enter your password"></Input.Password>
                    </Form.Item>
                    <Form.Item label="Confirm Password" name="passwordConfirm" rules={[
                        {
                            required: true,
                            message: "Please confirm your password!"
                        }
                    ]}>
                        <Input.Password size='large' placeholder="Confirm your password"></Input.Password>
                    </Form.Item>
                    { error && <Alert description={error} type="error" showIcon closable className='alert' />}
                    <Form.Item>
                        <Button 
                            type={`${ loading ? '' : 'primary'}`}
                            htmlType='submit' size='large' 
                            className='btn'>
                                { loading ? <Spin/> : 'Create Account' }
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Link to="/login">
                            <Button type="primary" size='large' className='btn'>Sign In</Button>
                        </Link>
                    </Form.Item>
                </Form>
            </Flex>
            <Flex flex={1}>
                <img src={RegisterImage} alt="" className='auth-image'/>
            </Flex>
          </Flex>
        </Card>
      )
}

export default Register;