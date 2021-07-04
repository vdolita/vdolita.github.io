import React from 'react';
import { Header } from 'antd/lib/layout/layout';

import * as Styles from './header.module.less';

export default () => {
  let path = 'novel';

  if (window) {
    path = 'others';
  }

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
        style={{ color: path === 'novel' ? '#1890ff' : undefined }}
        href="novel"
      >
        小说
      </a>
      <a
        className={Styles.mynav}
        style={{
          color: path === 'artical' || !path ? '#1890ff' : undefined,
        }}
        href="novel"
      >
        杂谈
      </a>
      <a
        className={Styles.mynav}
        style={{ color: path === 'others' ? '#1890ff' : undefined }}
        href="novel"
      >
        奇物
      </a>
      {/* <iframe
        title="music"
        frameBorder="no"
        marginWidth={0}
        marginHeight={0}
        width={298}
        height={52}
        src="//music.163.com/outchain/player?type=2&id=419594624&auto=0&height=32"
      /> */}
    </Header>
  );
};
