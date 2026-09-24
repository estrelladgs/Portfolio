import { useLang } from '../../context/LangContext';
import { TOOLS } from '../../i18n/content';
import './Services.css';

export function Services() {
  const { copy } = useLang();
  const { services } = copy;

  return (
    <section id="servicios" className="services">
      <div className="container">
        <span className="section-index">{services.index}</span>
        <h2 className="services__heading">{services.heading}</h2>

        <ol className="services__grid">
          {services.items.map((item, i) => (
            <li className="services__item" key={item.title}>
              <span className="services__num mono-label">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="services__title">{item.title}</h3>
              <p className="services__text">{item.text}</p>
            </li>
          ))}
        </ol>

        <div className="services__tools">
          <p className="mono-label services__tools-label">{services.toolsLabel}</p>
          <ul className="services__tools-list">
            {TOOLS.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
