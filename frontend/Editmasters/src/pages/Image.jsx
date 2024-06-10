import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavHeader } from '../components/navBar';
import { InboxOutlined } from '@ant-design/icons';
import { Card, Flex, Layout, message, Upload, theme } from 'antd';
const { Content } = Layout;
const { Dragger } = Upload;

const Image = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();

    const storedData = JSON.parse(localStorage.getItem('user_data'));
    const uploadUrl = `http://localhost:3000/users/upload/${storedData.user_id}`;

    const props = {
      name: 'file',
      multiple: false,
      accept: '.jpeg, .jpg, .png',
      action: uploadUrl,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${storedData.access_token}`,
      },
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
          navigate('/documents');
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
      },
    };
    
    return (
        <Flex className="main-content">
            <Flex vertical>
            <NavHeader tab="" pageTitle="Upload Image" />
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
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a png, jpeg and jpg files</p>
                        <p className="ant-upload-hint">
                            Support for a single. Strictly prohibited from uploading company data or other
                            banned files.
                        </p>
                    </Dragger>   
                </Content>
            </Flex>
        </Flex>
    )
}

export default Image