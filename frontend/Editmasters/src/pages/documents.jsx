import React, { useState, useEffect, useRef } from 'react';
import WebViewer from '@pdftron/webviewer';
import { NavHeader } from '../components/navBar';
import { Switch, Table, Flex, Layout, theme, Typography, Button, Modal, Spin } from 'antd';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import userProfile from '../hooks/userProfile';
import { fabric } from 'fabric';
import {
  EmailShareButton,
  EmailIcon,
  FacebookMessengerShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  FacebookMessengerIcon,
} from "react-share";
const { Content } = Layout;

const Documents = () => {
  const [fixedTop, setFixedTop] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [fileToView, setFileToView] = useState(null);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [pdfToEdit, setPdfToEdit] = useState(null);
  const [fileToShare, setFileToShare] = useState(null);
  const viewerRef = useRef(null);
  const { editor, onReady } = useFabricJSEditor();
  const { getUser, documents, deleteFile } = userProfile();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    getUser();

  }, []);

  const columns = [
    {
      title: 'File name',
      width: 250,
      dataIndex: 'originalname',
      key: 'originalname',
      fixed: 'left',
    },
    {
      title: 'Type',
      width: 100,
      dataIndex: 'mimetype',
      key: 'mimetype',
      fixed: 'left',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 150,
    },
    {
      title: 'Encoding',
      dataIndex: 'encoding',
      key: 'encoding',
      width: 150,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 250,
      render: (text, record) => (
        <Flex gap="small">
          <Button type="primary" size="medium" onClick={() => viewFile(record)}>View</Button>
          <Button type="primary" size="medium" onClick={() => editFile(record)}>Edit</Button>
          <Button type="primary" danger size="medium" onClick={() => deleteFile(record)}>Delete</Button>
          <Button type="primary" size="medium" onClick={() => shareFile(record)}>Share</Button>
        </Flex>
      ),
    },
  ];

  const uploadToDrive = async (file) => {
    // Authenticate with Google Drive API
    const auth = new google.auth.GoogleAuth({
      // Your OAuth client ID and client secret
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
      // Scopes for Google Drive API
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: 'ACCESS_TOKEN' }); // Access token from Google Sign-In

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Prepare file metadata
    const fileMetadata = {
      name: file.name,
      mimeType: file.type,
    };

    // Prepare file media
    const media = {
      mimeType: file.type,
      body: file,
    };

    try {
      // Upload file to Google Drive
      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      });

      console.log('File uploaded to Google Drive with ID:', response.data.id);
      // Handle success or update UI accordingly
      message.success('File uploaded successfully to Google Drive');
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error.message);
      // Handle error or show error message
      message.error('Failed to upload file to Google Drive');
    }
  };

  const viewFile = (file) => {
    setFileToView(file);
    setViewModalVisible(true);
  };

  const shareFile = (file) => {
    const fileUrl = file?.mimetype.startsWith('application/pdf') ? `http://localhost:3000/pdf/path/${encodeURIComponent(file.filename)}`:
    `http://localhost:3000/image/path/${encodeURIComponent(file.filename)}`;

    setFileToShare(fileUrl);
    setShareModalVisible(true);
  };

  const editFile = (file) => {
    if (file.mimetype.startsWith('image/')) {
      setImageToEdit(file);
      setImageModalVisible(true);
    } else {
      setPdfToEdit(file);
      setPdfModalVisible(true);
    }
  };

  const closeModal = (type) => {
    if (type === 'view') {
      setViewModalVisible(false);
    } else if (type === 'edit') {
      setImageModalVisible(false);
      setPdfModalVisible(false);
      const canvas = editor?.canvas;
      if (canvas) {
        canvas?.clear();
      }
    }else if(type === 'share') {
      setShareModalVisible(false);
    }
  };

  useEffect(() => {
    if (pdfModalVisible && pdfToEdit) {
      const editContainer = document.createElement('div');
      editContainer.style.height = '75vh';
      editContainer.style.width = '100%';
      viewerRef.current.appendChild(editContainer);

      const fileUrl = `http://localhost:3000/pdf/path/${pdfToEdit.filename}`;
      WebViewer(
        {
          path: '/lib',
          initialDoc: fileUrl,
        },
        editContainer
      ).then((instance) => {
        // PDFTron specific logic here if needed
      });

      return () => {
        viewerRef.current.removeChild(editContainer);
      };
    }
  }, [pdfModalVisible, pdfToEdit]);

  useEffect(() => {
    if (imageModalVisible && imageToEdit && imageToEdit.mimetype.startsWith('image/')) {
      const canvas = editor?.canvas;
      const imgElement = new Image();
      imgElement.crossOrigin = 'anonymous';
      imgElement.src = `http://localhost:3000/image/path/${imageToEdit.filename}`;
      imgElement.onload = () => {
        const imgInstance = new fabric.Image(imgElement);
        imgInstance.set({
          left: 50,
          top: 50,
          angle: 0,
          padding: 10,
          cornersize: 10,
          selectable: true,
          hasBorders: true,
          hasControls: true,
        });
        canvas?.setHeight(460);
        canvas?.add(imgInstance);
        canvas?.renderAll();
      };
    }
  }, [imageModalVisible, imageToEdit, editor]);

  const applyFilter = (filter, options = {}) => {
    const canvas = editor?.canvas;
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
      let appliedFilter;
      switch (filter) {
        case 'grayscale':
          appliedFilter = new fabric.Image.filters.Grayscale();
          break;
        case 'invert':
          appliedFilter = new fabric.Image.filters.Invert();
          break;
        case 'sepia':
          appliedFilter = new fabric.Image.filters.Sepia();
          break;
        case 'brightness':
          appliedFilter = new fabric.Image.filters.Brightness({ brightness: options.value || 0.05 });
          break;
        case 'contrast':
          appliedFilter = new fabric.Image.filters.Contrast({ contrast: options.value || 0.05 });
          break;
        case 'blur':
          appliedFilter = new fabric.Image.filters.Blur({ blur: options.value || 0.1 });
          break;
        case 'saturation':
          appliedFilter = new fabric.Image.filters.Saturation({ saturation: options.value || 0.1 });
          break;
        case 'noise':
          appliedFilter = new fabric.Image.filters.Noise({ noise: options.value || 100 });
          break;
        case 'pixelate':
          appliedFilter = new fabric.Image.filters.Pixelate({ blocksize: options.value || 4 });
          break;
        case 'sharpen':
          appliedFilter = new fabric.Image.filters.Convolute({
            matrix: [ 0, -1, 0, -1, 5, -1, 0, -1, 0 ]
          });
          break;
        case 'emboss':
          appliedFilter = new fabric.Image.filters.Convolute({
            matrix: [ 1, 1, 1, 1, 0.7, -1, -1, -1, -1 ]
          });
          break;
        case 'brownie':
          appliedFilter = new fabric.Image.filters.Brownie();
          break;
        case 'vintage':
          appliedFilter = new fabric.Image.filters.Vintage();
          break;
        case 'kodachrome':
          appliedFilter = new fabric.Image.filters.Kodachrome();
          break;
        case 'technicolor':
          appliedFilter = new fabric.Image.filters.Technicolor();
          break;
        case 'polaroid':
          appliedFilter = new fabric.Image.filters.Polaroid();
          break;
        // Add more filters as needed
        default:
          break;
      }
      if (appliedFilter) {
        activeObject.filters.push(appliedFilter);
        activeObject.applyFilters();
        canvas?.renderAll();
      }
    }
  };

  const revertImage = () => {
    const canvas = editor?.canvas;
    canvas?.clear();
    const imgElement = new Image();
    imgElement.src = `http://localhost:3000/image/path/${imageToEdit.filename}`;
    imgElement.onload = () => {
      const imgInstance = new fabric.Image(imgElement);
      imgInstance.set({
        left: 50,
        top: 50,
        angle: 0,
        padding: 10,
        cornersize: 10,
        selectable: true,
        hasBorders: true,
        hasControls: true,
      });
      canvas?.setHeight(460);
      canvas?.add(imgInstance);
      canvas?.renderAll();
    };
  };

  const downloadImage = () => {
    const canvas = editor?.canvas;
    const dataUrl = canvas?.toDataURL({
      format: 'png',
      quality: 1,
    });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'edited-image.png';
    link.click();
  };

  return (
    <Flex className="main-content">
      <Flex vertical>
        <NavHeader tab="documents" pageTitle="Documents" />
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
          {documents.length ? (
            <Table
              columns={columns}
              dataSource={documents}
              scroll={{
                x: 1000,
              }}
              summary={() => (
                <Table.Summary fixed={fixedTop ? 'top' : 'bottom'}>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <Switch
                        checkedChildren="Fixed Top"
                        unCheckedChildren="Fixed Top"
                        checked={fixedTop}
                        onChange={() => {
                          setFixedTop(!fixedTop);
                        }}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={2}>
                      Scroll Context
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={10}>Fix Right</Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
              sticky={{
                offsetHeader: 64,
              }}
            />
          ) : (
            <Typography.Title level={3}>Your document lists are empty!</Typography.Title>
          )}
        </Content>
      </Flex>

      {/* View Modal */}
      <Modal
        title={fileToView?.mimetype.startsWith('application/pdf') ? 'view pdf' : 'view image'}
        open={viewModalVisible}
        onCancel={() => closeModal('view')}
        footer={null}
        width="80%"
      >
        {fileToView && (
          fileToView?.mimetype.startsWith('application/pdf') ? (
            <iframe
              src={`http://localhost:3000/pdf/path/${fileToView.filename}`}
              style={{ width: '100%', height: '75vh', border: 'none' }}
            ></iframe>
          ) : (
            <img
              src={`http://localhost:3000/image/path/${fileToView.filename}`}
              style={{ width: '100%', height: '75vh', objectFit: 'contain' }}
              alt={fileToView.originalname}
            />
          )
        )}
      </Modal>

      
      {/* Edit PDF Modal */}
      <Modal
        title="Edit PDF"
        open={pdfModalVisible}
        onCancel={() => closeModal('edit')}
        footer={null}
        width="80%"
        afterClose={() => {
          // Cleanup WebViewer instance
          const viewerElement = viewerRef.current;
          if (viewerElement) {
            viewerElement.innerHTML = '';
          }
        }}
      >
        <div ref={viewerRef}></div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Image"
        open={imageModalVisible}
        onCancel={() => closeModal('edit')}
        footer={null}
        width="80%"
      >
        <Flex vertical gap="medium">
          <p>Note: To apply filter, first click on the image and then apply filter</p>
          <Flex gap="small" className='filter-grid'>
            <Button onClick={() => applyFilter('grayscale')}>Grayscale</Button>
            <Button onClick={() => applyFilter('invert')}>Invert</Button>
            <Button onClick={() => applyFilter('sepia')}>Sepia</Button>
            <Button onClick={() => applyFilter('brightness', { value: 0.1 })}>Brightness</Button>
            <Button onClick={() => applyFilter('contrast', { value: 0.1 })}>Contrast</Button>
            <Button onClick={() => applyFilter('blur', { value: 0.1 })}>Blur</Button>
            <Button onClick={() => applyFilter('saturation', { value: 0.1 })}>Saturation</Button>
            <Button onClick={() => applyFilter('noise', { value: 200 })}>Noise</Button>
            <Button onClick={() => applyFilter('pixelate', { value: 8 })}>Pixelate</Button>
            <Button onClick={() => applyFilter('sharpen')}>Sharpen</Button>
            <Button onClick={() => applyFilter('emboss')}>Emboss</Button>
            <Button onClick={() => applyFilter('brownie')}>Brownie</Button>
            <Button onClick={() => applyFilter('vintage')}>Vintage</Button>
            <Button onClick={() => applyFilter('kodachrome')}>Kodachrome</Button>
            <Button onClick={() => applyFilter('technicolor')}>Technicolor</Button>
            <Button onClick={() => applyFilter('polaroid')}>Polaroid</Button>
            <Button type="primary" onClick={revertImage}>Revert</Button>
          </Flex>
          <FabricJSCanvas className="canvas" onReady={onReady} style={{ height: '460px', width: '100%' }} />
          <Button type="primary" onClick={downloadImage}>Download Edited Image</Button>
        </Flex>
      </Modal>

      {/* Share Modal */}
      <Modal
        className='share-modal'
        title="Share File"
        open={shareModalVisible}
        onCancel={() => closeModal('share')}
        footer={null}
        width="80%"
      >
        {fileToShare && (
          <div>
            <p>Share your file to social media</p>
            <Flex gap="small" style={{justifyContent: 'center'}}>
              <WhatsappShareButton url={fileToShare}>
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
              <EmailShareButton url={fileToShare}>
                <EmailIcon size={32} round={true} />
              </EmailShareButton>
              <FacebookMessengerShareButton url={fileToShare}>
                <FacebookMessengerIcon size={32} round={true} />
              </FacebookMessengerShareButton>
              <TelegramShareButton url={fileToShare}>
                <TelegramIcon size={32} round={true} />
              </TelegramShareButton>
            </Flex>
          </div>
        )}
      </Modal>
    </Flex>
  );
};

export default Documents;