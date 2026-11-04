/**
 * Conteúdo do portfólio de Higino João.
 *
 * Fontes públicas (consultadas em Novembro de 2026):
 *  - Percurso e formação: perfis profissionais públicos (LinkedIn, The Org, ZoomInfo).
 *  - Evento SEC 360º: https://sec360.ao/
 *  - Identidade visual (cores, monograma e significado): manual da marca enviado pela equipa.
 *
 * ⚠ PROVISÓRIO — textos marcados com `provisional: true` (ou com o comentário
 * «PROVISÓRIO») foram escritos pela equipa com base na área de atuação do
 * Higino e não vêm de fontes públicas. Devem ser validados por ele antes da
 * publicação. Campos de contacto vazios não são apresentados no site.
 */

export const person = {
  name: "Higino João",
  firstName: "Higino",
  lastName: "João",
  badge: "CISO · Standard Bank Angola",
  tagline: "Segurança da informação ao serviço da confiança no setor financeiro",
  // PROVISÓRIO: frase de apresentação a validar.
  heroText:
    "Mais de uma década a proteger a banca angolana — da segurança de redes à liderança da segurança da informação de instituições financeiras.",
  photo: "/higino-hero-840.webp",
  photoSmall: "/higino-hero-420.webp",
  logo: "/logo-hj.svg",
}

/**
 * Fotos que acompanham o scroll (uma por secção com `data-photo`).
 * Por agora há apenas o retrato do manual da marca; basta substituir os
 * ficheiros por fotografias em alta resolução quando existirem.
 */
export const gallery = [
  { src: "/higino-retrato.webp", position: "50% 20%" },
  { src: "/higino-retrato.webp", position: "50% 25%" },
  { src: "/higino-retrato.webp", position: "50% 30%" },
  { src: "/higino-retrato.webp", position: "50% 20%" },
]

/** Preencha para ativar os botões de contacto. */
export const contact = {
  email: "",
  linkedin: "https://www.linkedin.com/in/higinojoao/",
  website: "",
}

export const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Percurso", href: "#percurso" },
  { label: "Estratégias", href: "#estrategias" },
  { label: "Negócios", href: "#negocios" },
  { label: "Eventos", href: "#eventos" },
  { label: "Contactos", href: "#contactos" },
]

/** Três pilares logo abaixo do Hero (inspirados no manual da marca). */
export const pillars = [
  {
    number: "01",
    title: "Resiliência",
    text: "Linhas sólidas e estruturadas, como no monograma: resistir a ameaças e manter o negócio a funcionar.",
  },
  {
    number: "02",
    title: "Proteção",
    text: "Defender dados, transações e a confiança dos clientes num sistema financeiro cada vez mais digital.",
  },
  {
    number: "03",
    title: "Liderança",
    text: "Levar a segurança da informação às decisões de gestão, com governação, risco e equipas preparadas.",
  },
]

export const stats = [
  { value: 10, suffix: "+", label: "Anos em segurança da informação" },
  { value: 3, suffix: "", label: "Bancos angolanos no percurso" },
  { value: 2, suffix: "", label: "Funções de CISO" },
]
export const statsNote = "Percurso público desde 2015 (Banco Económico, Banco BCS e Standard Bank Angola)."

export const about = {
  title: "Firmeza, equilíbrio e proteção",
  paragraphs: [
    "Higino João é Chief Information Security Officer (CISO) do Standard Bank Angola, em Luanda. Construiu a carreira no setor bancário angolano: começou em 2015 como Senior Network Security no Banco Económico, onde coordenou a segurança da informação entre 2018 e 2023 e dirigiu o Gabinete de Segurança da Informação. Entre 2023 e 2024 foi CISO do Banco BCS.",
    "Antes da banca, foi consultor sénior de segurança da informação na Hiperdist. É licenciado pela Universidade Óscar Ribas.",
    "O seu monograma — as iniciais «H» e «J» em traços firmes — resume a forma como encara o trabalho: tal como no mundo digital é preciso resistir a ameaças e vulnerabilidades, enfrenta os desafios com firmeza e equilíbrio.",
  ],
  // PROVISÓRIO: competências deduzidas das funções; validar com o Higino.
  skills: [
    "Governação de segurança da informação",
    "Gestão de risco tecnológico",
    "Segurança de redes",
    "Resposta a incidentes",
    "Conformidade no setor bancário",
    "Liderança de equipas",
  ],
  location: "Luanda, Angola",
  experienceYears: 10,
}

