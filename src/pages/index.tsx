import { Tabs } from 'antd';
import React from 'react';
import Layout from '../components/layout';
import Seo from '../components/seo';

const { TabPane } = Tabs;
const IndexPage = () => (
  <Layout isShowHeader>
    <Seo title="vdolita" />
    <div style={{ margin: '10px 0 0 110px' }}>
      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        tabBarStyle={{ color: '#fff' }}
        type="line"
      >
        <TabPane tab="杂谈" key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="小说" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="奇物" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  </Layout>
);

export default IndexPage;
