import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

const FeatureList = [
  {
    title: 'Awesome Voices',
    Img: () => (
    <img
    className={styles.featureImg}
    src={useBaseUrl('img/Dubbing_voice_filter.png')}
    alt="Awesome Voices"
    />
    ),
    description: (
      <>
        Over 500 different voices from anime, game, and movie to celebrity to anyone you wish to be. 
        You can also make your personal voice by voice cloning.
      </>
    ),
  },
  {
    title: 'Low Latency',
    Img: () => (
    <img
    className={styles.featureImg}
    src={useBaseUrl('img/Dubbing_live.png')}
    alt="Low Latency"
    />
    ),
    description: (
      <>
        Dubbing AI changes your voice in under 30ms, no prerecording needed 
        which brings you the real-time voice changing experience.
      </>
    ),
  },
  {
    title: 'Easy to Use',
    Img: () => (
    <img
    className={styles.featureImg}
    src={useBaseUrl('img/Dubbing_meeting.png')}
    alt="Easy to Use"
    />
    ),
    description: (
      <>
        You'll find comprehensive guides and documentation to help you start working with the AI Voice SDK as quickly as possible, 
        as well as support if you get stuck.
      </>
    ),
  },
];

function Feature({ Svg, Img, title, description }) {
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
