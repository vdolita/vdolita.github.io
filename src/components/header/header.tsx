import React from 'react';
import { Header } from 'antd/lib/layout/layout';
import { useLocation } from '@reach/router';

import * as Styles from './header.module.less';

export default () => {
  const { pathname: path } = useLocation();

  return (
    <Header
      style={{
        backgroundColor: 'rgb(255 255 255 / 0.5)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <span className={Styles.title}>Vdolita</span>
      <a
        className={Styles.mynav}
        style={{ color: path === '/' ? '#1890ff' : undefined }}
        href="/"
      >
        主页
      </a>
      <a
        className={Styles.mynav}
        style={{ color: path === '/novel' ? '#1890ff' : undefined }}
        href="novel"
      >
        小说
      </a>
      <a
        className={Styles.mynav}
        style={{
          color: path === '/blog' ? '#1890ff' : undefined,
        }}
        href="blog"
      >
        杂谈
      </a>
      {/* <a
        className={Styles.mynav}
        style={{ color: path === '/others' ? '#1890ff' : undefined }}
        href="novel"
      >
        奇物
      </a> */}
    </Header>
  );
};
