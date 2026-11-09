
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  Eye,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Sun,
  Users,
  X,
  Zap,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import styles from "./dashboard.module.css";

type Layout = "standard" | "future" | "premium" | "dark";

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  profession: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  preferred_layout: string | null;
};

type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  cover_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
};

type DashboardProps = {
  userId: string;
  email: string;
  profile: Profile | null;
  projects: Project[];
};

const layouts: {
  id: Layout;
  name: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    id: "standard",
    name: "Padrão",
    description: "Editorial e equilibrado",
    icon: Sun,
  },
  {
    id: "future",
    name: "Future",
    description: "Tecnologia e profundidade",
    icon: Zap,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Elegância e sofisticação",
    icon: Sparkles,
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Escuro e minimalista",
    icon: Moon,
  },
];

const navigation = [
  { label: "Visão geral", icon: LayoutDashboard, href: "#inicio", section: "inicio" },
  { label: "Meu portfólio", icon: BriefcaseBusiness, href: "#portfolio", section: "portfolio" },
  { label: "Projetos", icon: FolderKanban, href: "#projetos", section: "projetos" },
  { label: "Explorar", icon: Compass, href: "#explorar", section: "explorar" },
  { label: "Conexões", icon: Users, href: "#conexoes", section: "conexoes" },
  { label: "Mensagens", icon: MessageCircle, href: "#mensagens", section: "mensagens" },
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Dashboard({
  userId,
  email,
  profile,
  projects,
}: DashboardProps) {
  const router = useRouter();

  const initialLayout = layouts.some(
    (layout) => layout.id === profile?.preferred_layout
  )
    ? (profile?.preferred_layout as Layout)
    : "standard";

  const [layout, setLayout] = useState<Layout>(initialLayout);
  const [savingLayout, setSavingLayout] = useState(false);
  const [layoutMessage, setLayoutMessage] = useState("");
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName =
    profile?.display_name?.trim() ||
    email.split("@")[0] ||
    "Novo membro";

  const firstName = displayName.split(" ")[0];
  const publishedProjects = projects.filter(
    (project) => project.status === "published"
  ).length;

  const initials = getInitials(displayName) || "W";

  async function changeLayout(nextLayout: Layout) {
    if (nextLayout === layout || savingLayout) {
      setLayoutOpen(false);
      return;
    }

    setSavingLayout(true);
    setLayoutMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("profiles")
        .update({ preferred_layout: nextLayout })
        .eq("id", userId);

      if (error) {
        console.error("Erro ao salvar layout:", error.message);
        setLayoutMessage("Não foi possível salvar sua preferência.");
        return;
      }

      setLayout(nextLayout);
      setLayoutMessage("Preferência salva.");
    } catch (error) {
      console.error("Erro ao alterar layout:", error);
      setLayoutMessage("Ocorreu um erro ao alterar o layout.");
    } finally {
      setSavingLayout(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/entrar");
      router.refresh();
    } catch (error) {
      console.error("Erro ao sair:", error);
      setLoggingOut(false);
    }
  }

  const currentLayout = layouts.find((item) => item.id === layout)!;

  return (
    <main className={`${styles.dashboard} ${styles[layout]}`} id="inicio">
      <aside
        className={`${styles.sidebar} ${
          mobileMenuOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brand}>
            workfolio<span>.</span>
          </Link>

          <button
            type="button"
            className={styles.closeMenu}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className={styles.workspaceLabel}>ESPAÇO DE TRABALHO</div>

        <nav className={styles.navigation} aria-label="Navegação principal">
          {navigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <a
                key={item.section}
                href={item.href}
                className={`${styles.navItem} ${
                  index === 0 ? styles.navActive : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.section === "mensagens" && (
                  <span className={styles.navSoon}>EM BREVE</span>
                )}
              </a>
            );
          })}
        </nav>

        <div className={styles.sidebarSpacer} />

        <div className={styles.sidebarTip}>
          <div className={styles.tipIcon}>
            <Sparkles size={17} />
          </div>
          <strong>Seu espaço, suas possibilidades.</strong>
          <p>Um bom portfólio abre portas. Comece mostrando o que você faz.</p>
          <a href="#portfolio">
            Completar meu espaço <ArrowUpRight size={14} />
          </a>
        </div>

        <div className={styles.sidebarBottom}>
          <Link href="#configuracoes" className={styles.navItem}>
            <Settings2 size={18} />
            <span>Configurações</span>
          </Link>

          <button
            type="button"
            className={styles.navItem}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={18} />
            <span>{loggingOut ? "Saindo..." : "Sair da conta"}</span>
          </button>
        </div>

        <div className={styles.sidebarUser}>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" />
          ) : (
            <span className={styles.avatarFallback}>{initials}</span>
          )}
          <div className={styles.sidebarUserInfo}>
            <strong>{displayName}</strong>
            <span>{profile?.profession || "Seu perfil profissional"}</span>
          </div>
          <ChevronDown size={15} />
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          className={styles.mobileOverlay}
          aria-label="Fechar menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <section className={styles.mainArea}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={21} />
            </button>
            <div className={styles.breadcrumb}>
              <span>Workspace</span>
              <span className={styles.breadcrumbSlash}>/</span>
              <strong>Visão geral</strong>
            </div>
          </div>

          <div className={styles.topbarActions}>
            <span className={styles.todayLabel}>
              SEU ESPAÇO PROFISSIONAL
            </span>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Pesquisar"
              title="Pesquisa em breve"
            >
              <Search size={18} />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Notificações"
              title="Notificações em breve"
            >
              <Bell size={18} />
            </button>
            <div className={styles.topAvatar}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" />
              ) : (
                initials
              )}
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <section className={styles.welcomeSection}>
            <div className={styles.welcomeCopy}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowDot} />
                SEU ESPAÇO / 2026
              </div>
              <h1>
                Olá, {firstName}.
                <br />
                <span>Vamos dar forma às suas ideias.</span>
              </h1>
              <p>
                Seu trabalho merece espaço. Organize seus projetos, fortaleça
                sua identidade e mostre ao mundo o que você sabe fazer.
              </p>
              <div className={styles.welcomeActions}>
                <a href="#projetos" className={styles.primaryButton}>
                  <Plus size={17} />
                  Novo projeto
                </a>
                <a href="#portfolio" className={styles.secondaryButton}>
                  Meu portfólio <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div className={styles.welcomeArt} aria-hidden="true">
              <div className={styles.artOrbit} />
              <div className={styles.artShape}>
                <span>W.</span>
              </div>
              <div className={styles.artFloatingOne}>
                <Sparkles size={19} />
              </div>
              <div className={styles.artFloatingTwo}>
                <span>IDEAS</span>
                <ArrowUpRight size={16} />
              </div>
              <div className={styles.artCaption}>CREATE YOUR OWN SPACE</div>
            </div>
          </section>

          <section className={styles.metricsGrid} aria-label="Resumo do perfil">
            <article className={styles.metricCard}>
              <div className={styles.metricTop}>
                <span>Projetos publicados</span>
                <FolderKanban size={18} />
              </div>
              <div className={styles.metricValue}>{publishedProjects}</div>
              <div className={styles.metricBottom}>
                <span>Do seu portfólio</span>
                <ArrowUpRight size={15} />
              </div>
            </article>

            <article className={styles.metricCard}>
              <div className={styles.metricTop}>
                <span>Total de projetos</span>
                <BriefcaseBusiness size={18} />
              </div>
              <div className={styles.metricValue}>{projects.length}</div>
              <div className={styles.metricBottom}>
                <span>Incluindo rascunhos</span>
                <ArrowDownRight size={15} />
              </div>
            </article>

            <article className={styles.metricCard}>
              <div className={styles.metricTop}>
                <span>Perfil profissional</span>
                <Activity size={18} />
              </div>
              <div className={styles.metricStatus}>
                {profile?.profession ? "Em construção" : "Comece agora"}
              </div>
              <div className={styles.metricBottom}>
                <span>Identidade profissional</span>
                <ArrowUpRight size={15} />
              </div>
            </article>

            <article className={`${styles.metricCard} ${styles.metricAccent}`}>
              <div className={styles.metricTop}>
                <span>Próximo passo</span>
                <Zap size={18} />
              </div>
              <div className={styles.metricStatus}>Mostre seu trabalho</div>
              <div className={styles.metricBottom}>
                <span>Publique seu primeiro projeto</span>
                <ArrowUpRight size={15} />
              </div>
            </article>
          </section>

          <div className={styles.sectionGrid}>
            <section className={styles.portfolioSection} id="portfolio">
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.sectionEyebrow}>SUA PRESENÇA DIGITAL</span>
                  <h2>Seu portfólio</h2>
                  <p>Um espaço para apresentar seu talento ao mundo.</p>
                </div>
                <a href="#projetos" className={styles.textLink}>
                  Ver projetos <ArrowUpRight size={15} />
                </a>
              </div>

              <div className={styles.profilePreview}>
                <div
                  className={styles.profileBanner}
                  style={
                    profile?.banner_url
                      ? { backgroundImage: `url("${profile.banner_url}")` }
                      : undefined
                  }
                >
                  <span className={styles.bannerLabel}>WORKFOLIO / PROFILE</span>
                  <span className={styles.bannerNumber}>01 — 01</span>
                </div>

                <div className={styles.profileDetails}>
                  <div className={styles.profileAvatar}>
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <div className={styles.profileIdentity}>
                    <h3>{displayName}</h3>
                    <p>{profile?.profession || "Adicione sua profissão"}</p>
                    <span>
                      {profile?.username
                        ? `@${profile.username}`
                        : "Seu nome de usuário ainda não foi definido"}
                    </span>
                  </div>
                  <a href="#configuracoes" className={styles.editProfile}>
                    Editar perfil <ArrowUpRight size={14} />
                  </a>
                </div>

                <div className={styles.profileBio}>
                  {profile?.bio || (
                    <span>
                      Sua apresentação profissional aparecerá aqui. Conte um
                      pouco sobre você, suas habilidades e o que gosta de criar.
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className={styles.layoutSection} id="configuracoes">
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.sectionEyebrow}>PERSONALIZAÇÃO</span>
                  <h2>Sua experiência</h2>
                  <p>Escolha a aparência do seu espaço.</p>
                </div>
                <Settings2 size={19} />
              </div>

              <div className={styles.currentLayout}>
                <span className={styles.currentLayoutIcon}>
                  <currentLayout.icon size={18} />
                </span>
                <div>
                  <strong>{currentLayout.name}</strong>
                  <span>{currentLayout.description}</span>
                </div>
                <span className={styles.activeCheck}>
                  <Check size={14} />
                </span>
              </div>

              <button
                type="button"
                className={styles.layoutToggle}
                onClick={() => setLayoutOpen(!layoutOpen)}
                aria-expanded={layoutOpen}
              >
                {layoutOpen ? "Fechar opções" : "Explorar layouts"}
                <ChevronDown
                  size={16}
                  className={layoutOpen ? styles.chevronOpen : ""}
                />
              </button>

              {layoutOpen && (
                <div className={styles.layoutOptions}>
                  {layouts.map((item) => {
                    const Icon = item.icon;
                    const selected = layout === item.id;

                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`${styles.layoutOption} ${
                          selected ? styles.layoutOptionSelected : ""
                        }`}
                        onClick={() => changeLayout(item.id)}
                        disabled={savingLayout}
                      >
                        <span className={styles.optionIcon}>
                          <Icon size={17} />
                        </span>
                        <span className={styles.optionText}>
                          <strong>{item.name}</strong>
                          <small>{item.description}</small>
                        </span>
                        {selected && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
              )}

              {savingLayout && (
                <p className={styles.layoutFeedback}>Salvando preferência...</p>
              )}
              {layoutMessage && (
                <p className={styles.layoutFeedback} role="status">
                  {layoutMessage}
                </p>
              )}

              <div className={styles.layoutFootnote}>
                <CircleHelp size={15} />
                <span>Seu layout fica salvo na sua conta.</span>
              </div>
            </section>
          </div>

          <section className={styles.projectsSection} id="projetos">
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.sectionEyebrow}>SEU TRABALHO EM DESTAQUE</span>
                <h2>Projetos recentes</h2>
                <p>Seus trabalhos, experiências e ideias reunidos em um só lugar.</p>
              </div>
              <a href="#portfolio" className={styles.textLink}>
                Meu portfólio <ArrowUpRight size={15} />
              </a>
            </div>

            {projects.length > 0 ? (
              <div className={styles.projectGrid}>
                {projects.map((project, index) => (
                  <article className={styles.projectCard} key={project.id}>
                    <div className={styles.projectCover}>
                      {project.cover_url ? (
                        <img src={project.cover_url} alt="" />
                      ) : (
                        <div className={`${styles.projectPlaceholder} ${styles[`placeholder${index % 3}`]}`}>
                          <span>W / {String(index + 1).padStart(2, "0")}</span>
                          <FolderKanban size={30} />
                        </div>
                      )}
                      <span className={styles.projectStatus}>
                        {project.status === "published" ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                    <div className={styles.projectInfo}>
                      <div>
                        <h3>{project.title}</h3>
                        <p>{project.category || "Projeto criativo"}</p>
                      </div>
                      <ArrowUpRight size={17} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.emptyProjects}>
                <div className={styles.emptyIcon}>
                  <FolderKanban size={23} />
                </div>
                <div className={styles.emptyCopy}>
                  <h3>Seu primeiro projeto começa aqui.</h3>
                  <p>
                    Apresente um trabalho, conte como ele foi criado e construa
                    um portfólio que represente seu potencial.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.emptyAction}
                  onClick={() => {
                    document.getElementById("portfolio")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Preparar meu portfólio <ArrowRight size={16} />
                </button>
              </div>
            )}
          </section>

          <footer className={styles.footer}>
            <span>© {new Date().getFullYear()} Workfolio</span>
            <span>Seu trabalho. Sua identidade. Suas conexões.</span>
            <span>Feito para quem cria.</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
