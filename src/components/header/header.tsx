import React from 'react';
import { Header } from 'antd/lib/layout/layout';
import { Avatar, Col, Row } from 'antd';
import avatarImg from '../../images/avatar.jpg';

export default () => (
  <Header style={{ backgroundColor: 'transparent' }}>
    <Row align="middle" gutter={{ xs: 8 }}>
      <Col offset={1}>
        <Avatar src={avatarImg} />
      </Col>
      <Col>
        <span style={{ color: '#fff', marginLeft: '10px' }}>Supercell</span>
      </Col>
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
  </Header>
);
