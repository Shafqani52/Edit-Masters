import React, { useState } from 'react';
import { NavHeader } from '../components/navBar';
import { Button, Layout, Flex, message, Upload, theme } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';

const { Content } = Layout;
const { Dragger } = Upload;

const ImageToPDF = () => {
  const [images, setImages] = useState([]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImages((prevImages) => [...prevImages, e.target.result]);
    };
    reader.readAsDataURL(file);
    message.success(`${file.name} uploaded successfully.`);
    return false;
  };

  const generatePDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (img.height * imgWidth) / img.width;
        if (index > 0) pdf.addPage();
        pdf.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
        if (index === images.length - 1) {
          pdf.save('images.pdf');
        }
      };
    });
  };

  return (
    <Flex className="main-content">
      <Flex vertical>
        <NavHeader tab="" pageTitle="IMAGE To PDF" />
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
              <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
                <Dragger
                  accept="image/*"
                  customRequest={({ file }) => handleUpload(file)}
                  showUploadList={false}
                  multiple
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag images to this area to upload</p>
                  <p className="ant-upload-hint">Support for single image file.</p>
                </Dragger>
                <div style={{ marginTop: 24 }}>
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`uploaded-${index}`}
                      style={{ width: '100px', margin: '10px' }}
                    />
                  ))}
                </div>
                { images.length ?
                  (
                    <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={generatePDF}
                    disabled={images.length === 0}
                  >
                    Download PDF
                  </Button>
                  ) 
                  : ""
                }
              </div>  
            </Content>
        </Flex>
    </Flex>
  );
};

export default ImageToPDF;
