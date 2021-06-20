import React from 'react';
import Layout from '../components/layout';
import Seo from '../components/seo';

const LinkStyle: React.CSSProperties = {
  fontSize: '40px',
  color: '#fff',
  margin: '0 100px',
};

const IndexPage = () => (
  <Layout>
    <Seo title="vdolita" />
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <a style={LinkStyle} href="/artical">
        杂谈
      </a>
      <a style={LinkStyle} href="/novel">
        小说
      </a>
      <a style={LinkStyle} href="/artical">
        奇物
      </a>
    </div>
  </Layout>
);

export default IndexPage;
