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
    title: "A beleza das formas",
    category: "DIREÇÃO DE ARTE · IDENTIDADE VISUAL",
    creator: "Estúdio Nō",
    image:
      "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1200&q=85",
    className: "project-large"
  },
  {
    number: "02",
    title: "Novos pontos de vista",
    category: "DESIGN DIGITAL",
    creator: "Marina Costa",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=85",
    className: "project-small"
  },
  {
    number: "03",
    title: "Além do convencional",
    category: "3D · EXPERIMENTAL",
    creator: "Alex Morgan",
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=85",
    className: "project-small"
  },
  {
    number: "04",
    title: "Design que desperta sensações",
    category: "IDENTIDADE VISUAL",
    creator: "Ateliê Forma",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=85",
    className: "project-large"
  }
];

const disciplines = [
  "Design gráfico",
  "Desenvolvimento",
  "Direção de arte",
  "Motion design",
  "Fotografia",
  "Modelagem 3D",
  "Design de interfaces",
  "Tecnologia criativa"
];

export default function Home() {
  return (
    <main id="top">
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="Workfolio, início">
          workfolio<span className="wordmark-dot">.</span>
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#explore">Explorar</a>
          <a href="#manifesto">Nossa ideia</a>
          <a href="#disciplines">Áreas criativas</a>
        </nav>

        <a href="#community" className="header-cta">
          Conheça o Workfolio <ArrowUpRight size={15} />
        </a>

        <a href="#explore" className="mobile-menu" aria-label="Ir para projetos">
          <ArrowDown size={20} />
        </a>
      </header>

      <section className="hero">
        <div className="hero-topline">
          <span>UMA NOVA REDE PARA QUEM CRIA</span>
          <span className="hero-location">
            <span className="status-dot" />
            UM ESPAÇO PARA IDEIAS E CONEXÕES
          </span>
        </div>

        <div className="hero-content">
          <h1>
            Seu trabalho.
            <br />
            Sua <span className="outline-text">identidade.</span>
            <br />
            Suas conexões<span className="accent-period">.</span>
          </h1>

          <div className="hero-aside">
            <Asterisk className="hero-asterisk" strokeWidth={1} />
            <p>
              Muito além de um portfólio.
              <br />
              Um espaço para apresentar seu trabalho, fortalecer sua presença
              profissional e se conectar com quem também faz acontecer.
            </p>
            <a href="#explore" className="text-link">
              Descubra o Workfolio <ArrowDown size={15} />
            </a>
          </div>
        </div>

        <div className="hero-bottom">
          <span>DESIGN. TECNOLOGIA. CRIATIVIDADE.</span>
          <span>FEITO PARA QUEM TRANSFORMA IDEIAS EM PROJETOS.</span>
        </div>
      </section>

      <section className="featured-section" id="explore">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / PROJETOS EM DESTAQUE</span>
            <h2>
              Ideias que ganham
              <br />
              <span className="serif-italic">forma.</span>
            </h2>
          </div>

          <div className="section-intro">
            <p>
              Projetos, experimentos e criações que revelam o potencial de
              profissionais que transformam ideias em realidade.
            </p>
            <span className="project-count">
              UM OLHAR SOBRE O UNIVERSO CRIATIVO
            </span>
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
                  alt={`Imagem ilustrativa do projeto ${project.title}`}
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
          <span>UM ESPAÇO ABERTO À CRIATIVIDADE</span>
          <span>01 — 04</span>
        </div>
      </section>

      <section className="manifesto-section" id="manifesto">
        <div className="manifesto-top">
          <span className="eyebrow">02 / NOSSA IDEIA</span>
          <span className="manifesto-symbol">W.</span>
        </div>

        <div className="manifesto-content">
          <h2>
            Seu talento merece
            <br />
            <span className="serif-italic">mais do que um link.</span>
          </h2>

          <div className="manifesto-copy">
            <p>
              O trabalho criativo está espalhado por diferentes plataformas,
              perfis e arquivos. Sua trajetória merece um lugar que reúna tudo
              isso com intenção.
            </p>
            <p>
              O Workfolio nasce para aproximar portfólio, identidade
              profissional e comunidade em uma experiência criada para quem
              faz.
            </p>
          </div>
        </div>

        <div className="manifesto-bottom">
          <span>MAIS DO QUE AQUILO QUE VOCÊ FAZ.</span>
          <span>QUEM VOCÊ É E ATÉ ONDE PODE CHEGAR.</span>
        </div>
      </section>

      <section className="disciplines-section" id="disciplines">
        <div className="disciplines-heading">
          <span className="eyebrow">03 / DIFERENTES TALENTOS, UM SÓ ESPAÇO</span>
          <h2>
            Muitas formas
            <br />
            <span className="serif-italic">de criar.</span>
          </h2>
          <p>
            Não importa a ferramenta, a linguagem ou o caminho. Existe espaço
            para diferentes formas de criar e transformar ideias.
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
          <span className="eyebrow">04 / O PRÓXIMO CAPÍTULO</span>
          <h2>
            Mostre seu trabalho.
            <br />
            <span className="serif-italic">Amplie seus horizontes.</span>
          </h2>
          <p>
            Estamos construindo um novo espaço para profissionais que vivem de
            ideias, projetos e possibilidades.
          </p>
          <span className="coming-soon">
            <span className="status-dot" />
            WORKFOLIO EM DESENVOLVIMENTO
          </span>
        </div>

        <div className="community-bottom">
          <span>SUA PRÓXIMA CONEXÃO PODE COMEÇAR AQUI.</span>
          <span>WORKFOLIO® 2026</span>
        </div>
      </section>

      <footer className="site-footer">
        <a href="#top" className="wordmark footer-wordmark">
          workfolio<span className="wordmark-dot">.</span>
        </a>

        <span className="footer-description">
          Seu trabalho. Sua identidade. Suas conexões.
        </span>

        <a href="#top" className="back-to-top">
          Voltar ao topo <ArrowUpRight size={15} />
        </a>

        <span className="copyright">
          © 2026 WORKFOLIO. TODOS OS DIREITOS RESERVADOS.
        </span>
      </footer>
    </main>
  );
}
