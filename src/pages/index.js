import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Head from '@docusaurus/Head';
import Translate, {translate} from '@docusaurus/Translate';

import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  // 页面可翻译文案（默认英文），中文放到 i18n JSON 里
  const heroTitle = translate({
    id: 'homepage.hero.title',
    message: siteConfig.title,
  });

  const heroTagline = translate({
    id: 'homepage.hero.tagline',
    message: siteConfig.tagline,
  });

  const metaDescription = translate({
    id: 'homepage.meta.description',
    message: siteConfig.tagline,
  });

  const pageTitle = translate({
    id: 'homepage.meta.title',
    message: siteConfig.title,
  });

  return (
    <>
      <Head>
        <meta name="description" content={metaDescription} />
        <title>{pageTitle}</title>
        <meta name="robots" content="index, follow" />
      </Head>

      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero_title">
            {heroTitle}
          </Heading>

          <p className="hero_subtitle">{heroTagline}</p>

          <div className={styles.buttons}>
            <Link className="button button--secondary button--lg" to="/docs/intro">
              <Translate id="homepage.button.getStarted" message="Start Now" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  const layoutTitle = translate({
    id: 'homepage.layout.title',
    message: `Hello from ${siteConfig.title}`,
  });

  const layoutDescription = translate({
    id: 'homepage.layout.description',
    message: 'Description will go into a meta tag in <head />',
  });

  return (
    <Layout title={layoutTitle} description={layoutDescription}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
