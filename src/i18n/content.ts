export type Mode = 'dev' | 'content';
export type Lang = 'es' | 'en';

export const MARTA_VEGAS_YOUTUBE_ID = ''; // TODO: pendiente de recibir el ID del vídeo

interface HeroCopy {
  eyebrow: string;
  h1Line1: string;
  h1Line2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  cardA: { title: string; lines: string[] };
  cardB: { title: string; slot: string };
  cardC: { title: string };
  scroll: string;
}

interface NavCopy {
  about: string;
  projects: string;
  contact: string;
  modeDev: string;
  modeContent: string;
  modeDevShort: string;
  modeContentShort: string;
  menuOpen: string;
  menuClose: string;
}

interface AboutCopy {
  index: string;
  heading: string;
  p1: string;
  p2: string;
  skillsDev: string[];
  skillsContent: string[];
  data: { label: string; value: string }[];
}

interface ProjectCopy {
  slug: string;
  title: string;
  description: string;
  roles: string[];
  image: string;
  hasVideo?: boolean;
}

interface ProjectsCopy {
  index: string;
  heading: string;
  counter: string;
  viewCue: string;
  closeCue: string;
  items: ProjectCopy[];
}

interface ContactCopy {
  index: string;
  headingSolid: string;
  headingOutline: string;
  emailCta: string;
  copied: string;
  links: { label: string; href: string }[];
  cvHeading: string;
  cvDev: string;
  cvContent: string;
  footerLeft: string;
  footerRight: string;
}

interface LangCopy {
  nav: NavCopy;
  hero: Record<Mode, HeroCopy>;
  outlineName: string;
  about: AboutCopy;
  projects: ProjectsCopy;
  contact: ContactCopy;
}

