import { LangProvider, useLang } from './context/LangContext';
import { Header } from './components/Header/Header';
import { HeroAbout } from './components/HeroAbout/HeroAbout';
import { Services } from './components/Services/Services';
import { Projects } from './components/Projects/Projects';
import { Contact } from './components/Contact/Contact';
import { CustomCursor } from './components/CustomCursor/CustomCursor';
import { SiteFooter } from './components/SiteFooter/SiteFooter';

function SkipLink() {
  const { copy } = useLang();
  return (
    <a href="#main" className="skip-link">
      {copy.a11y.skipLink}
    </a>
  );
}

export default function App() {
  return (
    <LangProvider>
      <SkipLink />
      <Header />
      <main id="main">
        <HeroAbout />
        <Services />
        <Projects />
        <Contact />
      </main>
      <SiteFooter />
      <CustomCursor />
    </LangProvider>
  );
}
