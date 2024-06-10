import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { NavHeader } from '../components/navBar';
import { InboxOutlined } from '@ant-design/icons';
import domtoimage from 'dom-to-image';
import { Flex, Layout, message, Upload, theme, Button } from 'antd';
const { Content } = Layout;

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFToImage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [numPages, setNumPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onUpload = ({ file }) => {
    const pdfBlobUrl = URL.createObjectURL(file);
    setPdfUrl(pdfBlobUrl);
    message.success(`${file.name} uploaded successfully.`);
  };

  const saveAsImage = (pageIndex) => {
    const container = document.getElementById('pdf-container');
    domtoimage
      .toPng(container)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `page_${pageIndex + 1}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => console.error('Error converting to image:', error));
  };

  return (
    <Flex className="main-content">
      <Flex vertical>
        <NavHeader tab="" pageTitle="PDF To IMAGE" />
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
          <div>
            <Upload.Dragger
              multiple={false}
              showUploadList={false}
              customRequest={onUpload}
              accept="application/pdf"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single. Strictly prohibited from uploading company data or other banned files.
              </p>
            </Upload.Dragger>
            {pdfUrl && (
              <>
                <div id="pdf-container">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading="Loading PDF..."
                  >
                    {[...Array(numPages)].map((_, index) => (
                      <div key={`page_${index}`} id={`pdf-page-${index}`}>
                        <Page
                          pageNumber={index + 1}
                          width={600}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </div>
                    ))}
                  </Document>
                </div>
                <div className='download-btn'>
                  <Button type='primary' onClick={saveAsImage} style={{ margin: '10px 0' }}>
                    Download as Image
                  </Button>
                </div>
              </>
            )}
          </div>
        </Content>
      </Flex>
    </Flex>
  );
};

export default PDFToImage;