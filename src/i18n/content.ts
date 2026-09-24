export type Lang = 'es' | 'en';

/* ---------- proyectos: tipos ---------- */

export type Discipline = 'redes-sociales' | 'video' | 'contenido-seo' | 'comunidad' | 'estrategia' | 'diseno';
export type Platform = 'instagram' | 'tiktok' | 'linkedin' | 'youtube' | 'whatsapp' | 'newsletter' | 'blog';
export type Format = 'vertical' | 'horizontal' | 'carrusel' | 'texto';

export interface ProjectHighlight {
  title: string;
  text: string;
  status?: 'en-progreso';
}

interface ProjectText {
  title: string;
  summary: string;
  /** Describes only what is visible in `image`. */
  imageAlt?: string;
  highlights: ProjectHighlight[];
}

export interface Project {
  slug: string;
  tags: Discipline[];
  platforms: Platform[];
  format: Format[];
  tools: string[];
  image?: string;
  youtubeId?: string;
  externalUrl?: string;
  text: Record<Lang, ProjectText>;
}

export type LocalizedProject = Omit<Project, 'text'> & ProjectText;

/* ---------- proyectos: datos ----------
 * Regla de honestidad: nada inventado. Lo que falte se marca con TODO_
 * (`npm run check:todos` lo lista y falla mientras quede alguno).
 */

