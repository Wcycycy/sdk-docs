import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, {translate} from '@docusaurus/Translate';

const FeatureList = [
  {
    title: <Translate id="homepage.features.awesomeVoices.title">Awesome Voices</Translate>,
    Img: () => (
      <img
        className={styles.featureImg}
        src={useBaseUrl('img/Dubbing_voice_filter.png')}
        alt={translate({
          id: 'homepage.features.awesomeVoices.title',
          message: 'Awesome Voices',
        })}
      />
    ),
    description: (
      <Translate id="homepage.features.awesomeVoices.desc">
        Over 500 different voices from anime, game, and movie to celebrity to anyone you wish to be.
        You can also make your personal voice by voice cloning.
      </Translate>
    ),
  },
  {
    title: <Translate id="homepage.features.lowLatency.title">Low Latency</Translate>,
    Img: () => (
      <img
        className={styles.featureImg}
        src={useBaseUrl('img/Dubbing_live.png')}
        alt={translate({
          id: 'homepage.features.lowLatency.title',
          message: 'Low Latency',
        })}
      />
    ),
    description: (
      <Translate id="homepage.features.lowLatency.desc">
        Dubbing AI changes your voice in under 30ms, no prerecording needed which brings you the real-time voice changing experience.
      </Translate>
    ),
  },
  {
    title: <Translate id="homepage.features.easyToUse.title">Easy to Use</Translate>,
    Img: () => (
      <img
        className={styles.featureImg}
        src={useBaseUrl('img/Dubbing_meeting.png')}
        alt={translate({
          id: 'homepage.features.easyToUse.title',
          message: 'Easy to Use',
        })}
      />
    ),
    description: (
      <Translate id="homepage.features.easyToUse.desc">
        You'll find comprehensive guides and documentation to help you start working with the AI Voice SDK as quickly as possible,
        as well as support if you get stuck.
      </Translate>
    ),
  },
];

function Feature({Svg, Img, title, description}) {
  const Icon = Svg || Img;
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Icon className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
