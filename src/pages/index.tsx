import React from 'react';
import Layout from '../components/layout';
import Seo from '../components/seo';

const IndexPage = () => (
  <Layout isShowHeader>
    <Seo title="vdolita" />
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  </Layout>
);

export default IndexPage;