export const PROJECTS: Project[] = [
  {
    slug: 'xarxa-aitana',
    tags: ['redes-sociales', 'comunidad', 'video', 'contenido-seo'],
    platforms: ['instagram', 'tiktok', 'whatsapp', 'blog', 'newsletter'],
    // TODO_XARXA_FORMAT: confirmar si además de reels e historias hubo carruseles.
    format: ['vertical'],
    tools: ['CapCut', 'Adobe Premiere', 'WordPress'],
    image: '/assets/xarxa-web.jpg',
    text: {
      es: {
        title: 'Asociación Xarxa Aitana',
        imageAlt:
          'Captura de una web con el logotipo de Xarxa d’Estudiants de la Comunitat Valenciana: estudiantes en un aula levantando la mano y el lema «Viu, Decidix, Participa».',
        summary:
          'Web and Social Media Manager (voluntariado, 2021–2024) de una asociación educativa: comunidad, contenido y vídeo en Instagram, TikTok, WordPress y WhatsApp.',
        highlights: [
          { title: 'Comunidad', text: 'La cuenta pasó de menos de 150 a 535 seguidores, con reels de hasta 6.000 visualizaciones.' },
          { title: 'Calendario editorial', text: 'Planificación y publicación de posts, historias y reels con un calendario editorial propio.' },
          { title: 'Vídeo', text: 'Grabación y edición para difundir actividades, contenido educativo y cobertura de eventos.' },
          { title: 'Blog y newsletter', text: 'Gestión del blog y la newsletter aplicando nociones de SEO.' },
        ],
      },
      en: {
        title: 'Xarxa Aitana Association',
        imageAlt:
          'Screenshot of a website with the Xarxa d’Estudiants de la Comunitat Valenciana logo: students in a classroom raising their hands and the slogan “Viu, Decidix, Participa”.',
        summary:
          'Web and Social Media Manager (volunteer, 2021–2024) for an educational association: community, content and video across Instagram, TikTok, WordPress and WhatsApp.',
        highlights: [
          { title: 'Community', text: 'The account grew from under 150 to 535 followers, with reels reaching up to 6,000 views.' },
          { title: 'Editorial calendar', text: 'Planning and publishing posts, stories and reels with my own editorial calendar.' },
          { title: 'Video', text: 'Filming and editing to promote activities, educational content and event coverage.' },
          { title: 'Blog and newsletter', text: 'Running the blog and newsletter with basic SEO practices.' },
        ],
      },
    },
  },
  {
    slug: 'marta-vegas',
    tags: ['video'],
    platforms: ['youtube'],
    format: ['horizontal'],
    tools: ['CapCut', 'Adobe Premiere'],
    image: '/assets/marta-vegas-frame.jpg',
    youtubeId: 'AnG9zgIpWhg',
    externalUrl: 'https://youtu.be/AnG9zgIpWhg?si=2EGA-bNcKaWZYmaF',
    text: {
      es: {
        title: 'Vídeo · Marta Vegas',
        imageAlt:
          'Portada del vídeo «Un día conmigo» de Marta Vegas: collage de escenas en el gimnasio, en la cocina y preparando pescado al horno.',
        summary: 'Grabación y edición de un vídeo para la creadora de contenido Marta Vegas, publicado en YouTube.',
        highlights: [],
      },
      en: {
        title: 'Video · Marta Vegas',
        imageAlt:
          'Cover of Marta Vegas’s video “Un día conmigo”: a collage of scenes at the gym, in the kitchen and preparing baked fish.',
        summary: 'Filming and editing of a video for content creator Marta Vegas, published on YouTube.',
        highlights: [],
      },
    },
  },
  {
    slug: 'foxbit',
    tags: ['contenido-seo', 'diseno'],
    platforms: ['blog', 'newsletter'],
    format: ['texto'],
    tools: ['WordPress', 'Figma'],
    image: '/assets/foxbit-mockup-1.jpg',
    text: {
      es: {
        title: 'FoxBit',
        imageAlt: 'Pantalla de configuración de perfil de FoxBit: editar perfil, cambiar contraseña y configuración de cookies.',
        summary:
          'Plataforma ed-tech creada por un equipo de 5 personas. Me encargué del blog y la newsletter, y diseñé prototipos y flujos de usuario.',
        highlights: [
          { title: 'Blog y newsletter', text: 'Gestión del blog y la newsletter en WordPress aplicando criterios SEO.' },
          { title: 'Prototipos y flujos', text: 'Prototipos y flujos de usuario diseñados en Figma.' },
          { title: 'Equipo y método', text: 'Trabajo en un equipo multidisciplinar bajo Scrum, a lo largo de 14 sprints organizados en 4 hitos.' },
        ],
      },
      en: {
        title: 'FoxBit',
        imageAlt: 'FoxBit profile settings screen: edit profile, change password and cookie settings.',
        summary:
          'Ed-tech platform created by a team of 5. I ran the blog and newsletter, and designed prototypes and user flows.',
        highlights: [
          { title: 'Blog and newsletter', text: 'Managed the blog and newsletter in WordPress with SEO criteria.' },
          { title: 'Prototypes and flows', text: 'Prototypes and user flows designed in Figma.' },
          { title: 'Team and method', text: 'Worked in a multidisciplinary team under Scrum, across 14 sprints organised into 4 milestones.' },
        ],
      },
    },
  },
  {
    slug: 'lugna',
    tags: ['diseno', 'estrategia'],
    // TODO_LUGNA_PLATFORMS: canales del lanzamiento (instagram, tiktok, linkedin...).
    platforms: [],
    // TODO_LUGNA_FORMAT: formatos de las piezas de lanzamiento.
    format: [],
    tools: ['Figma'],
    image: '/assets/lugna-mockup-1.jpg',
    text: {
      es: {
        title: 'Lugna',
        imageAlt: 'Tres pantallas del prototipo de Lugna: inicio con el progreso, catálogo de programas y clases en directo.',
        summary:
          'App de salud y bienestar, mi Trabajo de Fin de Grado. Un caso de comunicación y lanzamiento de producto: escuchar a los usuarios, diseñar la experiencia y preparar cómo contarla.',
        highlights: [
          { title: 'Investigación de usuarios', text: 'Tests de usabilidad cronometrados y entrevistas con usuarios reales.' },
          { title: 'Interfaz y flujos', text: 'Diseño de la interfaz y de los flujos de usuario en Figma.' },
          {
            title: 'Estrategia de contenido y lanzamiento',
            // TODO_LUGNA_LANZAMIENTO: describir canales, calendario y piezas; añadir resultados cuando haya datos.
            text: 'En curso. Los resultados se publicarán cuando haya datos.',
            status: 'en-progreso',
          },
        ],
      },
      en: {
        title: 'Lugna',
        imageAlt: 'Three screens of the Lugna prototype: home with progress, programme catalogue and live classes.',
        summary:
          'Health and wellness app, my final degree project. A product communication and launch case: listening to users, designing the experience and planning how to tell its story.',
        highlights: [
          { title: 'User research', text: 'Timed usability tests and interviews with real users.' },
          { title: 'Interface and flows', text: 'Interface and user flows designed in Figma.' },
          {
            title: 'Content and launch strategy',
            text: 'In progress. Results will be published once there is data.',
            status: 'en-progreso',
          },
        ],
      },
    },
  },
];

