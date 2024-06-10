import React from 'react';
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import RegisterImage from '../assets/auth-image.jpg';
import UseForgetPassword from '../hooks/forgetPassword';

const ForgetPassword = () => {
    const { loading, error, forgetUserPassword } = UseForgetPassword();
    const handleForgetPassword = async (values) => {
        await forgetUserPassword(values)
    }

    return (
      <Card className='form-container login-form-container'>
        <Flex gap='large' style={{ alignItems: 'center' }}>
          <Flex vertical flex={1}>
              <Typography.Title level={3} strong className="title">Forget Password</Typography.Title>
              <Typography.Text type="secondary" strong className="slogan">Unlock your world!</Typography.Text>
              <Form layout='vertical' onFinish={handleForgetPassword}  autoComplete='off' style={{ marginTop: 20 }}>
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
                  { error &&  <Alert description={error} type="error" showIcon closable className='alert' />}
                  <Flex gap='small'>
                    <Form.Item style={{ flex: 1 }}>
                        <Button 
                            type={`${ loading ? '' : 'primary'}`} 
                            htmlType='submit' size='large' 
                            className='btn'>
                                { loading ? <Spin/> : 'Submit' }
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
              <img src={RegisterImage} alt="" className='auth-image'/>
          </Flex>
        </Flex>
      </Card>
      )
}

export default ForgetPassword;