export const CONTENT: Record<Lang, LangCopy> = {
  es: {
    nav: {
      about: 'SOBRE MÍ',
      projects: 'PROYECTOS',
      contact: 'CONTACTO',
      modeDev: 'Developer & Design',
      modeContent: 'Content & Video',
      modeDevShort: 'DEVELOPER & DESIGN',
      modeContentShort: 'CONTENT & VIDEO',
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
    },
    outlineName: 'ESTRELLA / DOMÍNGUEZ',
    hero: {
      dev: {
        eyebrow: 'INGENIERA MULTIMEDIA',
        h1Line1: 'Construyo interfaces',
        h1Line2: 'que se sienten bien',
        subtitle:
          'Frontend Developer & UX/UI Designer. Diseño flujos de usuario en Figma y los convierto en interfaces reales con React y React Native.',
        ctaPrimary: 'Ver proyectos',
        ctaSecondary: 'Hablemos',
        cardA: {
          title: 'COMPONENT.TSX',
          lines: ['const [state, setState]', '  = useState(false);', 'return (', '  <Button accent />'],
        },
        cardB: { title: 'FIGMA · PROTOTIPO', slot: 'PANTALLA DE APP' },
        cardC: { title: 'LIGHTHOUSE 98' },
        scroll: 'SCROLL',
      },
      content: {
        eyebrow: 'INGENIERA MULTIMEDIA',
        h1Line1: 'Cuento historias',
        h1Line2: 'que se quedan',
        subtitle:
          'Content Manager & Video Editor. Gestiono comunidades, edito vídeo y escribo el contenido que las conecta.',
        ctaPrimary: 'Ver proyectos',
        ctaSecondary: 'Hablemos',
        cardA: {
          title: 'GUION / COPY',
          lines: ['ESCENA 01 · EXT. DÍA', 'Plano general, corte a', 'primer plano en 0:04.', 'CTA: suscríbete'],
        },
        cardB: { title: 'TIMELINE · 4K', slot: 'FRAME DE VÍDEO' },
        cardC: { title: 'ALCANCE / SEMANA' },
        scroll: 'SCROLL',
      },
    },
    about: {
      index: '(01) SOBRE MÍ',
      heading: 'Entre el código, el diseño y la historia que se cuenta.',
      p1: 'Ingeniera Multimedia por la Universidad de Alicante, con una temporada de Erasmus+ en Suecia que amplió mi forma de entender el diseño y la tecnología.',
      p2: 'Me muevo con la misma soltura entre interfaces y contenido: construyo en React y React Native, diseño flujos en Figma validados con usuarios reales, y he gestionado la comunicación digital de una asociación hasta multiplicar por tres su comunidad.',
      skillsDev: [
        'React',
        'Angular',
        'React Native',
        'TypeScript',
        'JavaScript',
        'HTML5/CSS3',
        'Next.js',
        'Figma (prototipado, design systems, user flows)',
        'Tests de usabilidad',
        'APIs REST',
      ],
      skillsContent: [
        'Instagram',
        'TikTok',
        'WordPress',
        'Calendario editorial',
        'Redacción',
        'SEO básico',
        'Edición de vídeo (CapCut, Adobe Premiere)',
        'Gestión de comunidad',
      ],
      data: [
        { label: 'UBICACIÓN', value: 'Málaga, España' },
        { label: 'FORMACIÓN', value: 'Ingeniería Multimedia, Universidad de Alicante (2022-2026)' },
        { label: 'INTERCAMBIO', value: 'Erasmus+, Högskolan i Skövde, Suecia (2025)' },
        { label: 'IDIOMAS', value: 'Español (nativo) · Inglés B2 · Francés A2 · Sueco A1' },
      ],
    },
    projects: {
      index: '(02) PROYECTOS',
      heading: 'Cuatro piezas entre producto, diseño y contenido.',
      counter: '04 / SELECCIÓN',
      viewCue: 'VER',
      closeCue: 'Cerrar',
      items: [
        {
          slug: 'lugna',
          title: 'Lugna',
          description:
            'App móvil de salud y bienestar con corrección postural en tiempo real, desarrollada en solitario y validada con usuarios reales mediante tests de usabilidad.',
          roles: ['REACT NATIVE', 'FIGMA', 'MEDIAPIPE'],
          image: '/assets/lugna-mockup-1.jpg',
        },
        {
          slug: 'foxbit',
          title: 'FoxBit',
          description:
            'Plataforma web Ed-Tech desarrollada en equipo bajo Scrum: prototipos y flujos de usuario en Figma, y 13 componentes en Angular/TypeScript integrados con APIs REST.',
          roles: ['ANGULAR', 'TYPESCRIPT', 'SCRUM'],
          image: '/assets/foxbit-mockup-1.jpg',
        },
        {
          slug: 'marta-vegas',
          title: 'Vídeo · Marta Vegas',
          description:
            'Grabación y edición de un vídeo para la creadora de contenido Marta Vegas, publicado en YouTube.',
          roles: ['CAPCUT', 'ADOBE PREMIERE', 'YOUTUBE'],
          image: '/assets/marta-vegas-frame.jpg',
          hasVideo: true,
        },
        {
          slug: 'xarxa-aitana',
          title: 'Asociación Xarxa Aitana',
          description:
            'Gestión integral de la comunicación digital de una ONG educativa como Web and Social Media Manager: desarrollo y mantenimiento del sitio WordPress, y gestión de redes con calendario editorial propio, haciendo crecer la comunidad de menos de 150 a 535 seguidores.',
          roles: ['WORDPRESS', 'INSTAGRAM', 'SEO'],
          image: '/assets/xarxa-web.jpg',
        },
      ],
    },
    contact: {
      index: '(03) CONTACTO',
      headingSolid: 'Hablemos',
      headingOutline: 'cuando quieras',
      emailCta: 'estrelladomsan@gmail.com',
      copied: 'COPIADO',
      links: [
        { label: 'Linkedin: Estrella Domínguez Sánchez', href: 'https://www.linkedin.com/in/estrella-dominguez/' },
        { label: 'GitHub: estrelladgs', href: 'https://github.com/estrelladgs' },
      ],
      cvHeading: 'Descargar CV',
      cvDev: 'Descargar CV · Frontend Developer',
      cvContent: 'Descargar CV · Content Manager',
      footerLeft: '© 2026 ESTRELLA DOMÍNGUEZ SÁNCHEZ',
      footerRight: 'DISEÑADO Y PROGRAMADO POR MÍ',
    },
  },
  en: {
    nav: {
      about: 'ABOUT',
      projects: 'PROJECTS',
      contact: 'CONTACT',
      modeDev: 'Developer & Design',
      modeContent: 'Content & Video',
      modeDevShort: 'DEVELOPER & DESIGN',
      modeContentShort: 'CONTENT & VIDEO',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
    outlineName: 'ESTRELLA / DOMÍNGUEZ',
    hero: {
      dev: {
        eyebrow: 'MULTIMEDIA ENGINEER',
        h1Line1: 'I build interfaces',
        h1Line2: 'that feel right',
        subtitle:
          'Frontend Developer & UX/UI Designer. I design user flows in Figma and turn them into real interfaces with React and React Native.',
        ctaPrimary: 'View projects',
        ctaSecondary: "Let's talk",
        cardA: {
          title: 'COMPONENT.TSX',
          lines: ['const [state, setState]', '  = useState(false);', 'return (', '  <Button accent />'],
        },
        cardB: { title: 'FIGMA · PROTOTYPE', slot: 'APP SCREEN' },
        cardC: { title: 'LIGHTHOUSE 98' },
        scroll: 'SCROLL',
      },
      content: {
        eyebrow: 'MULTIMEDIA ENGINEER',
        h1Line1: 'I tell stories',
        h1Line2: 'that stick',
        subtitle: 'Content Manager & Video Editor. I manage communities, edit video and write the content that connects them.',
        ctaPrimary: 'View projects',
        ctaSecondary: "Let's talk",
        cardA: {
          title: 'SCRIPT / COPY',
          lines: ['SCENE 01 · EXT. DAY', 'Wide shot, cut to', 'close-up at 0:04.', 'CTA: subscribe'],
        },
        cardB: { title: 'TIMELINE · 4K', slot: 'VIDEO FRAME' },
        cardC: { title: 'REACH / WEEK' },
        scroll: 'SCROLL',
      },
    },
    about: {
      index: '(01) ABOUT',
      heading: 'Between the code, the design and the story being told.',
      p1: 'Multimedia Engineer from the University of Alicante, with an Erasmus+ term in Sweden that broadened how I understand design and technology.',
      p2: 'I move just as easily between interfaces and content: I build with React and React Native, design flows in Figma validated with real users, and managed the digital communication of an association, tripling its community.',
      skillsDev: [
        'React',
        'Angular',
        'React Native',
        'TypeScript',
        'JavaScript',
        'HTML5/CSS3',
        'Next.js',
        'Figma (prototyping, design systems, user flows)',
        'Usability testing',
        'REST APIs',
      ],
      skillsContent: [
        'Instagram',
        'TikTok',
        'WordPress',
        'Editorial calendar',
        'Copywriting',
        'Basic SEO',
        'Video editing (CapCut, Adobe Premiere)',
        'Community management',
      ],
      data: [
        { label: 'LOCATION', value: 'Málaga, Spain' },
        { label: 'EDUCATION', value: 'Multimedia Engineering, University of Alicante (2022-2026)' },
        { label: 'EXCHANGE', value: 'Erasmus+, Högskolan i Skövde, Sweden (2025)' },
        { label: 'LANGUAGES', value: 'Spanish (native) · English B2 · French A2 · Swedish A1' },
      ],
    },
    projects: {
      index: '(02) PROJECTS',
      heading: 'Four pieces between product, design and content.',
      counter: '04 / SELECTED',
      viewCue: 'VIEW',
      closeCue: 'Close',
      items: [
        {
          slug: 'lugna',
          title: 'Lugna',
          description:
            'Health and wellness mobile app with real-time posture correction, built solo and validated with real users through usability testing.',
          roles: ['REACT NATIVE', 'FIGMA', 'MEDIAPIPE'],
          image: '/assets/lugna-mockup-1.jpg',
        },
        {
          slug: 'foxbit',
          title: 'FoxBit',
          description:
            'Ed-Tech web platform built as a team under Scrum: prototypes and user flows in Figma, and 13 Angular/TypeScript components integrated with REST APIs.',
          roles: ['ANGULAR', 'TYPESCRIPT', 'SCRUM'],
          image: '/assets/foxbit-mockup-1.jpg',
        },
        {
          slug: 'marta-vegas',
          title: 'Video · Marta Vegas',
          description: 'Filming and editing of a video for content creator Marta Vegas, published on YouTube.',
          roles: ['CAPCUT', 'ADOBE PREMIERE', 'YOUTUBE'],
          image: '/assets/marta-vegas-frame.jpg',
          hasVideo: true,
        },
        {
          slug: 'xarxa-aitana',
          title: 'Xarxa Aitana Association',
          description:
            'End-to-end digital communication for an educational NGO as Web and Social Media Manager: building and maintaining the WordPress site, and running social media with my own editorial calendar, growing the community from under 150 to 535 followers.',
          roles: ['WORDPRESS', 'INSTAGRAM', 'SEO'],
          image: '/assets/xarxa-web.jpg',
        },
      ],
    },
    contact: {
      index: '(03) CONTACT',
      headingSolid: "Let's talk",
      headingOutline: 'whenever you like',
      emailCta: 'estrelladomsan@gmail.com',
      copied: 'COPIED',
      links: [
        { label: 'Linkedin: Estrella Domínguez Sánchez', href: 'https://www.linkedin.com/in/estrella-dominguez/' },
        { label: 'GitHub: estrelladgs', href: 'https://github.com/estrelladgs' },
      ],
      cvHeading: 'Download CV',
      cvDev: 'Download CV · Frontend Developer',
      cvContent: 'Download CV · Content Manager',
      footerLeft: '© 2026 ESTRELLA DOMÍNGUEZ SÁNCHEZ',
      footerRight: 'DESIGNED AND BUILT BY ME',
    },
  },
};
