import React, { ReactNode } from 'react';
import Layout, { Content } from 'antd/lib/layout/layout';

import Header from '../header';
import Footer from '../footer';
import './layout.less';

import * as layoutStyles from './layout.module.less';

type LayoutProps = {
  children: ReactNode;
  isShowHeader?: boolean;
  isShowFooter?: boolean;
};

export default ({ children, isShowFooter, isShowHeader }: LayoutProps) => (
  <Layout className={layoutStyles.layout}>
    {isShowHeader && <Header />}
    <Content style={{ width: 660 }}>{children}</Content>
    {isShowFooter && <Footer />}
  </Layout>
);
