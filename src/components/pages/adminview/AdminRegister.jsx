import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Input, Typography, Button, Row, Col, Form, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../../../style/AdminRegister.css';
import AdminHeader from './admin_section/AdminHeader';

const { Content } = Layout;
const { Title } = Typography;

function AdminRegister() {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // 토큰 삭제
    navigate("/adminview/login"); // 로그인 페이지로 이동
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();

    // 업로드된 파일의 originFileObj에 접근
    const picturePhoto = values.picture_photo[0].originFileObj;
    const pictureFile = new File([picturePhoto], picturePhoto.name, { type: picturePhoto.type });
    const name = values.name;
    const artist = values.artist;
    const gallery = values.gallery;
    const startDate = formatDate(values.start_date);
    const endDate = formatDate(values.end_date);
    const customExplanation = values.explanation;
    const customQuestion = values.question;

    console.log(name);

    if (pictureFile) {
      formData.append('picture_photo', pictureFile);
    }
    formData.append('name', name);
    formData.append('artist', artist);
    formData.append('gallery', gallery);
    formData.append('end_date', endDate);
    formData.append('start_date', startDate);
    formData.append('custom_explanation', JSON.stringify(customExplanation));
    formData.append('custom_question', JSON.stringify(customQuestion));
    formData.append('custom_prompt', JSON.stringify('너는 "별이 빛나는 밤"을 그린 빈센트 반 고흐야. 너는 점잖고, 하오체를 사용하면서 말을 길게 하지 않아.'));

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/picture/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to submit form', errorData);
     }
      if (response.ok) {
        navigate('/adminview/list');
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Layout className="layout">
        <AdminHeader>
          <Button onClick={handleLogout} className="logout-link" style={{position:'relative', top: '17px' }}>로그아웃</Button>
         </AdminHeader> 
        <Content className="app-content">
          <Row gutter={32}>
            <Col span={12}>
              <Button className="back-button" onClick={() => navigate('/adminview/list')}>뒤로 가기</Button>
              <div layout="vertical" className="art-form">
                <Form.Item label="작품" name="picture_photo" valuePropName="fileList" getValueFromEvent={e => e.fileList}>
                  <Upload beforeUpload={() => false} listType="picture">
                    <Button icon={<UploadOutlined />}>파일 업로드</Button>
                  </Upload>
                </Form.Item>
                <Form.Item label="작품 이름" name="name">
                  <Input placeholder="작품 이름을 입력하세요" />
                </Form.Item>
                <Form.Item label="작가명" name="artist">
                  <Input placeholder="저자 이름을 입력하세요" />
                </Form.Item>
                <Form.Item label="갤러리" name="gallery">
                  <Input placeholder="전시 장소를 입력하세요" />
                </Form.Item>
                <Form.Item label="전시 시작일" name="start_date">
                  <Input placeholder="2023-04-05의 형태로 입력하세요" />
                </Form.Item>
                <Form.Item label="전시 마감일" name="end_date">
                  <Input placeholder="2023-04-05의 형태로 입력하세요" />
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <Title level={6}>Custom your AI</Title>
              <div layout="vertical">
                <Form.Item name="explanation">
                <div>관객에게 꼭 설명하고 싶은 정보는? - explanation</div>
                  <Input.TextArea rows={4} placeholder="ex. 이 작품을 제작하게 된 배경" />
                </Form.Item>
                <Form.Item name="question">
                  <br/>
                <div>"관객에게 이 질문은 꼭 물어보고 싶다! - question"</div>
                  <Input.TextArea rows={4} placeholder="ex. 제 작품을 당신의 삶과 연결지을 수 있나요?" />
                </Form.Item>
              </div>
              <Button type="primary" className="submit-button" htmlType="submit">등록</Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Form>
  );
}

export default AdminRegister;
