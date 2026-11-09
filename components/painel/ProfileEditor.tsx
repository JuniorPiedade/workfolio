
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Check,
  ChevronDown,
  ExternalLink,
  ImagePlus,
  Instagram,
  Linkedin,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  Upload,
  UserRound,
  X,
  Globe,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import styles from "./profile-editor.module.css";

type Proficiency = "beginner" | "intermediate" | "advanced" | "expert";

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  profession: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  location: string | null;
  website: string | null;
  is_available_for_work: boolean | null;
};

type Skill = {
  name: string;
  proficiency: Proficiency;
  position: number;
};

type Social = {
  platform: string;
  url: string;
  position: number;
};

type Props = {
  userId: string;
  email: string;
  profile: Profile | null;
  initialSkills: Skill[];
  initialSocials: Social[];
};

const proficiencyOptions: { value: Proficiency; label: string }[] = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
  { value: "expert", label: "Especialista" },
];

const socialOptions = [
  "LinkedIn",
  "GitHub",
  "Behance",
  "Instagram",
  "Dribbble",
  "YouTube",
  "X",
  "Outro",
];

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9._-]/g, "");
}

function validWebUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`
    );

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeWebUrl(value: string) {
  if (!value.trim()) return "";
  return /^https?:\/\//i.test(value) ? value.trim() : `https://${value.trim()}`;
}

function friendlyError(message: string) {
  const value = message.toLowerCase();

  if (value.includes("duplicate key") || value.includes("unique")) {
    return "Este nome de usuário já está sendo utilizado. Escolha outro.";
  }

  if (value.includes("row-level security") || value.includes("permission")) {
    return "A alteração não foi autorizada. Confira sua sessão e tente novamente.";
  }

  if (value.includes("failed to fetch")) {
    return "Não foi possível conectar ao servidor. Verifique sua internet.";
  }

  return "Não foi possível salvar todas as alterações. Tente novamente.";
}

