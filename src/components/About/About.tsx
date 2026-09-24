import { useLang } from '../../context/LangContext';
import { useInView } from '../../hooks/useInView';
import './About.css';

export function About() {
  const { copy } = useLang();
  const { about } = copy;
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  return (
    <section id="sobre-mi" className="about">
      <div className="about__grid container">
        <div className="about__col about__col--index">
          <span className="section-index">{about.index}</span>
        </div>

        <div className="about__col about__col--body" ref={ref}>
          <h2 className={`about__heading${inView ? ' is-in-view' : ''}`}>{about.heading}</h2>
          <p className={`about__p${inView ? ' is-in-view' : ''}`} style={{ transitionDelay: '80ms' }}>
            {about.p1}
          </p>
          <p className={`about__p${inView ? ' is-in-view' : ''}`} style={{ transitionDelay: '140ms' }}>
            {about.p2}
          </p>
        </div>

        <div className="about__col about__col--data">
          <dl className="about__data-list">
            {about.data.map((item) => (
              <div className="about__data-item" key={item.label}>
                <dt className="mono-label">{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