export function getProjects(lang: Lang): LocalizedProject[] {
  return PROJECTS.map(({ text, ...rest }) => ({ ...rest, ...text[lang] }));
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
  newsletter: 'Newsletter',
  blog: 'Blog',
};

export const TOOLS = ['CapCut', 'Premiere', 'Canva', 'Figma', 'Meta Business Suite', 'WordPress', 'Notion'];

export const CV_HREF = '/assets/CV_Estrella_Dominguez_Sanchez_Content_Manager.pdf';
// TODO_CV_EN: añadir el CV en inglés y enlazarlo desde contact.cvHref en `en`.

/* ---------- copy de interfaz ---------- */

interface LangCopy {
  a11y: {
    skipLink: string;
    mainNav: string;
    mobileNav: string;
    heroLabel: string;
    langGroup: string;
    portraitAlt: string;
    newTab: string;
    motionNotice: string;
  };
  nav: {
    about: string;
    services: string;
    projects: string;
    contact: string;
    menuOpen: string;
    menuClose: string;
  };
  outlineName: string;
  hero: {
    eyebrow: string;
    h1Line1: string;
    h1Line2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    cardA: { title: string; lines: string[] };
    cardB: { title: string; slot: string };
    scroll: string;
  };
  about: {
    index: string;
    heading: string;
    p1: string;
    p2: string;
    data: { label: string; value: string }[];
  };
  services: {
    index: string;
    heading: string;
    items: { title: string; text: string }[];
    toolsLabel: string;
  };
  projects: {
    index: string;
    heading: string;
    counterSuffix: string;
    viewCue: string;
    viewCaseA11y: string;
    closeCue: string;
    linkCue: string;
    playVideo: string;
    videoTitle: string;
    platformsLabel: string;
    formatLabel: string;
    toolsLabel: string;
    inProgress: string;
    disciplines: Record<Discipline, string>;
    formats: Record<Format, string>;
  };
  contact: {
    index: string;
    headingSolid: string;
    headingOutline: string;
    emailCta: string;
    copyEmail: string;
    copied: string;
    copyFailed: string;
    linkedin: { label: string; href: string };
    cvHeading: string;
    cvButton: string;
    cvHref: string;
    footerLeft: string;
    footerRight: string;
  };
}

