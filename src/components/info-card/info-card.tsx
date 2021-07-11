import { Avatar, Card, Col, Row } from 'antd';
import React from 'react';

import avatarJpg from '../../images/avatar.jpg';

export default () => (
  <Card style={{ width: 275 }}>
    <Row justify="center" align="middle" style={{ height: 60 }}>
      <Col>
        <Avatar size="large" src={avatarJpg} />
      </Col>
    </Row>
    <Row justify="center">
      <Col>银色飞行船</Col>
    </Row>
    <Row justify="space-around" style={{ marginTop: 24 }}>
      <Col>21</Col>
      <Col>0</Col>
    </Row>
    <Row justify="space-around">
      <Col>小说</Col>
      <Col>杂谈</Col>
    </Row>
    <Row>
      <Col>
        {/* <iframe
          title="music"
          frameBorder="no"
          marginWidth={0}
          marginHeight={0}
          width={298}
          height={52}
          src="//music.163.com/outchain/player?type=2&id=419594624&auto=0&height=32"
        /> */}
      </Col>
    </Row>
  </Card>
);
