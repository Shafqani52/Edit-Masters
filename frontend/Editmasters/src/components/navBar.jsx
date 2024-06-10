import React, {  useState  } from 'react';
import {  Button, Flex, Layout, Menu, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';
import { userAuth } from "../contexts/authContext.jsx";
import Notifications from '../components/Notifications.jsx';
import { 
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FileOutlined,
    UserOutlined,
    LogoutOutlined,
    HomeOutlined,
    TeamOutlined,
    BellOutlined
} from '@ant-design/icons';
const { Header, Sider, Content } = Layout;

 export const NavHeader = ({ tab, pageTitle } = props) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { userData, logout } = userAuth();

  const handleLogout = async () => {
    await logout();
  }

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">Home</Link>
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Account</Link>
    },
    {
      key: 'documents',
      icon: <FileOutlined />,
      label: <Link to="/documents">Documents</Link>
    }
  ];

  if (userData.role === 'admin') {
    menuItems.push({
      key: 'users',
      icon: <TeamOutlined />,
      label: <Link to="/users">Users</Link>
    });
    menuItems.push({
      key: 'members',
      icon: <TeamOutlined />,
      label: <Link to="/members">Members</Link>
    });
    menuItems.push({
      key: 'promotion',
      icon: <BellOutlined />,
      label: <Link to="/promotion">Promotions</Link>
    });
  }

  return (
    <Layout className='NavBar'>
      <Sider trigger={null} collapsible collapsed={collapsed} className='sider'>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[tab]}
          items={menuItems}
        />
        <p className='powered-by'>powered by ayaz hassan</p>
      </Sider>
      <Layout>
        <Header
          className='main-header'
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              border: 0,
              outline: 'none'
            }}
          />
          <Typography.Title level={3} className='page-title'>{pageTitle}</Typography.Title>
          <Flex gap='small' style={{alignItems: "center"}}>
            <Notifications />
            <Button
              onClick={handleLogout}
              icon={<LogoutOutlined />}
              size="large"
            >
              Sign out
          </Button>
          </Flex>
        </Header>
      </Layout>
    </Layout>
  );
};