export default function ProfileEditor({
  userId,
  email,
  profile,
  initialSkills,
  initialSocials,
}: Props) {
  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [profession, setProfession] = useState(profile?.profession ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [website, setWebsite] = useState(profile?.website ?? "");
  const [available, setAvailable] = useState(
    profile?.is_available_for_work ?? false
  );

  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [bannerUrl, setBannerUrl] = useState(profile?.banner_url ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [skills, setSkills] = useState<Skill[]>(
    initialSkills.map((skill) => ({
      ...skill,
      proficiency: proficiencyOptions.some(
        (option) => option.value === skill.proficiency
      )
        ? skill.proficiency
        : "intermediate",
    }))
  );

  const [socials, setSocials] = useState<Social[]>(
    initialSocials.map((social) => ({ ...social }))
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("identity");

  function handleImage(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner"
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Utilize uma imagem JPG, PNG ou WebP.");
      event.target.value = "";
      return;
    }

    const maxSize = type === "avatar" ? 5 : 8;

    if (file.size > maxSize * 1024 * 1024) {
      setError(`A imagem deve ter no máximo ${maxSize} MB.`);
      event.target.value = "";
      return;
    }

    const preview = URL.createObjectURL(file);

    if (type === "avatar") {
      setAvatarFile(file);
      setAvatarUrl(preview);
    } else {
      setBannerFile(file);
      setBannerUrl(preview);
    }

    setError("");
    event.target.value = "";
  }

  function updateSkill(index: number, changes: Partial<Skill>) {
    setSkills((current) =>
      current.map((skill, itemIndex) =>
        itemIndex === index ? { ...skill, ...changes } : skill
      )
    );
  }

  function addSkill() {
    if (skills.length >= 12) return;

    setSkills((current) => [
      ...current,
      {
        name: "",
        proficiency: "intermediate",
        position: current.length,
      },
    ]);
  }

  function removeSkill(index: number) {
    setSkills((current) =>
      current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((skill, position) => ({ ...skill, position }))
    );
  }

  function updateSocial(index: number, changes: Partial<Social>) {
    setSocials((current) =>
      current.map((social, itemIndex) =>
        itemIndex === index ? { ...social, ...changes } : social
      )
    );
  }

  function addSocial() {
    if (socials.length >= 8) return;

    setSocials((current) => [
      ...current,
      { platform: "LinkedIn", url: "", position: current.length },
    ]);
  }

  function removeSocial(index: number) {
    setSocials((current) =>
      current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((social, position) => ({ ...social, position }))
    );
  }

  async function uploadImage(
    supabase: ReturnType<typeof createClient>,
    bucket: "profile-avatars" | "profile-banners",
    file: File,
    path: string
  ) {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: "3600",
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanUsername = normalizeUsername(username);

    if (displayName.trim().length < 2) {
      setError("Informe seu nome com pelo menos 2 caracteres.");
      return;
    }

    if (!/^[a-z0-9][a-z0-9._-]{2,23}$/.test(cleanUsername)) {
      setError(
        "O nome de usuário deve ter de 3 a 24 caracteres e usar letras, números, ponto, hífen ou underline."
      );
      return;
    }

    if (bio.length > 500) {
      setError("Sua biografia deve ter no máximo 500 caracteres.");
      return;
    }

    if (!validWebUrl(website)) {
      setError("Informe um endereço válido para seu site.");
      return;
    }

    const cleanSkills = skills
      .map((skill) => ({
        name: skill.name.trim().slice(0, 50),
        proficiency: skill.proficiency,
      }))
      .filter((skill) => skill.name.length > 0);

    const cleanSocials = socials
      .map((social) => ({
        platform: social.platform.trim().slice(0, 40),
        url: normalizeWebUrl(social.url),
      }))
      .filter((social) => social.url.length > 0);

    if (cleanSkills.length > 12) {
      setError("Você pode cadastrar até 12 habilidades.");
      return;
    }

    if (cleanSocials.length > 8) {
      setError("Você pode cadastrar até 8 redes sociais.");
      return;
    }

    if (cleanSocials.some((social) => !validWebUrl(social.url))) {
      setError("Um dos links sociais não possui um endereço válido.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user || authData.user.id !== userId) {
        setError("Sua sessão expirou. Entre novamente para continuar.");
        return;
      }

      let nextAvatarUrl = profile?.avatar_url ?? null;
      let nextBannerUrl = profile?.banner_url ?? null;

      if (avatarFile) {
        nextAvatarUrl = await uploadImage(
          supabase,
          "profile-avatars",
          avatarFile,
          `${userId}/avatar`
        );
      }

      if (bannerFile) {
        nextBannerUrl = await uploadImage(
          supabase,
          "profile-banners",
          bannerFile,
          `${userId}/banner`
        );
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          username: cleanUsername,
          profession: profession.trim().slice(0, 100) || null,
          bio: bio.trim() || null,
          location: location.trim().slice(0, 100) || null,
          website: normalizeWebUrl(website) || null,
          avatar_url: nextAvatarUrl,
          banner_url: nextBannerUrl,
          is_available_for_work: available,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      const { error: deleteSkillsError } = await supabase
        .from("profile_skills")
        .delete()
        .eq("user_id", userId);

      if (deleteSkillsError) throw deleteSkillsError;

      if (cleanSkills.length > 0) {
        const { error: insertSkillsError } = await supabase
          .from("profile_skills")
          .insert(
            cleanSkills.map((skill, position) => ({
              user_id: userId,
              name: skill.name,
              proficiency: skill.proficiency,
              position,
            }))
          );

        if (insertSkillsError) throw insertSkillsError;
      }

      const { error: deleteSocialsError } = await supabase
        .from("social_links")
        .delete()
        .eq("user_id", userId);

      if (deleteSocialsError) throw deleteSocialsError;

      if (cleanSocials.length > 0) {
        const { error: insertSocialsError } = await supabase
          .from("social_links")
          .insert(
            cleanSocials.map((social, position) => ({
              user_id: userId,
              platform: social.platform,
              url: social.url,
              position,
            }))
          );

        if (insertSocialsError) throw insertSocialsError;
      }

      setAvatarFile(null);
      setBannerFile(null);
      setMessage("Seu perfil foi atualizado com sucesso.");
    } catch (saveError) {
      console.error("Workfolio — erro ao salvar perfil:", saveError);
      setError(
        saveError instanceof Error
          ? friendlyError(saveError.message)
          : "Não foi possível salvar seu perfil. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  }

  const publicProfileUrl = username
    ? `/u/${normalizeUsername(username)}`
    : "";

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/painel" className={styles.brand}>
          workfolio<span>.</span>
        </Link>

        <div className={styles.topbarRight}>
          <span className={styles.topbarEmail}>{email}</span>
          <Link href="/painel" className={styles.backLink}>
            <ArrowLeft size={15} /> Voltar ao painel
          </Link>
        </div>
      </header>

      <div className={styles.pageContent}>
        <div className={styles.pageIntro}>
          <div>
            <span className={styles.eyebrow}>IDENTIDADE PROFISSIONAL / 01</span>
            <h1>Seu perfil. Sua assinatura.</h1>
            <p>
              Conte sua história, apresente suas competências e construa uma
              presença profissional que tenha a sua personalidade.
            </p>
          </div>

          <div className={styles.introMark}>W<span>.</span></div>
        </div>

        <div className={styles.editorLayout}>
          <aside className={styles.editorNav}>
            <span className={styles.navTitle}>EDITAR PERFIL</span>

            {[
              { id: "identity", label: "Identidade", icon: UserRound },
              { id: "about", label: "Apresentação", icon: ImagePlus },
              { id: "skills", label: "Competências", icon: Check },
              { id: "social", label: "Presença digital", icon: Globe },
              { id: "availability", label: "Disponibilidade", icon: ArrowUpRight },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className={`${styles.navLink} ${
                    activeSection === item.id ? styles.navLinkActive : ""
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}

            <div className={styles.navNote}>
              <span>SEU ESPAÇO, SUA IDENTIDADE</span>
              <p>
                Um perfil completo ajuda as pessoas a entenderem seu trabalho
                e encontrarem você.
              </p>
            </div>
          </aside>

          <form className={styles.form} onSubmit={handleSave}>
            <section className={styles.formSection} id="identity">
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.sectionNumber}>01 / IDENTIDADE</span>
                  <h2>Como as pessoas encontram você.</h2>
                  <p>Comece pelos elementos que representam sua identidade.</p>
                </div>
                <UserRound size={21} />
              </div>

              <div className={styles.bannerUpload}>
                {bannerUrl ? (
                  <img src={bannerUrl} alt="Prévia da imagem de capa" />
                ) : (
                  <div className={styles.bannerPlaceholder}>
                    <ImagePlus size={24} />
                    <span>Sua imagem de capa</span>
                    <small>Uma imagem que represente seu universo criativo.</small>
                  </div>
                )}

                <button
                  type="button"
                  className={styles.bannerButton}
                  onClick={() => bannerInput.current?.click()}
                >
                  <Camera size={15} /> Alterar capa
                </button>

                <input
                  ref={bannerInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={(event) => handleImage(event, "banner")}
                />
              </div>

              <div className={styles.avatarRow}>
                <div className={styles.avatarUpload}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Prévia da foto de perfil" />
                  ) : (
                    <UserRound size={29} />
                  )}
                  <button
                    type="button"
                    aria-label="Alterar foto de perfil"
                    onClick={() => avatarInput.current?.click()}
                  >
                    <Camera size={14} />
                  </button>
                  <input
                    ref={avatarInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    onChange={(event) => handleImage(event, "avatar")}
                  />
                </div>

                <div>
                  <strong>Sua foto de perfil</strong>
                  <span>JPG, PNG ou WebP · Máximo de 5 MB</span>
                </div>
              </div>

              <div className={styles.fieldsGrid}>
                <label className={styles.field}>
                  <span>Nome de exibição</span>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    maxLength={100}
                    minLength={2}
                    required
                    placeholder="Seu nome"
                  />
                </label>

                <label className={styles.field}>
                  <span>Nome de usuário</span>
                  <div className={styles.usernameInput}>
                    <span>@</span>
                    <input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      maxLength={24}
                      minLength={3}
                      required
                      placeholder="seunome"
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                  </div>
                  <small>3 a 24 caracteres. Letras, números, ponto, hífen e underline.</small>
                </label>

                <label className={styles.field}>
                  <span>Profissão ou área de atuação</span>
                  <input
                    value={profession}
                    onChange={(event) => setProfession(event.target.value)}
                    maxLength={100}
                    placeholder="Ex.: Designer de produto"
                  />
                </label>

                <label className={styles.field}>
                  <span>Localização</span>
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    maxLength={100}
                    placeholder="Ex.: Salvador, Bahia"
                  />
                </label>
              </div>
            </section>

            <section className={styles.formSection} id="about">
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.sectionNumber}>02 / APRESENTAÇÃO</span>
                  <h2>Apresente seu universo.</h2>
                  <p>Uma boa apresentação mostra o que move seu trabalho.</p>
                </div>
                <ImagePlus size={21} />
              </div>

              <label className={styles.field}>
                <span>Biografia profissional</span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={500}
                  rows={5}
                  placeholder="Fale sobre sua trajetória, seus interesses, suas especialidades e o que gosta de criar..."
                />
                <small className={styles.counter}>{bio.length}/500</small>
              </label>

              <label className={styles.field}>
                <span>Site ou página pessoal</span>
                <div className={styles.urlInput}>
                  <Globe size={16} />
                  <input
                    type="text"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    maxLength={300}
                    placeholder="seusite.com"
                  />
                </div>
              </label>
            </section>

            <section className={styles.formSection} id="skills">
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.sectionNumber}>03 / COMPETÊNCIAS</span>
                  <h2>O que você sabe fazer.</h2>
                  <p>Mostre suas habilidades e seu nível de domínio.</p>
                </div>
                <Check size={21} />
              </div>

              <div className={styles.skillList}>
                {skills.map((skill, index) => (
                  <div className={styles.skillRow} key={index}>
                    <input
                      value={skill.name}
                      onChange={(event) =>
                        updateSkill(index, { name: event.target.value })
                      }
                      placeholder="Ex.: Figma, React, Fotografia..."
                      maxLength={50}
                      aria-label={`Habilidade ${index + 1}`}
                    />

                    <div className={styles.selectWrap}>
                      <select
                        value={skill.proficiency}
                        onChange={(event) =>
                          updateSkill(index, {
                            proficiency: event.target.value as Proficiency,
                          })
                        }
                        aria-label="Nível de domínio"
                      >
                        {proficiencyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} />
                    </div>

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeSkill(index)}
                      aria-label="Remover habilidade"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={styles.addButton}
                onClick={addSkill}
                disabled={skills.length >= 12}
              >
                <Plus size={15} /> Adicionar habilidade
                <span>{skills.length}/12</span>
              </button>
            </section>

            <section className={styles.formSection} id="social">
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.sectionNumber}>04 / PRESENÇA DIGITAL</span>
                  <h2>Conecte seus espaços.</h2>
                  <p>Reúna outros lugares onde as pessoas podem conhecer seu trabalho.</p>
                </div>
                <ExternalLink size={21} />
              </div>

              <div className={styles.socialList}>
                {socials.map((social, index) => (
                  <div className={styles.socialRow} key={index}>
                    <div className={styles.socialPlatform}>
                      {social.platform === "LinkedIn" ? (
                        <Linkedin size={17} />
                      ) : social.platform === "Instagram" ? (
                        <Instagram size={17} />
                      ) : (
                        <Globe size={17} />
                      )}
                      <select
                        value={social.platform}
                        onChange={(event) =>
                          updateSocial(index, { platform: event.target.value })
                        }
                        aria-label="Plataforma"
                      >
                        {socialOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      value={social.url}
                      onChange={(event) =>
                        updateSocial(index, { url: event.target.value })
                      }
                      placeholder="https://..."
                      maxLength={300}
                      aria-label={`Endereço ${social.platform}`}
                    />

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeSocial(index)}
                      aria-label="Remover rede social"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={styles.addButton}
                onClick={addSocial}
                disabled={socials.length >= 8}
              >
                <Plus size={15} /> Adicionar rede social
                <span>{socials.length}/8</span>
              </button>
            </section>

            <section className={styles.formSection} id="availability">
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.sectionNumber}>05 / DISPONIBILIDADE</span>
                  <h2>Novas possibilidades.</h2>
                  <p>Informe se está aberto a oportunidades profissionais.</p>
                </div>
                <ArrowUpRight size={21} />
              </div>

              <label className={styles.availabilityCard}>
                <span className={styles.availabilityCopy}>
                  <strong>Disponível para oportunidades</strong>
                  <small>
                    Mostre no seu perfil que está aberto a propostas e colaborações.
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(event) => setAvailable(event.target.checked)}
                />
                <span className={styles.switchVisual} />
              </label>
            </section>

            {error && (
              <div className={styles.feedbackError} role="alert">
                <X size={17} /> {error}
              </div>
            )}

            {message && (
              <div className={styles.feedbackSuccess} role="status">
                <Check size={17} /> {message}
              </div>
            )}

            <div className={styles.formActions}>
              <Link href="/painel" className={styles.cancelButton}>
                Cancelar
              </Link>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <LoaderCircle size={17} className={styles.spinner} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={17} /> Salvar alterações
                  </>
                )}
              </button>
            </div>
          </form>

          <aside className={styles.previewColumn}>
            <div className={styles.previewSticky}>
              <div className={styles.previewHeading}>
                <span>PRÉ-VISUALIZAÇÃO</span>
                <span className={styles.liveDot}>AO VIVO</span>
              </div>

              <div className={styles.previewCard}>
                <div className={styles.previewBanner}>
                  {bannerUrl && <img src={bannerUrl} alt="" />}
                  <span>WORKFOLIO / PROFILE</span>
                </div>

                <div className={styles.previewBody}>
                  <div className={styles.previewAvatar}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" />
                    ) : (
                      <UserRound size={28} />
                    )}
                  </div>

                  <h3>{displayName || "Seu nome"}</h3>
                  <p className={styles.previewProfession}>
                    {profession || "Sua profissão"}
                  </p>
                  <span className={styles.previewUsername}>
                    @{normalizeUsername(username) || "seunome"}
                  </span>

                  <p className={styles.previewBio}>
                    {bio || "Sua apresentação profissional aparecerá aqui."}
                  </p>

                  {location && (
                    <span className={styles.previewLocation}>{location}</span>
                  )}

                  {available && (
                    <span className={styles.previewAvailable}>
                      <span /> Aberto a oportunidades
                    </span>
                  )}

                  {skills.some((skill) => skill.name.trim()) && (
                    <div className={styles.previewSkills}>
                      {skills
                        .filter((skill) => skill.name.trim())
                        .slice(0, 5)
                        .map((skill, index) => (
                          <span key={index}>{skill.name}</span>
                        ))}
                    </div>
                  )}

                  {website && (
                    <span className={styles.previewWebsite}>
                      <Globe size={13} /> {website.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>

                <div className={styles.previewFooter}>
                  <span>SEU TRABALHO. SUA IDENTIDADE.</span>
                  <span>W.</span>
                </div>
              </div>

              <div className={styles.previewNote}>
                <Check size={15} />
                <p>
                  As alterações na prévia aparecem enquanto você edita. Elas só
                  serão publicadas no seu perfil depois de salvar.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