export const CONTENT: Record<Lang, LangCopy> = {
  es: {
    a11y: {
      skipLink: 'Saltar al contenido',
      mainNav: 'Navegación principal',
      mobileNav: 'Navegación móvil',
      heroLabel: 'Presentación',
      langGroup: 'Idioma',
      portraitAlt: 'Retrato de Estrella Domínguez Sánchez',
      newTab: 'se abre en una pestaña nueva',
      motionNotice:
        'Las animaciones de esta web se desactivan si tu sistema tiene activada la opción de reducir el movimiento.',
    },
    nav: {
      about: 'SOBRE MÍ',
      services: 'SERVICIOS',
      projects: 'PROYECTOS',
      contact: 'CONTACTO',
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
    },
    outlineName: 'ESTRELLA / DOMÍNGUEZ',
    hero: {
      eyebrow: 'CONTENIDO · REDES · VÍDEO',
      h1Line1: 'Creo contenido que se ve,',
      h1Line2: 'se entiende y se comparte.',
      subtitle: 'Redes sociales, vídeo y comunidad, con método y con números.',
      ctaPrimary: 'Ver proyectos',
      ctaSecondary: 'Hablemos',
      cardA: {
        title: 'GUION / COPY',
        lines: ['ESCENA 01 · EXT. DÍA', 'Plano general, corte a', 'primer plano en 0:04.', 'CTA: suscríbete'],
      },
      cardB: { title: 'TIMELINE · EDICIÓN', slot: 'FRAME DE VÍDEO' },
      scroll: 'SCROLL',
    },
    about: {
      index: '(01) SOBRE MÍ',
      heading: 'Del timeline a la comunidad.',
      p1: 'Estudié ingeniería, pero cada vez que abría el ordenador acababa editando un vídeo. Me gradué en Ingeniería Multimedia en la Universidad de Alicante, pasé un semestre de Erasmus+ en Suecia y la edición la aprendí por mi cuenta.',
      p2: 'De 2021 a 2024 llevé como voluntaria las redes y la web de la Asociación Xarxa Aitana: calendario editorial, posts, historias y reels, y una cuenta que pasó de menos de 150 a 535 seguidores. También he grabado y editado vídeo para la creadora Marta Vegas y coorganizado eventos y talleres.',
      data: [
        { label: 'UBICACIÓN', value: 'Málaga, España' },
        { label: 'FORMACIÓN', value: 'Ingeniería Multimedia, Universidad de Alicante (2022–2026)' },
        { label: 'INTERCAMBIO', value: 'Erasmus+, Högskolan i Skövde, Suecia (2025)' },
        { label: 'IDIOMAS', value: 'Español (nativo) · Inglés B2 · Francés A2 · Sueco A1' },
      ],
    },
    services: {
      index: '(02) SERVICIOS',
      heading: 'Qué hago.',
      items: [
        {
          title: 'Redes sociales y comunidad',
          text: 'Calendario editorial, publicación de posts, historias y reels, y conversación con la comunidad.',
        },
        {
          title: 'Vídeo y edición',
          text: 'Grabación y edición de reels, TikToks, historias y vídeo horizontal para YouTube.',
        },
        {
          title: 'Contenido y SEO',
          text: 'Redacción para blog y newsletter con criterios SEO, y gestión de contenido en WordPress.',
        },
        {
          title: 'Diseño y marca',
          text: 'Piezas gráficas, prototipos y flujos pensados para que el mensaje se entienda a la primera.',
        },
        {
          title: 'Estrategia y análisis',
          text: 'Planificación por objetivos, investigación con usuarios y lectura de métricas para decidir qué repetir.',
        },
      ],
      toolsLabel: 'HERRAMIENTAS',
    },
    projects: {
      index: '(03) PROYECTOS',
      heading: 'Casos de contenido, comunidad y diseño.',
      counterSuffix: 'SELECCIÓN',
      viewCue: 'VER',
      viewCaseA11y: 'ver caso',
      closeCue: 'Cerrar',
      linkCue: 'Ver publicación',
      playVideo: 'Reproducir vídeo',
      videoTitle: 'Vídeo de YouTube',
      platformsLabel: 'PLATAFORMAS',
      formatLabel: 'FORMATO',
      toolsLabel: 'HERRAMIENTAS',
      inProgress: 'EN PROGRESO',
      disciplines: {
        'redes-sociales': 'Redes sociales',
        video: 'Vídeo',
        'contenido-seo': 'Contenido y SEO',
        comunidad: 'Comunidad',
        estrategia: 'Estrategia',
        diseno: 'Diseño',
      },
      formats: { vertical: 'Vertical', horizontal: 'Horizontal', carrusel: 'Carrusel', texto: 'Texto' },
    },
    contact: {
      index: '(04) CONTACTO',
      headingSolid: 'Hablemos',
      headingOutline: 'cuando quieras',
      emailCta: 'estrelladomsan@gmail.com',
      copyEmail: 'Copiar email',
      copied: 'Email copiado',
      copyFailed: 'No se pudo copiar el email',
      linkedin: { label: 'LinkedIn: Estrella Domínguez Sánchez', href: 'https://www.linkedin.com/in/estrella-dominguez/' },
      cvHeading: 'Currículum',
      cvButton: 'Descargar CV',
      cvHref: CV_HREF,
      footerLeft: '© 2026 ESTRELLA DOMÍNGUEZ SÁNCHEZ',
      footerRight: 'DISEÑADO POR MÍ',
    },
  },
  en: {
    a11y: {
      skipLink: 'Skip to content',
      mainNav: 'Main navigation',
      mobileNav: 'Mobile navigation',
      heroLabel: 'Introduction',
      langGroup: 'Language',
      portraitAlt: 'Portrait of Estrella Domínguez Sánchez',
      newTab: 'opens in a new tab',
      motionNotice: 'Animations on this site are turned off if your system has the reduce motion setting enabled.',
    },
    nav: {
      about: 'ABOUT',
      services: 'SERVICES',
      projects: 'PROJECTS',
      contact: 'CONTACT',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
    outlineName: 'ESTRELLA / DOMÍNGUEZ',
    hero: {
      eyebrow: 'CONTENT · SOCIAL · VIDEO',
      h1Line1: 'I create content that gets seen,',
      h1Line2: 'understood and shared.',
      subtitle: 'Social media, video and community, with method and with numbers.',
      ctaPrimary: 'View projects',
      ctaSecondary: "Let's talk",
      cardA: {
        title: 'SCRIPT / COPY',
        lines: ['SCENE 01 · EXT. DAY', 'Wide shot, cut to', 'close-up at 0:04.', 'CTA: subscribe'],
      },
      cardB: { title: 'TIMELINE · EDIT', slot: 'VIDEO FRAME' },
      scroll: 'SCROLL',
    },
    about: {
      index: '(01) ABOUT',
      heading: 'From the timeline to the community.',
      p1: 'I studied engineering, but every time I opened my laptop I ended up editing a video. I graduated in Multimedia Engineering from the University of Alicante, spent an Erasmus+ semester in Sweden, and taught myself video editing along the way.',
      p2: 'From 2021 to 2024 I volunteered running social media and the website for the Xarxa Aitana Association: editorial calendar, posts, stories and reels, and an account that grew from under 150 to 535 followers. I have also filmed and edited video for creator Marta Vegas and co-organised events and workshops.',
      data: [
        { label: 'LOCATION', value: 'Málaga, Spain' },
        { label: 'EDUCATION', value: 'Multimedia Engineering, University of Alicante (2022–2026)' },
        { label: 'EXCHANGE', value: 'Erasmus+, Högskolan i Skövde, Sweden (2025)' },
        { label: 'LANGUAGES', value: 'Spanish (native) · English B2 · French A2 · Swedish A1' },
      ],
    },
    services: {
      index: '(02) SERVICES',
      heading: 'What I do.',
      items: [
        {
          title: 'Social media and community',
          text: 'Editorial calendar, publishing posts, stories and reels, and keeping the conversation going with the community.',
        },
        {
          title: 'Video and editing',
          text: 'Filming and editing reels, TikToks, stories and horizontal video for YouTube.',
        },
        {
          title: 'Content and SEO',
          text: 'Writing for blogs and newsletters with SEO criteria, and managing content in WordPress.',
        },
        {
          title: 'Design and brand',
          text: 'Graphics, prototypes and flows designed so the message lands the first time.',
        },
        {
          title: 'Strategy and analytics',
          text: 'Goal-based planning, user research and reading metrics to decide what to repeat.',
        },
      ],
      toolsLabel: 'TOOLS',
    },
    projects: {
      index: '(03) PROJECTS',
      heading: 'Content, community and design cases.',
      counterSuffix: 'SELECTED',
      viewCue: 'VIEW',
      viewCaseA11y: 'view case',
      closeCue: 'Close',
      linkCue: 'View original',
      playVideo: 'Play video',
      videoTitle: 'YouTube video',
      platformsLabel: 'PLATFORMS',
      formatLabel: 'FORMAT',
      toolsLabel: 'TOOLS',
      inProgress: 'IN PROGRESS',
      disciplines: {
        'redes-sociales': 'Social media',
        video: 'Video',
        'contenido-seo': 'Content and SEO',
        comunidad: 'Community',
        estrategia: 'Strategy',
        diseno: 'Design',
      },
      formats: { vertical: 'Vertical', horizontal: 'Horizontal', carrusel: 'Carousel', texto: 'Text' },
    },
    contact: {
      index: '(04) CONTACT',
      headingSolid: "Let's talk",
      headingOutline: 'whenever you like',
      emailCta: 'estrelladomsan@gmail.com',
      copyEmail: 'Copy email',
      copied: 'Email copied',
      copyFailed: 'Could not copy the email',
      linkedin: { label: 'LinkedIn: Estrella Domínguez Sánchez', href: 'https://www.linkedin.com/in/estrella-dominguez/' },
      cvHeading: 'Résumé',
      cvButton: 'Download CV (Spanish version)',
      cvHref: CV_HREF,
      footerLeft: '© 2026 ESTRELLA DOMÍNGUEZ SÁNCHEZ',
      footerRight: 'DESIGNED BY ME',
    },
  },
};