/** Valores da marca (manual de identidade visual). */
export const brand = [
  {
    name: "Dourado",
    hex: "#D8B061",
    text: "Valor, sabedoria e persistência: uma trajetória de superação e crescimento.",
  },
  {
    name: "Preto",
    hex: "#060606",
    text: "Seriedade e profundidade, a base de quem protege informação crítica.",
  },
  {
    name: "Cinza claro",
    hex: "#E2E2E2",
    text: "Clareza e equilíbrio para comunicar temas técnicos de forma simples.",
  },
]

export const journey = [
  {
    date: "Antes de 2015",
    title: "Consultor Sénior de Segurança da Informação",
    company: "Hiperdist",
    text: "Consultoria de segurança e gestão de operações na distribuição de hardware de TI.",
  },
  {
    date: "2015 – 2018",
    title: "Senior Network Security",
    company: "Banco Económico",
    text: "Segurança da infraestrutura de rede do banco.",
  },
  {
    date: "2018 – 2023",
    title: "Information Security Officer & Coordinator",
    company: "Banco Económico",
    text: "Coordenação da segurança da informação.",
  },
  {
    date: "2023",
    title: "Diretor do Gabinete de Segurança da Informação",
    company: "Banco Económico",
    text: "Direção do gabinete responsável pela segurança da informação.",
  },
  {
    date: "2023 – 2024",
    title: "Chief Information Security Officer",
    company: "Banco BCS",
    text: "Primeira função como CISO.",
  },
  {
    date: "2024 – presente",
    title: "Chief Information Security Officer",
    company: "Standard Bank Angola",
    text: "Responsável pela segurança da informação do banco, em Luanda.",
  },
]

/**
 * PROVISÓRIO — secção «Estratégias»: abordagem proposta pela equipa com base
 * nas funções de CISO. Substituir pelos temas que o Higino defende.
 */
export const strategies = {
  provisional: true,
  title: "Segurança como estratégia de negócio",
  intro:
    "A cibersegurança deixa de ser um tema técnico quando protege a confiança dos clientes. Estes são os eixos de uma estratégia de segurança para instituições financeiras.",
  items: [
    {
      icon: "landmark",
      title: "Governação e conformidade",
      text: "Políticas, responsabilidades claras e alinhamento com a regulação do setor financeiro.",
    },
    {
      icon: "gauge",
      title: "Gestão de risco",
      text: "Identificar, medir e priorizar riscos tecnológicos segundo o impacto no negócio.",
    },
    {
      icon: "shield",
      title: "Resiliência operacional",
      text: "Deteção, resposta a incidentes e continuidade para manter os serviços disponíveis.",
    },
    {
      icon: "users",
      title: "Cultura de segurança",
      text: "Sensibilização de colaboradores e clientes contra phishing e engenharia social.",
    },
    {
      icon: "sparkles",
      title: "Transformação digital segura",
      text: "Segurança desde o desenho de novos canais digitais, cloud e pagamentos.",
    },
    {
      icon: "lock",
      title: "Proteção de dados",
      text: "Confidencialidade e integridade da informação dos clientes e das transações.",
    },
  ],
}

/**
 * PROVISÓRIO — secção «Negócios»: formas de colaboração sugeridas pela equipa.
 * Confirmar com o Higino o que pretende divulgar (e se é compatível com as
 * funções atuais) antes de publicar.
 */
export const business = {
  provisional: true,
  title: "Como podemos trabalhar juntos",
  intro:
    "Áreas em que a experiência na liderança da segurança da informação pode gerar valor para organizações e eventos.",
  items: [
    {
      title: "Palestras e painéis",
      text: "Intervenções em fóruns executivos sobre cibersegurança, risco e transformação digital.",
      tags: ["Fóruns", "Conferências", "Painéis"],
    },
    {
      title: "Aconselhamento estratégico",
      text: "Apoio a conselhos de administração e direções na definição de prioridades de segurança.",
      tags: ["Governação", "Risco", "Roadmap"],
    },
    {
      title: "Formação executiva",
      text: "Sessões para gestores sobre ameaças atuais, responsabilidades e resposta a incidentes.",
      tags: ["Gestores", "Sensibilização"],
    },
    {
      title: "Mentoria",
      text: "Acompanhamento de profissionais e equipas que estão a crescer na área de segurança.",
      tags: ["Carreira", "Equipas"],
    },
  ],
}

/** Eventos (a API, quando existir, substitui esta lista). */
export const events = [
  {
    id: "sec360-2026",
    evento: "SEC 360º Executive Cybersecurity Forum",
    data: "2026-11-13T08:00:00",
    tipo: "Orador",
    local: "HCTA, Luanda",
    status: "Confirmado",
    link: "https://sec360.ao/",
    descricao:
      "Fórum executivo, só por convite, para líderes de tecnologia, segurança, risco e transformação digital em Angola.",
    imagem: null,
  },
]
