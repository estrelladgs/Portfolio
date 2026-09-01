import { ModeProvider } from './context/ModeContext';
import { LangProvider } from './context/LangContext';
import { Header } from './components/Header/Header';
import { HeroAbout } from './components/HeroAbout/HeroAbout';
import { Projects } from './components/Projects/Projects';
import { Contact } from './components/Contact/Contact';
import { CustomCursor } from './components/CustomCursor/CustomCursor';

export default function App() {
  return (
    <ModeProvider>
      <LangProvider>
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        <Header />
        <main id="main">
          <HeroAbout />
          <Projects />
          <Contact />
        </main>
        <CustomCursor />
      </LangProvider>
    </ModeProvider>
  );
}
