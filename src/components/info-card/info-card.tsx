import { Avatar, Card } from 'antd';
import React from 'react';

import avatarJpg from '../../images/avatar.jpg';

export default () => (
  <Card style={{ width: 275 }}>
    <Avatar src={avatarJpg} />
  </Card>
);
