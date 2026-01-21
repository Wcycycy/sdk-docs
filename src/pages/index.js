import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';
import Head from '@docusaurus/Head';

// 1. 必须引入 Translate 组件
import Translate from '@docusaurus/Translate';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <>        
        <Head>
          {/* 注意：这里的 meta 和 title 暂时会显示默认英文，
              如果需要 SEO 也支持多语言，需要使用 translate 函数，目前先修复页面显示 */}
          <meta name="description" content={siteConfig.tagline} />
          <title>{siteConfig.title}</title>
          <meta name="robots" content="index, follow" />
        </Head>
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero_title">
                    {/* 2. 使用 Translate 包裹，并指定你在 code.json 中定义的 ID */}
                    <Translate id="siteConfig.title">{siteConfig.title}</Translate>
                </Heading>
                <p className="hero_subtitle">
                    {/* 3. 同样包裹副标题 */}
                    <Translate id="siteConfig.tagline">{siteConfig.tagline}</Translate>
                </p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/intro">
                        {/* 4. 修改按钮文本 */}
                        <Translate id="homepage.button.getStarted">Start Now</Translate>
                    </Link>
                </div>
            </div>
        </header>
    </>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      // 这里可以保持原样，Layout 会处理一部分基础翻译
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}