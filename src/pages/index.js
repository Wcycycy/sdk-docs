import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';
import Head from '@docusaurus/Head';

import Translate from '@docusaurus/Translate';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <>        
        <Head>
          {/* 在 Head 标签属性中使用翻译需要特殊处理，但目前先保持这样，重点修复页面显示 */}
          <meta name="description" content={siteConfig.tagline} />
          <title>{siteConfig.title}</title>
          <meta name="robots" content="index, follow" />
        </Head>
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero_title">
                    {/* 只保留 Translate 组件，并将 siteConfig.title 作为默认值 */}
                    <Translate id="siteConfig.title">{siteConfig.title}</Translate>
                </Heading>
                
                <p className="hero_subtitle">
                    {/* 将 Translate 放在 p 标签内部，确保样式正确 */}
                    <Translate id="siteConfig.tagline">{siteConfig.tagline}</Translate>
                </p>

                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/intro">
                        <Translate id="homepage.button.getStarted">Start Now</Translate>
                    </Link>
                </div>
            </div>
        </header>
    </>
  );
}