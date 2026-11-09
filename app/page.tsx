import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  MoveUpRight
} from "lucide-react";

const projects = [
  {
    number: "01",
    title: "Objects of permanence",
    category: "ART DIRECTION · BRANDING",
    creator: "Studio Nō",
    image:
      "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1200&q=85",
    className: "project-large"
  },
  {
    number: "02",
    title: "A different perspective",
    category: "DIGITAL DESIGN",
    creator: "Marina Costa",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=85",
    className: "project-small"
  },
  {
    number: "03",
    title: "Beyond the ordinary",
    category: "3D · EXPERIMENTAL",
    creator: "Alex Morgan",
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=85",
    className: "project-small"
  },
  {
    number: "04",
    title: "Form follows feeling",
    category: "VISUAL IDENTITY",
    creator: "Atelier Forma",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=85",
    className: "project-large"
  }
];

const disciplines = [
  "Graphic design",
  "Development",
  "Art direction",
  "Motion design",
  "Photography",
  "3D & CGI",
  "UI / UX",
  "Creative technology"
];

export default function Home() {
  return (
    <main id="top">
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="Workfolio, início">
          workfolio<span className="wordmark-dot">.</span>
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#explore">Explorar</a>
          <a href="#manifesto">Sobre</a>
          <a href="#disciplines">Disciplinas</a>
        </nav>

        <a href="#community" className="header-cta">
          Conheça o projeto <ArrowUpRight size={15} />
        </a>

        <a href="#explore" className="mobile-menu" aria-label="Ir para projetos">
          <ArrowDown size={20} />
        </a>
      </header>

      <section className="hero">
        <div className="hero-topline">
          <span>THE CREATIVE PROFESSIONAL NETWORK</span>
          <span className="hero-location">
            <span className="status-dot" />
            A NEW SPACE FOR CREATIVE MINDS
          </span>
        </div>

        <div className="hero-content">
          <h1>
            Your work.
            <br />
            Your <span className="outline-text">identity.</span>
            <br />
            Your network<span className="accent-period">.</span>
          </h1>

          <div className="hero-aside">
            <Asterisk className="hero-asterisk" strokeWidth={1} />
            <p>
              Mais do que um portfólio.
              <br />
              Um espaço para mostrar o que você faz, construir sua presença
              profissional e se conectar com quem cria.
            </p>
            <a href="#explore" className="text-link">
              Descubra o Workfolio <ArrowDown size={15} />
            </a>
          </div>
        </div>

        <div className="hero-bottom">
          <span>DESIGNERS. DEVELOPERS. CREATORS.</span>
          <span>BUILT FOR PEOPLE WHO MAKE THINGS.</span>
        </div>
      </section>

      <section className="featured-section" id="explore">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / SELECTED WORK</span>
            <h2>
              Ideas made
              <br />
              <span className="serif-italic">visible.</span>
            </h2>
          </div>

          <div className="section-intro">
            <p>
              Trabalhos, experimentos e projetos que mostram o potencial de
              quem transforma ideias em realidade.
            </p>
            <span className="project-count">A GLIMPSE INTO CREATIVE WORK</span>
          </div>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article
              className={`project-card ${project.className}`}
              key={project.number}
            >
              <div className="project-image-wrap">
                <img
                  src={project.image}
                  alt={`Imagem conceitual do projeto ${project.title}`}
                  loading="lazy"
                />
                <span className="project-number">{project.number}</span>
                <span className="project-arrow">
                  <MoveUpRight size={19} />
                </span>
              </div>

              <div className="project-info">
                <div>
                  <h3>{project.title}</h3>
                  <span>{project.category}</span>
                </div>
                <span className="project-creator">{project.creator}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="projects-note">
          <span>AN OPEN CANVAS FOR CREATIVE WORK</span>
          <span>01 — 04</span>
        </div>
      </section>

      <section className="manifesto-section" id="manifesto">
        <div className="manifesto-top">
          <span className="eyebrow">02 / THE IDEA</span>
          <span className="manifesto-symbol">W.</span>
        </div>

        <div className="manifesto-content">
          <h2>
            Your talent deserves
            <br />
            <span className="serif-italic">more than a link.</span>
          </h2>

          <div className="manifesto-copy">
            <p>
              O trabalho criativo está espalhado por diferentes plataformas,
              perfis e arquivos. Sua trajetória merece um lugar que reúna tudo
              isso com intenção.
            </p>
            <p>
              O Workfolio nasce para aproximar portfólio, identidade
              profissional e comunidade em uma experiência construída para
              quem faz.
            </p>
          </div>
        </div>

        <div className="manifesto-bottom">
          <span>NOT JUST WHAT YOU DO.</span>
          <span>WHO YOU ARE AND WHAT YOU CAN BECOME.</span>
        </div>
      </section>

      <section className="disciplines-section" id="disciplines">
        <div className="disciplines-heading">
          <span className="eyebrow">03 / DIFFERENT MINDS, ONE SPACE</span>
          <h2>
            Many ways
            <br />
            <span className="serif-italic">to create.</span>
          </h2>
          <p>
            Não importa a ferramenta, a linguagem ou o caminho. Existe espaço
            para diferentes formas de criar.
          </p>
        </div>

        <div className="discipline-list">
          {disciplines.map((discipline, index) => (
            <div className="discipline-item" key={discipline}>
              <span className="discipline-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="discipline-name">{discipline}</span>
              <ArrowUpRight className="discipline-arrow" size={19} />
            </div>
          ))}
        </div>
      </section>

      <section className="community-section" id="community">
        <div className="community-decoration">W</div>

        <div className="community-content">
          <span className="eyebrow">04 / THE NEXT CHAPTER</span>
          <h2>
            Make your work
            <br />
            <span className="serif-italic">mean something.</span>
          </h2>
          <p>
            Estamos construindo um novo espaço para quem vive de ideias,
            projetos e possibilidades.
          </p>
          <span className="coming-soon">
            <span className="status-dot" />
            WORKFOLIO IS IN DEVELOPMENT
          </span>
        </div>

        <div className="community-bottom">
          <span>YOUR NEXT CHAPTER STARTS WITH YOUR WORK.</span>
          <span>WORKFOLIO® 2026</span>
        </div>
      </section>

      <footer className="site-footer">
        <a href="#" className="wordmark footer-wordmark">
          workfolio<span className="wordmark-dot">.</span>
        </a>

        <span className="footer-description">
          Your work. Your identity. Your network.
        </span>

        <a href="#top" className="back-to-top">
          Back to top <ArrowUpRight size={15} />
        </a>

        <span className="copyright">© 2026 WORKFOLIO. ALL RIGHTS RESERVED.</span>
      </footer>
    </main>
  );
}
