import React, { useState, useEffect } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Button, notification, Badge } from 'antd';

const Notifications = () => {
  const storedData = JSON.parse(localStorage.getItem('user_data'));
  const [latestPromotion, setLatestPromotion] = useState(null);
  const [hasViewedNotification, setHasViewedNotification] = useState(true);

  useEffect(() => {
    fetchLatestPromotion();
  }, []);

  const fetchLatestPromotion = async () => {
    try {
      const response = await fetch('http://localhost:3000/promotions/active', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedData.access_token}`
        }
      });

      const data = await response.json();
      if (data.statusCode !== 500) {
        setLatestPromotion(data);
        const lastPromotionId = parseInt(localStorage.getItem('lastPromotionId'));
        if (lastPromotionId !== data.id) {
          setHasViewedNotification(false);
        }
      }
    } catch (error) {
      console.error('Error fetching the latest promotion:', error);
    }
  };

  const openNotification = () => {
    notification.open({
      message: latestPromotion ? `${latestPromotion.title}` : '',
      description: latestPromotion ? `${latestPromotion.message}` : 'No promotions available',
    });
    setHasViewedNotification(true); 
    if (latestPromotion) {
      localStorage.setItem('lastPromotionId', latestPromotion.id);
    }
  };

  return (
    <Badge dot={!hasViewedNotification && !!latestPromotion} offset={[-10, 8]}>
      <Button type="text" icon={<BellOutlined />} onClick={openNotification} />
    </Badge>
  );
};

export default Notifications;