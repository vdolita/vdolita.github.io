import React from 'react';
import Layout from '../components/layout';
import Seo from '../components/seo';
import InfoCard from '../components/info-card';

const IndexPage = () => (
  <Layout isShowHeader>
    <Seo title="vdolita" />
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <InfoCard />
    </div>
  </Layout>
);

export default IndexPage;
