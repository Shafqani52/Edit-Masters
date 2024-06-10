import React from 'react';
import { NavHeader } from '../components/navBar';
import { Card, Flex, Typography, Layout, theme } from 'antd';
import { Link } from 'react-router-dom';
const { Content } = Layout;
const { Meta } = Card;
import { 
  RightOutlined
} from '@ant-design/icons';

const Dashboard = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Flex className="main-content">
      <Flex vertical>
        <NavHeader tab="dashboard" pageTitle="Home" />
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
          <div style={{maxWidth: 1000}}>
            <Typography.Title level={3} style={{margin: '0 0 30px'}}>Most Popular PDF Tools</Typography.Title>
            <Flex style={{ flexWrap: 'wrap', gap: '12px'}}>
              <Card
                hoverable
                style={{ width: 320, borderRadius: 4, borderColor: 'rgb(232, 232, 232)' }}
              >
                <Link to="/upload-pdf">
                  <Flex gap="middle" center>
                    <div className="icon-wrap">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" fill="#0FC0C5" rx="4"></rect><path fill="#fff" d="M4 8V4h15v4h-1V5h-6v14h4v1H7v-1h4V5H5v3z"></path></svg>
                    </div>
                    <Meta title="Upload PDF" style={{ display: "flex", alignItems: "center", flex: 1}}/>
                    <RightOutlined/>
                  </Flex>
                </Link>
              </Card>
              <Card
                hoverable
                style={{ width: 320, borderRadius: 4, borderColor: 'rgb(232, 232, 232)' }}
              >
                <Link to="/upload-image">
                  <Flex gap="middle" center>
                    <div className="icon-wrap">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" fill="#7961F2" rx="4"></rect><path fill="#fff" fillRule="evenodd" d="M6.858 18.832c1.466.524 3.089-.22 3.623-1.66L12 13.082l1.518 4.09c.535 1.44 2.157 2.184 3.624 1.66 1.466-.523 2.22-2.114 1.686-3.555-.535-1.44-2.157-2.184-3.623-1.66a2.8 2.8 0 0 0-1.523 1.295l-1.181-3.18L15 5l-.574.289a1.86 1.86 0 0 0-.912 1.014L12 10.382l-1.514-4.079a1.87 1.87 0 0 0-.912-1.014L9 5l2.499 6.731-1.18 3.18a2.8 2.8 0 0 0-1.524-1.295c-1.466-.523-3.088.22-3.623 1.661-.535 1.44.22 3.032 1.686 3.556Zm.323-.869c.978.349 2.059-.147 2.415-1.107a1.84 1.84 0 0 0-1.124-2.37c-.977-.35-2.059.146-2.415 1.107a1.84 1.84 0 0 0 1.124 2.37m9.638 0a1.84 1.84 0 0 0 1.124-2.37c-.356-.96-1.438-1.456-2.415-1.108a1.84 1.84 0 0 0-1.125 2.37c.357.961 1.438 1.457 2.416 1.108" clipRule="evenodd"></path></svg>
                    </div>
                    <Meta title="Upload IMAGE" style={{ display: "flex", alignItems: "center", flex: 1}}/>
                    <RightOutlined/>
                  </Flex>
                </Link>
              </Card>
              <Card
                hoverable
                style={{ width: 320, borderRadius: 4, borderColor: 'rgb(232, 232, 232)' }}
              >
                <Link to="/pdf-to-image">
                  <Flex gap="middle" center>
                    <div className="icon-wrap">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFB700" rx="4"></rect><path fill="#fff" fillRule="evenodd" d="m7 8 7 6.563 2.954-2.77L24 17.563V20l-6.954-5.641L14 17.214l-7-6.562-7 6.536v-2.625z" clipRule="evenodd"></path><path fill="#fff" d="M21 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"></path></svg>
                    </div>
                    <Meta title="PDF to IMAGE" style={{ display: "flex", alignItems: "center", flex: 1}}/>
                    <RightOutlined/>
                  </Flex>
                </Link>
              </Card>
              <Card
                hoverable
                style={{ width: 320, borderRadius: 4, borderColor: 'rgb(232, 232, 232)' }}
              >
                <Link to="/image-to-pdf">
                  <Flex gap="middle" center>
                    <div className="icon-wrap">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" fill="#3D99F5" rx="4"></rect><path fill="#fff" d="M17.316 19 21 5h-2.955L15.8 14.647h-.039L13.42 5H10.6l-2.38 9.53h-.04L6.013 5H3l3.627 14h3.051l2.284-9.53H12L14.322 19z"></path></svg>
                    </div>
                    <Meta title="IMAGE to PDF" style={{ display: "flex", alignItems: "center", flex: 1}}/>
                    <RightOutlined/>
                  </Flex>
                </Link>
              </Card>
            </Flex>
          </div>
        </Content>
      </Flex>
    </Flex>
  )
}

export default Dashboard;