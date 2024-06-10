import React from 'react';
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import RegisterImage from '../assets/auth-image.jpg';
import useLogin from '../hooks/useLogin';

const Login = () => {
    const { loading, error, loginUser } = useLogin();
    const handleLogin = async (values) => {
        await loginUser(values)
    }
    
    return (
      <Card className='form-container login-form-container'>
        <Flex gap='large' style={{ alignItems: 'center' }}>
          <Flex vertical flex={1}>
              <Typography.Title level={3} strong className="title">Sign In</Typography.Title>
              <Typography.Text type="secondary" strong className="slogan">Unlock your world!</Typography.Text>
              <Form layout='vertical' onFinish={handleLogin} autoComplete='off' style={{ marginTop: 20 }}>
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
                  { error &&  <Alert description={error} type="error" showIcon closable className='alert' />}
                  <Form.Item>
                      <Button 
                          type={`${ loading ? '' : 'primary'}`} 
                          htmlType='submit' size='large' 
                          className='btn'>
                              { loading ? <Spin/> : 'Sign In' }
                      </Button>
                  </Form.Item>
                  <Form.Item>
                      <Flex gap='small'>
                        <Link to="/" style={{ flex: 1 }}>
                            <Button type="primary" size='large' className='btn'>Create an account</Button>
                        </Link>
                        <Link to="/forget-password" style={{ flex: 1 }}>
                            <Button type="primary" size='large' className='btn'>Forget password</Button>
                        </Link>
                      </Flex>
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

export default Login;