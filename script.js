// PrismaTech Code Academy - Sistema de Gestão de Aulas
// Versão 3.0 - Redesign Profissional

// ==========================================
// CONFIGURAÇÕES DE REMUNERAÇÃO
// ==========================================

const REMUNERACAO_CONFIG = {
    horaAulaBase: 27.00,           // R$ 27,00 por hora-aula
    bonificacaoPercent: 33,        // 33% de bonificação quando aplicável
    horaAulaComBonificacao: 35.91, // R$ 35,91 com bonificação
    retencaoPercent: 80            // 80% de retenção
};

// ==========================================
// DADOS DOS MÓDULOS E CONTEÚDOS DAS AULAS
// ==========================================

const aulaConteudo = {
    canva: {
        nome: "Canva",
        cor: "#00c4cc",
        professor: "Malu",
        nivel: "L1",
        totalAulas: 12,
        aulas: [
            {
                numero: 1,
                titulo: "Introdução ao Canva",
                topicos: [
                    "O que é Canva e suas aplicações",
                    "Criando sua conta gratuita",
                    "Interface e navegação básica",
                    "Tipos de projetos disponíveis",
                    "Exercício prático: Primeiro design"
                ],
                duracao: "2h30min"
            },
            {
                numero: 2,
                titulo: "Elementos Básicos de Design",
                topicos: [
                    "Trabalhando com textos",
                    "Fontes e tipografia",
                    "Cores e paletas",
                    "Formas e elementos gráficos",
                    "Exercício: Cartão de visita"
                ],
                duracao: "2h30min"
            },
            {
                numero: 3,
                titulo: "Imagens e Recursos Visuais",
                topicos: [
                    "Upload e inserção de imagens",
                    "Biblioteca de imagens do Canva",
                    "Filtros e efeitos",
                    "Recorte e ajustes de imagem",
                    "Exercício: Post para redes sociais"
                ],
                duracao: "2h30min"
            },
            {
                numero: 4,
                titulo: "Templates e Personalização",
                topicos: [
                    "Explorando templates prontos",
                    "Customizando templates",
                    "Criando do zero vs usar template",
                    "Salvando designs como templates",
                    "Exercício: Flyer de evento"
                ],
                duracao: "2h30min"
            },
            {
                numero: 5,
                titulo: "Design para Redes Sociais",
                topicos: [
                    "Tamanhos para Instagram, Facebook, LinkedIn",
                    "Stories e posts",
                    "Carrosséis e grids",
                    "Identidade visual nas redes",
                    "Exercício: Kit para Instagram"
                ],
                duracao: "2h30min"
            },
            {
                numero: 6,
                titulo: "Apresentações no Canva",
                topicos: [
                    "Criando apresentações profissionais",
                    "Slides mestres e consistência",
                    "Animações e transições",
                    "Apresentação interativa",
                    "Exercício: Pitch deck"
                ],
                duracao: "2h30min"
            },
            {
                numero: 7,
                titulo: "Documentos e Materiais Impressos",
                topicos: [
                    "Currículos e portfólios",
                    "Relatórios e documentos",
                    "Panfletos e folders",
                    "Cartazes e banners",
                    "Exercício: Currículo profissional"
                ],
                duracao: "2h30min"
            },
            {
                numero: 8,
                titulo: "Vídeos e Animações",
                topicos: [
                    "Criando vídeos no Canva",
                    "Animações de elementos",
                    "Música e áudio",
                    "Transições de vídeo",
                    "Exercício: Vídeo promocional"
                ],
                duracao: "2h30min"
            },
            {
                numero: 9,
                titulo: "Brand Kit e Identidade Visual",
                topicos: [
                    "Criando kit de marca",
                    "Paleta de cores da marca",
                    "Fontes corporativas",
                    "Logos e elementos de marca",
                    "Exercício: Manual de identidade"
                ],
                duracao: "2h30min"
            },
            {
                numero: 10,
                titulo: "Colaboração e Trabalho em Equipe",
                topicos: [
                    "Compartilhamento de designs",
                    "Trabalho colaborativo",
                    "Comentários e feedback",
                    "Permissões e acesso",
                    "Exercício: Projeto em equipe"
                ],
                duracao: "2h30min"
            },
            {
                numero: 11,
                titulo: "Recursos Avançados",
                topicos: [
                    "Canva Apps e integrações",
                    "Gráficos e infográficos",
                    "Mockups e apresentação de projetos",
                    "Recursos Pro vs Gratuito",
                    "Exercício: Infográfico completo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 12,
                titulo: "Projeto Final e Portfólio",
                topicos: [
                    "Planejamento do projeto final",
                    "Criação de portfólio completo",
                    "Exportação e formatos",
                    "Apresentação dos projetos",
                    "Dicas profissionais e mercado"
                ],
                duracao: "2h30min"
            }
        ]
    },

    figma: {
        nome: "Figma",
        cor: "#a259ff",
        professor: "Malu",
        nivel: "L1",
        totalAulas: 12,
        aulas: [
            {
                numero: 1,
                titulo: "Introdução ao Figma",
                topicos: [
                    "O que é Figma e suas vantagens",
                    "Criando conta e primeiros passos",
                    "Interface e ferramentas básicas",
                    "Diferenças entre Figma e outras ferramentas",
                    "Exercício prático: Primeiro arquivo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 2,
                titulo: "Fundamentos de Design no Figma",
                topicos: [
                    "Frames e artboards",
                    "Shapes e vetores",
                    "Propriedades e transformações",
                    "Cores e gradientes",
                    "Exercício: Composição básica"
                ],
                duracao: "2h30min"
            },
            {
                numero: 3,
                titulo: "Trabalhando com Textos",
                topicos: [
                    "Ferramentas de texto",
                    "Tipografia e hierarquia",
                    "Text styles e reutilização",
                    "Fontes customizadas",
                    "Exercício: Tipografia responsiva"
                ],
                duracao: "2h30min"
            },
            {
                numero: 4,
                titulo: "Componentes e Instâncias",
                topicos: [
                    "Criando componentes",
                    "Instâncias e variantes",
                    "Propriedades de componente",
                    "Nested components",
                    "Exercício: Botões componentizados"
                ],
                duracao: "2h30min"
            },
            {
                numero: 5,
                titulo: "Auto Layout",
                topicos: [
                    "Conceitos de Auto Layout",
                    "Padding e spacing",
                    "Direção e alinhamento",
                    "Responsive design",
                    "Exercício: Cards responsivos"
                ],
                duracao: "2h30min"
            },
            {
                numero: 6,
                titulo: "Prototipação",
                topicos: [
                    "Ligando frames",
                    "Interações e transições",
                    "Animações e smart animate",
                    "Overlays e modais",
                    "Exercício: Protótipo interativo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 7,
                titulo: "Design System",
                topicos: [
                    "O que é design system",
                    "Color styles e text styles",
                    "Effect styles",
                    "Organizando bibliotecas",
                    "Exercício: Mini design system"
                ],
                duracao: "2h30min"
            },
            {
                numero: 8,
                titulo: "Plugins e Recursos",
                topicos: [
                    "Plugins essenciais",
                    "Unsplash e recursos de imagem",
                    "Icons e ilustrações",
                    "Content Reel para mock data",
                    "Exercício: Usando plugins"
                ],
                duracao: "2h30min"
            },
            {
                numero: 9,
                titulo: "Colaboração e Versionamento",
                topicos: [
                    "Compartilhamento de arquivos",
                    "Comentários e feedback",
                    "Version history",
                    "Branching e merging",
                    "Exercício: Trabalho colaborativo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 10,
                titulo: "Mobile Design",
                topicos: [
                    "Constraints e responsividade",
                    "Design para iOS e Android",
                    "Safe areas",
                    "Guidelines mobile",
                    "Exercício: App mobile"
                ],
                duracao: "2h30min"
            },
            {
                numero: 11,
                titulo: "Handoff para Desenvolvimento",
                topicos: [
                    "Dev Mode",
                    "Inspeção de código",
                    "Export de assets",
                    "Documentação técnica",
                    "Exercício: Preparar handoff"
                ],
                duracao: "2h30min"
            },
            {
                numero: 12,
                titulo: "Projeto Final Figma",
                topicos: [
                    "Website ou app completo",
                    "Design system aplicado",
                    "Protótipo funcional",
                    "Apresentação do projeto",
                    "Dicas profissionais e portfolio"
                ],
                duracao: "2h30min"
            }
        ]
    },

    excel: {
        nome: "Excel",
        cor: "#217346",
        professor: "Malu",
        nivel: "L1",
        totalAulas: 12,
        aulas: [
            {
                numero: 1,
                titulo: "Introdução ao Excel",
                topicos: [
                    "Interface e navegação",
                    "Células, linhas e colunas",
                    "Inserir e formatar dados",
                    "Salvar e abrir arquivos",
                    "Exercício prático inicial"
                ],
                duracao: "2h30min"
            },
            {
                numero: 2,
                titulo: "Formatação Básica",
                topicos: [
                    "Formatação de células",
                    "Estilos e temas",
                    "Mesclar células",
                    "Bordas e preenchimento",
                    "Exercício: Tabela formatada"
                ],
                duracao: "2h30min"
            },
            {
                numero: 3,
                titulo: "Fórmulas Básicas",
                topicos: [
                    "Operadores matemáticos",
                    "SOMA, MÉDIA, MÁXIMO, MÍNIMO",
                    "Referências de células",
                    "Copiar fórmulas",
                    "Exercício: Cálculos básicos"
                ],
                duracao: "2h30min"
            },
            {
                numero: 4,
                titulo: "Funções Essenciais",
                topicos: [
                    "SE (condicionais)",
                    "CONT.SE e CONT.SES",
                    "SOMASE e SOMASES",
                    "Funções de texto",
                    "Exercício: Controle de vendas"
                ],
                duracao: "2h30min"
            },
            {
                numero: 5,
                titulo: "Gráficos Básicos",
                topicos: [
                    "Tipos de gráficos",
                    "Criar e formatar gráficos",
                    "Personalização visual",
                    "Gráficos dinâmicos",
                    "Exercício: Dashboard simples"
                ],
                duracao: "2h30min"
            },
            {
                numero: 6,
                titulo: "Trabalho com Dados",
                topicos: [
                    "Classificar dados",
                    "Filtros básicos e avançados",
                    "Remover duplicatas",
                    "Validação de dados",
                    "Exercício: Base de clientes"
                ],
                duracao: "2h30min"
            },
            {
                numero: 7,
                titulo: "PROCV e Funções de Pesquisa",
                topicos: [
                    "PROCV detalhado",
                    "PROCH",
                    "ÍNDICE e CORRESP",
                    "Combinação de funções",
                    "Exercício: Sistema de busca"
                ],
                duracao: "2h30min"
            },
            {
                numero: 8,
                titulo: "Tabelas Dinâmicas - Parte 1",
                topicos: [
                    "Criar tabela dinâmica",
                    "Campos e valores",
                    "Filtros e segmentação",
                    "Atualizar dados",
                    "Exercício: Análise de vendas"
                ],
                duracao: "2h30min"
            },
            {
                numero: 9,
                titulo: "Tabelas Dinâmicas - Parte 2",
                topicos: [
                    "Gráficos dinâmicos",
                    "Campos calculados",
                    "Segmentação de dados avançada",
                    "Linha do tempo",
                    "Exercício: Relatório executivo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 10,
                titulo: "Formatação Condicional",
                topicos: [
                    "Regras de realce",
                    "Barras de dados e ícones",
                    "Regras personalizadas",
                    "Gerenciar regras",
                    "Exercício: Indicadores visuais"
                ],
                duracao: "2h30min"
            },
            {
                numero: 11,
                titulo: "Ferramentas Avançadas",
                topicos: [
                    "Proteção de planilhas",
                    "Macros básicas",
                    "Importar e exportar dados",
                    "Vinculação de planilhas",
                    "Exercício: Planilha protegida"
                ],
                duracao: "2h30min"
            },
            {
                numero: 12,
                titulo: "Projeto Final - Excel",
                topicos: [
                    "Dashboard profissional",
                    "Relatórios automatizados",
                    "Apresentação do projeto",
                    "Dicas de produtividade",
                    "Certificação e próximos passos"
                ],
                duracao: "2h30min"
            }
        ]
    },

    word: {
        nome: "Word",
        cor: "#2b579a",
        professor: "Malu",
        nivel: "L1",
        totalAulas: 12,
        aulas: [
            {
                numero: 1,
                titulo: "Introdução ao Word",
                topicos: [
                    "Interface do Word",
                    "Criando documentos",
                    "Digitação e edição básica",
                    "Salvar em diferentes formatos",
                    "Exercício: Primeiro documento"
                ],
                duracao: "2h30min"
            },
            {
                numero: 2,
                titulo: "Formatação de Texto",
                topicos: [
                    "Fontes e tamanhos",
                    "Negrito, itálico, sublinhado",
                    "Cores e realces",
                    "Alinhamento e espaçamento",
                    "Exercício: Carta formal"
                ],
                duracao: "2h30min"
            },
            {
                numero: 3,
                titulo: "Parágrafos e Estilos",
                topicos: [
                    "Recuos e tabulações",
                    "Espaçamento entre linhas",
                    "Estilos predefinidos",
                    "Criar estilos personalizados",
                    "Exercício: Documento com estilos"
                ],
                duracao: "2h30min"
            },
            {
                numero: 4,
                titulo: "Listas e Marcadores",
                topicos: [
                    "Listas com marcadores",
                    "Listas numeradas",
                    "Listas multinível",
                    "Personalizar marcadores",
                    "Exercício: Documento estruturado"
                ],
                duracao: "2h30min"
            },
            {
                numero: 5,
                titulo: "Tabelas no Word",
                topicos: [
                    "Inserir e criar tabelas",
                    "Formatação de tabelas",
                    "Mesclar e dividir células",
                    "Estilos de tabela",
                    "Exercício: Planilha de controle"
                ],
                duracao: "2h30min"
            },
            {
                numero: 6,
                titulo: "Imagens e Elementos Visuais",
                topicos: [
                    "Inserir imagens",
                    "Formatos e disposição",
                    "Formas e SmartArt",
                    "Ícones e gráficos",
                    "Exercício: Documento visual"
                ],
                duracao: "2h30min"
            },
            {
                numero: 7,
                titulo: "Cabeçalho, Rodapé e Numeração",
                topicos: [
                    "Cabeçalhos personalizados",
                    "Rodapés e informações",
                    "Numeração de páginas",
                    "Seções diferentes",
                    "Exercício: Documento profissional"
                ],
                duracao: "2h30min"
            },
            {
                numero: 8,
                titulo: "Sumário e Referências",
                topicos: [
                    "Criar sumário automático",
                    "Índices remissivos",
                    "Notas de rodapé",
                    "Citações e bibliografia",
                    "Exercício: Relatório com sumário"
                ],
                duracao: "2h30min"
            },
            {
                numero: 9,
                titulo: "Revisão e Colaboração",
                topicos: [
                    "Revisão ortográfica",
                    "Controle de alterações",
                    "Comentários",
                    "Comparar documentos",
                    "Exercício: Revisão colaborativa"
                ],
                duracao: "2h30min"
            },
            {
                numero: 10,
                titulo: "Mala Direta",
                topicos: [
                    "Conceito de mala direta",
                    "Fonte de dados",
                    "Campos de mesclagem",
                    "Criar etiquetas",
                    "Exercício: Cartas personalizadas"
                ],
                duracao: "2h30min"
            },
            {
                numero: 11,
                titulo: "Modelos e Formulários",
                topicos: [
                    "Criar modelos",
                    "Controles de conteúdo",
                    "Formulários preenchíveis",
                    "Proteger formulários",
                    "Exercício: Template corporativo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 12,
                titulo: "Projeto Final - Word",
                topicos: [
                    "Documento profissional completo",
                    "Relatório técnico ou acadêmico",
                    "Aplicação de todos os recursos",
                    "Apresentação final",
                    "Dicas profissionais"
                ],
                duracao: "2h30min"
            }
        ]
    },

    informatica_powerbi: {
        nome: "Informática Básica e Power BI",
        cor: "#f2c811",
        professor: "Malu",
        nivel: "L1",
        totalAulas: 12,
        aulas: [
            {
                numero: 1,
                titulo: "Fundamentos de Informática",
                topicos: [
                    "Hardware e Software",
                    "Sistema Operacional Windows",
                    "Gerenciamento de arquivos",
                    "Extensões e tipos de arquivo",
                    "Exercício: Organização de pastas"
                ],
                duracao: "2h30min"
            },
            {
                numero: 2,
                titulo: "Internet e Navegação",
                topicos: [
                    "Navegadores web",
                    "Pesquisa eficiente",
                    "E-mail e comunicação",
                    "Segurança online",
                    "Exercício: Pesquisa e e-mail"
                ],
                duracao: "2h30min"
            },
            {
                numero: 3,
                titulo: "Armazenamento em Nuvem",
                topicos: [
                    "Google Drive",
                    "OneDrive",
                    "Compartilhamento de arquivos",
                    "Backup e sincronização",
                    "Exercício: Projeto em nuvem"
                ],
                duracao: "2h30min"
            },
            {
                numero: 4,
                titulo: "Introdução ao Power BI",
                topicos: [
                    "O que é Business Intelligence",
                    "Interface do Power BI Desktop",
                    "Conceitos básicos",
                    "Instalação e configuração",
                    "Exercício: Primeira visualização"
                ],
                duracao: "2h30min"
            },
            {
                numero: 5,
                titulo: "Importação de Dados",
                topicos: [
                    "Conectar com Excel",
                    "Importar de arquivos CSV",
                    "Conectar com bancos de dados",
                    "Web scraping básico",
                    "Exercício: Importar múltiplas fontes"
                ],
                duracao: "2h30min"
            },
            {
                numero: 6,
                titulo: "Tratamento de Dados - Power Query",
                topicos: [
                    "Editor de consultas",
                    "Limpeza de dados",
                    "Transformações básicas",
                    "Combinar consultas",
                    "Exercício: ETL básico"
                ],
                duracao: "2h30min"
            },
            {
                numero: 7,
                titulo: "Modelagem de Dados",
                topicos: [
                    "Relacionamentos entre tabelas",
                    "Cardinalidade",
                    "Filtros cruzados",
                    "Boas práticas de modelagem",
                    "Exercício: Modelo de dados"
                ],
                duracao: "2h30min"
            },
            {
                numero: 8,
                titulo: "DAX - Fórmulas Básicas",
                topicos: [
                    "Introdução ao DAX",
                    "Medidas calculadas",
                    "Colunas calculadas",
                    "Funções essenciais",
                    "Exercício: Cálculos personalizados"
                ],
                duracao: "2h30min"
            },
            {
                numero: 9,
                titulo: "Visualizações - Parte 1",
                topicos: [
                    "Tipos de gráficos",
                    "Gráficos de barras e colunas",
                    "Gráficos de pizza e rosca",
                    "Gráficos de linhas",
                    "Exercício: Dashboard inicial"
                ],
                duracao: "2h30min"
            },
            {
                numero: 10,
                titulo: "Visualizações - Parte 2",
                topicos: [
                    "Mapas e geolocalização",
                    "Tabelas e matrizes",
                    "Cartões e KPIs",
                    "Segmentadores de dados",
                    "Exercício: Dashboard interativo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 11,
                titulo: "Dashboards Profissionais",
                topicos: [
                    "Design e layout",
                    "Cores e identidade visual",
                    "Interatividade",
                    "Dicas de UX/UI",
                    "Exercício: Dashboard corporativo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 12,
                titulo: "Publicação e Compartilhamento",
                topicos: [
                    "Power BI Service",
                    "Publicar relatórios",
                    "Compartilhar dashboards",
                    "Atualização automática",
                    "Projeto final e apresentação"
                ],
                duracao: "2h30min"
            }
        ]
    },

    administrativo: {
        nome: "Administrativo",
        cor: "#d83b01",
        professor: "Malu/Moyses",
        nivel: "L1/L2",
        totalAulas: 12,
        aulas: [
            {
                numero: 1,
                titulo: "Introdução à Gestão Administrativa",
                topicos: [
                    "Fundamentos da administração",
                    "Estrutura organizacional",
                    "Áreas funcionais",
                    "Processos administrativos",
                    "Exercício: Análise organizacional"
                ],
                duracao: "2h30min"
            },
            {
                numero: 2,
                titulo: "Documentação Empresarial",
                topicos: [
                    "Tipos de documentos",
                    "Redação empresarial",
                    "Atas e relatórios",
                    "Arquivamento e organização",
                    "Exercício: Redigir documentos"
                ],
                duracao: "2h30min"
            },
            {
                numero: 3,
                titulo: "Atendimento ao Cliente",
                topicos: [
                    "Técnicas de atendimento",
                    "Comunicação eficaz",
                    "Gestão de reclamações",
                    "Satisfação do cliente",
                    "Exercício: Role-play de atendimento"
                ],
                duracao: "2h30min"
            },
            {
                numero: 4,
                titulo: "Gestão de Estoque",
                topicos: [
                    "Controle de estoque",
                    "Inventário",
                    "Métodos de avaliação",
                    "Sistemas de controle",
                    "Exercício: Controle de estoque"
                ],
                duracao: "2h30min"
            },
            {
                numero: 5,
                titulo: "Finanças Básicas",
                topicos: [
                    "Fluxo de caixa",
                    "Contas a pagar e receber",
                    "Controle financeiro",
                    "Planilhas financeiras",
                    "Exercício: Gestão financeira"
                ],
                duracao: "2h30min"
            },
            {
                numero: 6,
                titulo: "Recursos Humanos - Parte 1",
                topicos: [
                    "Recrutamento e seleção",
                    "Admissão de funcionários",
                    "Documentação trabalhista",
                    "Folha de pagamento básica",
                    "Exercício: Processo seletivo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 7,
                titulo: "Recursos Humanos - Parte 2",
                topicos: [
                    "Gestão de férias",
                    "Benefícios e encargos",
                    "Rescisão contratual",
                    "eSocial básico",
                    "Exercício: Cálculos trabalhistas"
                ],
                duracao: "2h30min"
            },
            {
                numero: 8,
                titulo: "Compras e Fornecedores",
                topicos: [
                    "Processo de compras",
                    "Cotação e negociação",
                    "Gestão de fornecedores",
                    "Contratos e acordos",
                    "Exercício: Processo de compra"
                ],
                duracao: "2h30min"
            },
            {
                numero: 9,
                titulo: "Logística e Expedição",
                topicos: [
                    "Recebimento de mercadorias",
                    "Conferência e armazenagem",
                    "Expedição e envio",
                    "Rastreamento",
                    "Exercício: Fluxo logístico"
                ],
                duracao: "2h30min"
            },
            {
                numero: 10,
                titulo: "Gestão de Tempo e Produtividade",
                topicos: [
                    "Técnicas de organização",
                    "Priorização de tarefas",
                    "Ferramentas de produtividade",
                    "Gestão de agenda",
                    "Exercício: Planejamento semanal"
                ],
                duracao: "2h30min"
            },
            {
                numero: 11,
                titulo: "Sistemas de Gestão (ERP)",
                topicos: [
                    "O que é um ERP",
                    "Principais sistemas",
                    "Integração de processos",
                    "Relatórios gerenciais",
                    "Exercício: Simulação de ERP"
                ],
                duracao: "2h30min"
            },
            {
                numero: 12,
                titulo: "Projeto Final - Administrativo",
                topicos: [
                    "Estudo de caso completo",
                    "Processos integrados",
                    "Apresentação de projeto",
                    "Boas práticas administrativas",
                    "Certificação e próximos passos"
                ],
                duracao: "2h30min"
            }
        ]
    },

    unity: {
        nome: "Unity - Desenvolvimento de Games",
        cor: "#000000",
        professor: "Moyses",
        nivel: "L2",
        totalAulas: 12,
        aulas: [
            {
                numero: 1,
                titulo: "Introdução ao Unity",
                topicos: [
                    "O que é Unity e game development",
                    "Instalação do Unity Hub",
                    "Interface e navegação",
                    "Criando o primeiro projeto",
                    "Conceitos básicos: GameObjects e Components"
                ],
                duracao: "2h30min"
            },
            {
                numero: 2,
                titulo: "Fundamentos de C# para Unity",
                topicos: [
                    "Sintaxe básica de C#",
                    "Variáveis e tipos de dados",
                    "Operadores e condicionais",
                    "Loops e arrays",
                    "Primeiro script: movimentação básica"
                ],
                duracao: "2h30min"
            },
            {
                numero: 3,
                titulo: "Transformações e Física 2D",
                topicos: [
                    "Transform: Position, Rotation, Scale",
                    "Rigidbody 2D",
                    "Colliders e triggers",
                    "Física e gravidade",
                    "Exercício: Plataforma com física"
                ],
                duracao: "2h30min"
            },
            {
                numero: 4,
                titulo: "Sprites e Animações 2D",
                topicos: [
                    "Importar e configurar sprites",
                    "Sprite Renderer",
                    "Animation e Animator",
                    "Sprite sheets",
                    "Exercício: Personagem animado"
                ],
                duracao: "2h30min"
            },
            {
                numero: 5,
                titulo: "Input e Controles",
                topicos: [
                    "Input System (antigo e novo)",
                    "Controles de teclado e mouse",
                    "Touch controls para mobile",
                    "Gamepad support",
                    "Exercício: Sistema de controle completo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 6,
                titulo: "Game Design - Mecânicas Básicas",
                topicos: [
                    "Movimento do jogador",
                    "Pular e duplo pulo",
                    "Coleta de itens",
                    "Sistema de vida",
                    "Exercício: Jogo de plataforma básico"
                ],
                duracao: "2h30min"
            },
            {
                numero: 7,
                titulo: "Inimigos e IA Básica",
                topicos: [
                    "Patrulha de inimigos",
                    "Detecção do jogador",
                    "Comportamento de ataque",
                    "Sistema de dano",
                    "Exercício: IA de inimigo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 8,
                titulo: "UI - Interface do Usuário",
                topicos: [
                    "Canvas e componentes UI",
                    "Botões e eventos",
                    "HUD (Health, Score, etc)",
                    "Menus e telas",
                    "Exercício: Menu principal e HUD"
                ],
                duracao: "2h30min"
            },
            {
                numero: 9,
                titulo: "Audio e Efeitos Sonoros",
                topicos: [
                    "Audio Source e Audio Listener",
                    "Música de fundo",
                    "Efeitos sonoros",
                    "Mixers e controle de volume",
                    "Exercício: Implementação de áudio"
                ],
                duracao: "2h30min"
            },
            {
                numero: 10,
                titulo: "Sistemas de Jogo",
                topicos: [
                    "Game Manager",
                    "Sistema de pontuação",
                    "Save e Load",
                    "Pause menu",
                    "Exercício: Gerenciamento de jogo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 11,
                titulo: "Particle Systems e Efeitos Visuais",
                topicos: [
                    "Particle System básico",
                    "Efeitos de explosão",
                    "Trail Renderer",
                    "Pós-processamento",
                    "Exercício: VFX no jogo"
                ],
                duracao: "2h30min"
            },
            {
                numero: 12,
                titulo: "Build e Publicação",
                topicos: [
                    "Build para diferentes plataformas",
                    "Otimização de performance",
                    "Publishing na itch.io",
                    "Apresentação do jogo final",
                    "Próximos passos e recursos"
                ],
                duracao: "2h30min"
            }
        ]
    },

    powerbi_avancado: {
        nome: "Power BI Avançado",
        cor: "#f2c811",
        professor: "Moyses",
        nivel: "L2",
        totalAulas: 12,
        aulas: [
            {
                numero: 1,
                titulo: "Revisão e Power Query Avançado",
                topicos: [
                    "Revisão conceitos fundamentais",
                    "M Language",
                    "Funções customizadas",
                    "Parâmetros dinâmicos",
                    "Exercício: ETL avançado"
                ],
                duracao: "2h30min"
            },
            {
                numero: 2,
                titulo: "DAX Avançado - Parte 1",
                topicos: [
                    "Context Transition",
                    "CALCULATE e filtros",
                    "Time Intelligence",
                    "Variables e performance",
                    "Exercício: Medidas complexas"
                ],
                duracao: "2h30min"
            },
            {
                numero: 3,
                titulo: "DAX Avançado - Parte 2",
                topicos: [
                    "Funções de tabela",
                    "FILTER, ALL, ALLEXCEPT",
                    "Cálculos iterativos",
                    "Ranking e análise",
                    "Exercício: Análise de ranking"
                ],
                duracao: "2h30min"
            },
            {
                numero: 4,
                titulo: "Modelagem Avançada",
                topicos: [
                    "Star Schema e Snowflake",
                    "Role-playing dimensions",
                    "Tabelas calculadas",
                    "Otimização de modelo",
                    "Exercício: Modelo otimizado"
                ],
                duracao: "2h30min"
            },
            {
                numero: 5,
                titulo: "RLS - Row Level Security",
                topicos: [
                    "Conceitos de segurança",
                    "Criar roles",
                    "Testar segurança",
                    "Dynamic RLS",
                    "Exercício: Implementar RLS"
                ],
                duracao: "2h30min"
            },
            {
                numero: 6,
                titulo: "Visualizações Customizadas",
                topicos: [
                    "Visuais customizados do marketplace",
                    "Deneb e Vega",
                    "Python e R visuals",
                    "Custom visuals",
                    "Exercício: Visual avançado"
                ],
                duracao: "2h30min"
            },
            {
                numero: 7,
                titulo: "Análise de What-If",
                topicos: [
                    "Parâmetros What-If",
                    "Cenários dinâmicos",
                    "Análise de sensibilidade",
                    "Projeções",
                    "Exercício: Análise de cenários"
                ],
                duracao: "2h30min"
            },
            {
                numero: 8,
                titulo: "Power BI Service Avançado",
                topicos: [
                    "Workspaces e governança",
                    "Dataflows",
                    "Incremental refresh",
                    "Deployment pipelines",
                    "Exercício: Configurar ambiente"
                ],
                duracao: "2h30min"
            },
            {
                numero: 9,
                titulo: "Integração com Outras Ferramentas",
                topicos: [
                    "Excel e Power BI",
                    "SharePoint integration",
                    "Teams e colaboração",
                    "Power Automate",
                    "Exercício: Integração completa"
                ],
                duracao: "2h30min"
            },
            {
                numero: 10,
                titulo: "Performance e Otimização",
                topicos: [
                    "Performance Analyzer",
                    "DAX Studio",
                    "Query folding",
                    "Best practices",
                    "Exercício: Otimizar relatório"
                ],
                duracao: "2h30min"
            },
            {
                numero: 11,
                titulo: "Storytelling com Dados",
                topicos: [
                    "Narrativa com dados",
                    "Design thinking",
                    "Bookmarks e botões",
                    "Drillthrough e tooltips",
                    "Exercício: Dashboard storytelling"
                ],
                duracao: "2h30min"
            },
            {
                numero: 12,
                titulo: "Projeto Final - BI Corporativo",
                topicos: [
                    "Projeto completo end-to-end",
                    "Apresentação executiva",
                    "Documentação técnica",
                    "Certificação e carreira",
                    "Portfolio profissional"
                ],
                duracao: "2h30min"
            }
        ]
    }
};

// ==========================================
// ARMAZENAMENTO LOCAL
// ==========================================

const STORAGE_KEY = 'turmas_data_v3';
const CONTENT_KEY = 'aulas_content_custom_v3';
const HISTORY_KEY = 'aulas_history_v3';
const PROFESSORES_KEY = 'professores_data_v1';

// Carregar turmas do localStorage
function carregarTurmas() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Salvar turmas no localStorage
function salvarTurmas(turmas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(turmas));
    mostrarNotificacao('Dados salvos automaticamente!');
}

// Carregar conteúdo customizado
function carregarConteudoCustomizado() {
    const data = localStorage.getItem(CONTENT_KEY);
    return data ? JSON.parse(data) : {};
}

// Salvar conteúdo customizado
function salvarConteudoCustomizado(conteudo) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(conteudo));
}

// Carregar histórico de aulas
function carregarHistorico() {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : {};
}

// Salvar histórico de aulas
function salvarHistorico(historico) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historico));
}

// Adicionar entrada no histórico
function adicionarAoHistorico(turmaId, aulaNumero, data = new Date()) {
    const historico = carregarHistorico();
    if (!historico[turmaId]) {
        historico[turmaId] = [];
    }

    const entrada = {
        aulaNumero,
        data: data.toISOString(),
        timestamp: data.getTime()
    };

    // Evitar duplicatas
    const existe = historico[turmaId].find(h => h.aulaNumero === aulaNumero);
    if (!existe) {
        historico[turmaId].push(entrada);
        salvarHistorico(historico);
    }
}

// Obter conteúdo da aula (customizado ou original)
function obterConteudoAula(modulo, numeroAula) {
    const customizado = carregarConteudoCustomizado();
    const chave = `${modulo}_${numeroAula}`;

    if (customizado[chave]) {
        return customizado[chave];
    }

    return aulaConteudo[modulo].aulas.find(a => a.numero === numeroAula);
}

// Salvar conteúdo customizado de uma aula
function salvarConteudoAulaCustomizado(modulo, numeroAula, novoConteudo) {
    const customizado = carregarConteudoCustomizado();
    const chave = `${modulo}_${numeroAula}`;
    customizado[chave] = novoConteudo;
    salvarConteudoCustomizado(customizado);
    mostrarNotificacao('Conteúdo da aula atualizado!');
}

// Restaurar conteúdo original de uma aula
function restaurarConteudoOriginal(modulo, numeroAula) {
    const customizado = carregarConteudoCustomizado();
    const chave = `${modulo}_${numeroAula}`;
    delete customizado[chave];
    salvarConteudoCustomizado(customizado);
    mostrarNotificacao('Conteúdo restaurado ao original!');
}

// ==========================================
// GERENCIAMENTO DE TURMAS
// ==========================================

let turmas = carregarTurmas();

function adicionarTurma(turmaData) {
    turmas.push(turmaData);
    salvarTurmas(turmas);
    renderizarTurmas();
}

function editarTurma(id, novosDados) {
    const index = turmas.findIndex(t => t.id === id);
    if (index !== -1) {
        turmas[index] = { ...turmas[index], ...novosDados };
        salvarTurmas(turmas);
        renderizarTurmas();
        atualizarDashboard();
    }
}

function excluirTurma(id) {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
        turmas = turmas.filter(t => t.id !== id);
        salvarTurmas(turmas);
        renderizarTurmas();
    }
}

function avancarAula(id) {
    const turma = turmas.find(t => t.id === id);
    if (turma && turma.aulaAtual < turma.totalAulas) {
        turma.aulaAtual++;
        if (turma.aulaAtual === turma.totalAulas) {
            turma.status = 'completed';
        } else if (turma.status === 'pending') {
            turma.status = 'active';
        }
        salvarTurmas(turmas);
        renderizarTurmas();
        mostrarNotificacao(`Aula ${turma.aulaAtual} concluída!`);
    }
}

function marcarAulaConcluida(turmaId, numeroAula) {
    const turma = turmas.find(t => t.id === turmaId);
    if (turma) {
        turma.aulaAtual = numeroAula;
        if (turma.aulaAtual === turma.totalAulas) {
            turma.status = 'completed';
        } else if (turma.status === 'pending') {
            turma.status = 'active';
        }

        // Adicionar ao histórico
        adicionarAoHistorico(turmaId, numeroAula);

        salvarTurmas(turmas);
        renderizarTurmas();
        mostrarModalAulas(turmaId);
    }
}

// ==========================================
// RENDERIZAÇÃO
// ==========================================

function renderizarTurmas(filtro = 'all', busca = '') {
    const container = document.getElementById('turma-container');
    container.innerHTML = '';

    let turmasFiltradas = turmas;

    // Filtrar por dia
    if (filtro !== 'all') {
        turmasFiltradas = turmasFiltradas.filter(t => t.dias.includes(filtro));
    }

    // Filtrar por busca
    if (busca) {
        const buscaLower = busca.toLowerCase();
        turmasFiltradas = turmasFiltradas.filter(t =>
            t.nome.toLowerCase().includes(buscaLower) ||
            t.id.toLowerCase().includes(buscaLower) ||
            t.local.toLowerCase().includes(buscaLower) ||
            aulaConteudo[t.modulo].nome.toLowerCase().includes(buscaLower)
        );
    }

    turmasFiltradas.forEach(turma => {
        const card = criarCardTurma(turma);
        container.appendChild(card);
    });

    if (turmasFiltradas.length === 0) {
        container.innerHTML = '<p class="no-results">Nenhuma turma encontrada</p>';
    }
}

function criarCardTurma(turma) {
    const modulo = aulaConteudo[turma.modulo];
    const progresso = (turma.aulaAtual / turma.totalAulas) * 100;

    const card = document.createElement('div');
    card.className = 'turma-card';

    const statusIcon = {
        'pending': 'bi-clock',
        'active': 'bi-play-circle-fill',
        'completed': 'bi-check-circle-fill'
    };

    const statusText = {
        'pending': 'Pendente',
        'active': 'Em Andamento',
        'completed': 'Concluída'
    };

    card.innerHTML = `
        <div class="turma-card-header">
            <div class="turma-card-top">
                <span class="turma-code">${turma.id}</span>
                <button class="turma-delete-btn" onclick="excluirTurma('${turma.id}')" title="Excluir turma">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <h3 class="turma-name">${turma.nome}</h3>
            <div class="turma-info-row">
                <span><i class="bi bi-geo-alt"></i> ${turma.local}</span>
                <span><i class="bi bi-person"></i> ${modulo.professor}</span>
            </div>
        </div>
        
        <div class="turma-card-body">
            <div class="module-badge" style="background: ${modulo.cor}15; color: ${modulo.cor}; border: 1px solid ${modulo.cor}30">
                <i class="bi bi-collection"></i>
                ${modulo.nome} (${modulo.nivel})
            </div>
            
            <div class="days-badges">
                ${turma.dias.map(dia => `<span class="day-badge">${dia.charAt(0).toUpperCase() + dia.slice(1)}</span>`).join('')}
            </div>
            
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                <i class="bi bi-clock"></i>
                <span>${turma.horario}</span>
            </div>
            
            <div class="status-badge ${turma.status}">
                <i class="bi ${statusIcon[turma.status]}"></i>
                ${statusText[turma.status]}
            </div>
            
            <div class="progress-section">
                <div class="progress-header">
                    <span class="progress-label">Progresso</span>
                    <span class="progress-value">${turma.aulaAtual}/${turma.totalAulas} aulas (${Math.round(progresso)}%)</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progresso}%; background: ${modulo.cor}"></div>
                </div>
            </div>
        </div>
        
        <div class="turma-card-footer">
            <button class="btn btn-sm btn-primary" onclick="mostrarModalAulas('${turma.id}')">
                <i class="bi bi-book"></i> Ver Aulas
            </button>
            ${turma.aulaAtual < turma.totalAulas ?
            `<button class="btn btn-sm btn-accent" onclick="avancarAula('${turma.id}')">
                    <i class="bi bi-play-fill"></i> Avançar
                </button>` :
            '<button class="btn btn-sm btn-secondary" disabled><i class="bi bi-check-lg"></i> Concluída</button>'
        }
            <button class="btn btn-sm btn-secondary" onclick="mostrarFormEditarTurma('${turma.id}')">
                <i class="bi bi-pencil"></i>
            </button>
        </div>
    `;

    return card;
}


// ==========================================
// MODAL DE AULAS
// ==========================================

function mostrarModalAulas(turmaId) {
    const turma = turmas.find(t => t.id === turmaId);
    if (!turma) return;

    const modulo = aulaConteudo[turma.modulo];
    const modal = document.getElementById('aula-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content-container');
    const historico = carregarHistorico();
    const historicoTurma = historico[turmaId] || [];

    modalTitle.textContent = `${modulo.nome} - ${turma.nome}`;
    modalTitle.style.color = modulo.cor;

    let html = `
        <div class="aulas-list">
            <div class="aulas-header">
                <h4>Conteúdo Programático</h4>
                <div class="header-actions">
                    <span class="nivel-badge">${modulo.nivel} - Prof. ${modulo.professor}</span>
                    <button class="btn btn-mini btn-secondary" onclick="mostrarHistoricoTurma('${turmaId}')">
                        📅 Ver Histórico
                    </button>
                </div>
            </div>
    `;

    modulo.aulas.forEach(aulaOriginal => {
        const aula = obterConteudoAula(turma.modulo, aulaOriginal.numero);
        const concluida = aula.numero <= turma.aulaAtual;
        const atual = aula.numero === turma.aulaAtual + 1;
        const dataRealizacao = historicoTurma.find(h => h.aulaNumero === aula.numero);
        const customizado = carregarConteudoCustomizado()[`${turma.modulo}_${aula.numero}`] ? true : false;

        html += `
            <div class="aula-item ${concluida ? 'concluida' : ''} ${atual ? 'atual' : ''}" id="aula-${turmaId}-${aula.numero}">
                <div class="aula-header-item">
                    <div class="aula-numero">${aula.numero}</div>
                    <div class="aula-info-item">
                        <h4>${aula.titulo} ${customizado ? '<span class="badge-customizado">✏️ Editado</span>' : ''}</h4>
                        <div class="aula-meta">
                            <span class="aula-duracao">⏱️ ${aula.duracao}</span>
                            ${dataRealizacao ? `<span class="aula-data">📅 ${formatarData(dataRealizacao.data)}</span>` : ''}
                        </div>
                    </div>
                    <div class="aula-status">
                        ${concluida ? '✅' : atual ? '➡️' : '⏳'}
                    </div>
                </div>
                <div class="aula-topicos" id="topicos-${turmaId}-${aula.numero}">
                    <h5>Tópicos:</h5>
                    <ul>
                        ${aula.topicos.map((topico, idx) => `<li id="topico-${turmaId}-${aula.numero}-${idx}">${topico}</li>`).join('')}
                    </ul>
                </div>
                <div class="aula-actions">
                    ${!concluida ? `
                        <button class="btn btn-mini btn-success" onclick="marcarAulaConcluida('${turmaId}', ${aula.numero})">
                            ✅ Marcar como concluída
                        </button>
                    ` : ''}
                    <button class="btn btn-mini btn-primary" onclick="editarAula('${turmaId}', '${turma.modulo}', ${aula.numero})">
                        ✏️ Editar Conteúdo
                    </button>
                    ${customizado ? `
                        <button class="btn btn-mini btn-secondary" onclick="restaurarAulaOriginal('${turmaId}', '${turma.modulo}', ${aula.numero})">
                            🔄 Restaurar Original
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });

    html += '</div>';
    modalContent.innerHTML = html;
    modal.style.display = 'flex';
}

function formatarData(isoString) {
    const data = new Date(isoString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function mostrarHistoricoTurma(turmaId) {
    const turma = turmas.find(t => t.id === turmaId);
    if (!turma) return;

    const modulo = aulaConteudo[turma.modulo];
    const historico = carregarHistorico();
    const historicoTurma = historico[turmaId] || [];

    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content-container');

    modalTitle.textContent = `📅 Histórico - ${turma.nome}`;
    modalTitle.style.color = modulo.cor;

    if (historicoTurma.length === 0) {
        modalContent.innerHTML = `
            <div class="historico-vazio">
                <p>Nenhuma aula foi marcada como concluída ainda.</p>
                <button class="btn btn-primary" onclick="mostrarModalAulas('${turmaId}')">
                    ← Voltar para Aulas
                </button>
            </div>
        `;
        return;
    }

    // Ordenar por data (mais recente primeiro)
    const historicoOrdenado = [...historicoTurma].sort((a, b) => b.timestamp - a.timestamp);

    let html = `
        <div class="historico-container">
            <div class="historico-header">
                <h4>Aulas Realizadas</h4>
                <button class="btn btn-mini btn-secondary" onclick="mostrarModalAulas('${turmaId}')">
                    ← Voltar para Aulas
                </button>
            </div>
            <div class="historico-lista">
    `;

    historicoOrdenado.forEach(entrada => {
        const aula = obterConteudoAula(turma.modulo, entrada.aulaNumero);
        html += `
            <div class="historico-item">
                <div class="historico-numero">${entrada.aulaNumero}</div>
                <div class="historico-info">
                    <h5>${aula.titulo}</h5>
                    <p class="historico-data">📅 Realizada em ${formatarData(entrada.data)}</p>
                    <p class="historico-duracao">⏱️ ${aula.duracao}</p>
                </div>
                <button class="btn btn-mini btn-primary" onclick="verDetalhesAulaHistorico('${turmaId}', ${entrada.aulaNumero})">
                    👁️ Ver Detalhes
                </button>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    modalContent.innerHTML = html;
}

function verDetalhesAulaHistorico(turmaId, numeroAula) {
    const turma = turmas.find(t => t.id === turmaId);
    const aula = obterConteudoAula(turma.modulo, numeroAula);
    const modulo = aulaConteudo[turma.modulo];
    const historico = carregarHistorico();
    const historicoTurma = historico[turmaId] || [];
    const dataRealizacao = historicoTurma.find(h => h.aulaNumero === numeroAula);
    const customizado = carregarConteudoCustomizado()[`${turma.modulo}_${numeroAula}`] ? true : false;

    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content-container');

    modalTitle.textContent = `Aula ${numeroAula} - ${aula.titulo}`;
    modalTitle.style.color = modulo.cor;

    modalContent.innerHTML = `
        <div class="aula-detalhes">
            <div class="detalhes-header">
                <button class="btn btn-mini btn-secondary" onclick="mostrarHistoricoTurma('${turmaId}')">
                    ← Voltar ao Histórico
                </button>
                <span class="aula-status-badge concluida">✅ Concluída</span>
            </div>
            
            <div class="detalhes-info">
                <h3>${aula.titulo} ${customizado ? '<span class="badge-customizado">✏️ Editado</span>' : ''}</h3>
                <div class="meta-info">
                    <span>⏱️ ${aula.duracao}</span>
                    <span>📅 ${formatarData(dataRealizacao.data)}</span>
                    <span>📚 ${modulo.nome}</span>
                </div>
            </div>
            
            <div class="detalhes-conteudo">
                <h4>Tópicos Abordados:</h4>
                <ul class="topicos-detalhes">
                    ${aula.topicos.map(topico => `<li>✓ ${topico}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detalhes-actions">
                <button class="btn btn-primary" onclick="editarAula('${turmaId}', '${turma.modulo}', ${numeroAula})">
                    ✏️ Editar Conteúdo
                </button>
                ${customizado ? `
                    <button class="btn btn-secondary" onclick="restaurarAulaOriginal('${turmaId}', '${turma.modulo}', ${numeroAula})">
                        🔄 Restaurar Original
                    </button>
                ` : ''}
                <button class="btn btn-secondary" onclick="mostrarModalAulas('${turmaId}')">
                    📚 Ver Todas as Aulas
                </button>
            </div>
        </div>
    `;
}

function editarAula(turmaId, modulo, numeroAula) {
    const aula = obterConteudoAula(modulo, numeroAula);
    const moduloInfo = aulaConteudo[modulo];

    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content-container');

    modalTitle.textContent = `✏️ Editar Aula ${numeroAula}`;
    modalTitle.style.color = moduloInfo.cor;

    modalContent.innerHTML = `
        <form id="form-editar-aula" class="editar-aula-form">
            <div class="form-group">
                <label>Título da Aula:</label>
                <input type="text" id="edit-titulo" value="${aula.titulo}" required>
            </div>
            
            <div class="form-group">
                <label>Duração:</label>
                <input type="text" id="edit-duracao" value="${aula.duracao}" required placeholder="Ex: 2h30min">
            </div>
            
            <div class="form-group">
                <label>Tópicos (um por linha):</label>
                <textarea id="edit-topicos" rows="10" required>${aula.topicos.join('\n')}</textarea>
                <small>Cada linha será um tópico. Mínimo de 3 tópicos.</small>
            </div>
            
            <div class="form-buttons">
                <button type="submit" class="btn btn-primary">💾 Salvar Alterações</button>
                <button type="button" class="btn btn-secondary" onclick="mostrarModalAulas('${turmaId}')">
                    ❌ Cancelar
                </button>
            </div>
        </form>
    `;

    document.getElementById('form-editar-aula').addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = document.getElementById('edit-titulo').value.trim();
        const duracao = document.getElementById('edit-duracao').value.trim();
        const topicosTexto = document.getElementById('edit-topicos').value.trim();
        const topicos = topicosTexto.split('\n').map(t => t.trim()).filter(t => t.length > 0);

        if (topicos.length < 3) {
            alert('Por favor, adicione pelo menos 3 tópicos!');
            return;
        }

        const novoConteudo = {
            numero: numeroAula,
            titulo,
            topicos,
            duracao
        };

        salvarConteudoAulaCustomizado(modulo, numeroAula, novoConteudo);
        mostrarModalAulas(turmaId);
    });
}

function restaurarAulaOriginal(turmaId, modulo, numeroAula) {
    if (confirm('Deseja restaurar o conteúdo original desta aula? Todas as edições serão perdidas.')) {
        restaurarConteudoOriginal(modulo, numeroAula);
        mostrarModalAulas(turmaId);
    }
}

function fecharModal() {
    document.getElementById('aula-modal').style.display = 'none';
}

// ==========================================
// FORMULÁRIOS
// ==========================================

function mostrarFormNovaTurma() {
    const modalContent = document.getElementById('modal-content-container');
    const modalTitle = document.getElementById('modal-title');

    modalTitle.textContent = 'Adicionar Nova Turma';
    modalTitle.style.color = '#6e4ff6';

    modalContent.innerHTML = `
        <form id="form-turma" class="turma-form">
            <div class="form-group">
                <label>Código da Turma:</label>
                <input type="text" id="turma-id" required placeholder="Ex: A4602-1">
            </div>
            
            <div class="form-group">
                <label>Nome da Turma:</label>
                <input type="text" id="turma-nome" required placeholder="Ex: GTA Qua e Sex - 9h às 10h30">
            </div>
            
            <div class="form-group">
                <label>Local:</label>
                <input type="text" id="turma-local" required placeholder="Ex: UNIDADE 1: Pacote Office">
            </div>
            
            <div class="form-group">
                <label>Módulo:</label>
                <select id="turma-modulo" required>
                    <option value="">Selecione um módulo</option>
                    <option value="canva">Canva (L1 - Malu)</option>
                    <option value="figma">Figma (L1 - Malu)</option>
                    <option value="excel">Excel (L1 - Malu)</option>
                    <option value="word">Word (L1 - Malu)</option>
                    <option value="informatica_powerbi">Informática e Power BI (L1 - Malu)</option>
                    <option value="unity">Unity - Games (L2 - Moyses)</option>
                    <option value="powerbi_avancado">Power BI Avançado (L2 - Moyses)</option>
                    <option value="administrativo">Administrativo (L1/L2)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Dias da Semana:</label>
                <div class="dias-checkbox">
                    <label><input type="checkbox" name="dia" value="segunda"> Segunda</label>
                    <label><input type="checkbox" name="dia" value="terca"> Terça</label>
                    <label><input type="checkbox" name="dia" value="quarta"> Quarta</label>
                    <label><input type="checkbox" name="dia" value="quinta"> Quinta</label>
                    <label><input type="checkbox" name="dia" value="sexta"> Sexta</label>
                    <label><input type="checkbox" name="dia" value="sabado"> Sábado</label>
                </div>
            </div>
            
            <div class="form-group">
                <label>Horário:</label>
                <input type="text" id="turma-horario" required placeholder="Ex: 9:00 - 10:30">
            </div>
            
            <div class="form-group">
                <label>Aula Atual:</label>
                <input type="number" id="turma-aula-atual" min="0" max="12" value="0">
            </div>
            
            <div class="form-buttons">
                <button type="submit" class="btn btn-primary">Adicionar Turma</button>
                <button type="button" class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
            </div>
        </form>
    `;

    document.getElementById('form-turma').addEventListener('submit', (e) => {
        e.preventDefault();

        const diasSelecionados = Array.from(document.querySelectorAll('input[name="dia"]:checked'))
            .map(checkbox => checkbox.value);

        if (diasSelecionados.length === 0) {
            alert('Selecione pelo menos um dia da semana!');
            return;
        }

        const modulo = document.getElementById('turma-modulo').value;
        const aulaAtual = parseInt(document.getElementById('turma-aula-atual').value);

        const novaTurma = {
            id: document.getElementById('turma-id').value,
            nome: document.getElementById('turma-nome').value,
            local: document.getElementById('turma-local').value,
            modulo: modulo,
            dias: diasSelecionados,
            horario: document.getElementById('turma-horario').value,
            aulaAtual: aulaAtual,
            totalAulas: aulaConteudo[modulo].totalAulas,
            status: aulaAtual === 0 ? 'pending' : aulaAtual === aulaConteudo[modulo].totalAulas ? 'completed' : 'active'
        };

        adicionarTurma(novaTurma);
        fecharModal();
    });

    document.getElementById('aula-modal').style.display = 'flex';
}

function mostrarFormEditarTurma(turmaId) {
    const turma = turmas.find(t => t.id === turmaId);
    if (!turma) return;

    const modalContent = document.getElementById('modal-content-container');
    const modalTitle = document.getElementById('modal-title');

    modalTitle.textContent = 'Editar Turma';
    modalTitle.style.color = '#6e4ff6';

    modalContent.innerHTML = `
        <form id="form-editar-turma" class="turma-form">
            <div class="form-group">
                <label>Código da Turma:</label>
                <input type="text" id="edit-turma-id" value="${turma.id}" required>
            </div>
            
            <div class="form-group">
                <label>Nome da Turma:</label>
                <input type="text" id="edit-turma-nome" value="${turma.nome}" required>
            </div>
            
            <div class="form-group">
                <label>Local:</label>
                <input type="text" id="edit-turma-local" value="${turma.local}" required>
            </div>
            
            <div class="form-group">
                <label>Módulo:</label>
                <select id="edit-turma-modulo" required>
                    <option value="canva" ${turma.modulo === 'canva' ? 'selected' : ''}>Canva (L1 - Malu)</option>
                    <option value="figma" ${turma.modulo === 'figma' ? 'selected' : ''}>Figma (L1 - Malu)</option>
                    <option value="excel" ${turma.modulo === 'excel' ? 'selected' : ''}>Excel (L1 - Malu)</option>
                    <option value="word" ${turma.modulo === 'word' ? 'selected' : ''}>Word (L1 - Malu)</option>
                    <option value="informatica_powerbi" ${turma.modulo === 'informatica_powerbi' ? 'selected' : ''}>Informática e Power BI (L1 - Malu)</option>
                    <option value="unity" ${turma.modulo === 'unity' ? 'selected' : ''}>Unity - Games (L2 - Moyses)</option>
                    <option value="powerbi_avancado" ${turma.modulo === 'powerbi_avancado' ? 'selected' : ''}>Power BI Avançado (L2 - Moyses)</option>
                    <option value="administrativo" ${turma.modulo === 'administrativo' ? 'selected' : ''}>Administrativo (L1/L2)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Dias da Semana:</label>
                <div class="dias-checkbox">
                    <label><input type="checkbox" name="edit-dia" value="segunda" ${turma.dias.includes('segunda') ? 'checked' : ''}> Segunda</label>
                    <label><input type="checkbox" name="edit-dia" value="terca" ${turma.dias.includes('terca') ? 'checked' : ''}> Terça</label>
                    <label><input type="checkbox" name="edit-dia" value="quarta" ${turma.dias.includes('quarta') ? 'checked' : ''}> Quarta</label>
                    <label><input type="checkbox" name="edit-dia" value="quinta" ${turma.dias.includes('quinta') ? 'checked' : ''}> Quinta</label>
                    <label><input type="checkbox" name="edit-dia" value="sexta" ${turma.dias.includes('sexta') ? 'checked' : ''}> Sexta</label>
                    <label><input type="checkbox" name="edit-dia" value="sabado" ${turma.dias.includes('sabado') ? 'checked' : ''}> Sábado</label>
                </div>
            </div>
            
            <div class="form-group">
                <label>Horário:</label>
                <input type="text" id="edit-turma-horario" value="${turma.horario}" required>
            </div>
            
            <div class="form-group">
                <label>Aula Atual:</label>
                <input type="number" id="edit-turma-aula-atual" min="0" max="12" value="${turma.aulaAtual}">
            </div>
            
            <div class="form-buttons">
                <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                <button type="button" class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
            </div>
        </form>
    `;

    document.getElementById('form-editar-turma').addEventListener('submit', (e) => {
        e.preventDefault();

        const diasSelecionados = Array.from(document.querySelectorAll('input[name="edit-dia"]:checked'))
            .map(checkbox => checkbox.value);

        if (diasSelecionados.length === 0) {
            alert('Selecione pelo menos um dia da semana!');
            return;
        }

        const modulo = document.getElementById('edit-turma-modulo').value;
        const aulaAtual = parseInt(document.getElementById('edit-turma-aula-atual').value);

        const dadosAtualizados = {
            id: document.getElementById('edit-turma-id').value,
            nome: document.getElementById('edit-turma-nome').value,
            local: document.getElementById('edit-turma-local').value,
            modulo: modulo,
            dias: diasSelecionados,
            horario: document.getElementById('edit-turma-horario').value,
            aulaAtual: aulaAtual,
            totalAulas: aulaConteudo[modulo].totalAulas,
            status: aulaAtual === 0 ? 'pending' : aulaAtual === aulaConteudo[modulo].totalAulas ? 'completed' : 'active'
        };

        editarTurma(turmaId, dadosAtualizados);
        fecharModal();
    });

    document.getElementById('aula-modal').style.display = 'flex';
}

// ==========================================
// IMPORTAR/EXPORTAR DADOS
// ==========================================

function exportarDados() {
    const dadosCompletos = {
        turmas: turmas,
        historico: carregarHistorico(),
        conteudoCustomizado: carregarConteudoCustomizado(),
        versao: '2.1',
        dataExportacao: new Date().toISOString()
    };

    const dados = JSON.stringify(dadosCompletos, null, 2);
    navigator.clipboard.writeText(dados).then(() => {
        mostrarNotificacao('Dados completos copiados (turmas + histórico + customizações)!');
        document.getElementById('data-text').value = dados;
    });
}

function salvarArquivo() {
    const dadosCompletos = {
        turmas: turmas,
        historico: carregarHistorico(),
        conteudoCustomizado: carregarConteudoCustomizado(),
        versao: '2.1',
        dataExportacao: new Date().toISOString()
    };

    const dados = JSON.stringify(dadosCompletos, null, 2);
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-completo-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    mostrarNotificacao('Backup completo salvo com sucesso!');
}

function importarDados() {
    const dados = document.getElementById('data-text').value.trim();
    if (!dados) {
        alert('Cole os dados no campo de texto primeiro!');
        return;
    }

    try {
        const dadosImportados = JSON.parse(dados);

        // Verifica se é formato novo (v2.1) ou antigo
        if (dadosImportados.versao === '2.1' || dadosImportados.turmas) {
            // Formato novo completo
            if (confirm('Isso irá substituir TODOS os dados (turmas + histórico + customizações). Continuar?')) {
                turmas = dadosImportados.turmas || dadosImportados;

                if (dadosImportados.historico) {
                    salvarHistorico(dadosImportados.historico);
                }

                if (dadosImportados.conteudoCustomizado) {
                    salvarConteudoCustomizado(dadosImportados.conteudoCustomizado);
                }

                salvarTurmas(turmas);
                renderizarTurmas();
                document.getElementById('data-text').value = '';
                mostrarNotificacao('Dados completos importados com sucesso!');
            }
        } else if (Array.isArray(dadosImportados)) {
            // Formato antigo (só turmas)
            if (confirm('Isso irá substituir todas as turmas atuais. Continuar?')) {
                turmas = dadosImportados;
                salvarTurmas(turmas);
                renderizarTurmas();
                document.getElementById('data-text').value = '';
                mostrarNotificacao('Turmas importadas com sucesso!');
            }
        } else {
            alert('Formato de dados inválido!');
        }
    } catch (e) {
        alert('Erro ao importar dados: ' + e.message);
    }
}

function importarArquivo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const dadosImportados = JSON.parse(event.target.result);

                // Verifica se é formato novo (v2.1) ou antigo
                if (dadosImportados.versao === '2.1' || dadosImportados.turmas) {
                    // Formato novo completo
                    if (confirm('Isso irá substituir TODOS os dados (turmas + histórico + customizações). Continuar?')) {
                        turmas = dadosImportados.turmas || dadosImportados;

                        if (dadosImportados.historico) {
                            salvarHistorico(dadosImportados.historico);
                        }

                        if (dadosImportados.conteudoCustomizado) {
                            salvarConteudoCustomizado(dadosImportados.conteudoCustomizado);
                        }

                        salvarTurmas(turmas);
                        renderizarTurmas();
                        mostrarNotificacao('Dados completos importados do arquivo!');
                    }
                } else if (Array.isArray(dadosImportados)) {
                    // Formato antigo (só turmas)
                    if (confirm('Isso irá substituir todas as turmas atuais. Continuar?')) {
                        turmas = dadosImportados;
                        salvarTurmas(turmas);
                        renderizarTurmas();
                        mostrarNotificacao('Turmas importadas do arquivo!');
                    }
                } else {
                    alert('Formato de arquivo inválido!');
                }
            } catch (error) {
                alert('Erro ao ler arquivo: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetarDados() {
    if (confirm('ATENÇÃO: Isso irá apagar TODOS os dados (turmas + histórico + customizações). Esta ação não pode ser desfeita!\n\nDeseja continuar?')) {
        if (confirm('Confirme novamente: Deseja realmente apagar TUDO?')) {
            turmas = [];
            salvarTurmas(turmas);
            localStorage.removeItem(HISTORY_KEY);
            localStorage.removeItem(CONTENT_KEY);
            renderizarTurmas();
            mostrarNotificacao('Todos os dados foram apagados!');
        }
    }
}

// ==========================================
// NOTIFICAÇÕES
// ==========================================

function mostrarNotificacao(mensagem) {
    const notif = document.getElementById('notification');
    notif.textContent = mensagem;
    notif.classList.add('show');

    setTimeout(() => {
        notif.classList.remove('show');
    }, 3000);
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Renderizar turmas
    renderizarTurmas();

    // Atualizar dashboard
    atualizarDashboard();

    // Iniciar na seção dashboard
    showSection('dashboard');

    // Renderizar professores
    renderizarProfessores();

    // Popular seletor de meses
    popularMeses();

    // Botão adicionar turma
    const btnAddTurma = document.getElementById('btn-add-turma');
    if (btnAddTurma) {
        btnAddTurma.addEventListener('click', mostrarFormNovaTurma);
    }

    // Botão fechar modal
    document.getElementById('close-modal').addEventListener('click', fecharModal);

    // Fechar modal ao clicar fora
    document.getElementById('aula-modal').addEventListener('click', (e) => {
        if (e.target.id === 'aula-modal') {
            fecharModal();
        }
    });

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filtro = btn.dataset.filter;
            const busca = document.querySelector('.search-bar')?.value || '';
            renderizarTurmas(filtro, busca);
        });
    });

    // Busca
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const filtroAtivo = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            renderizarTurmas(filtroAtivo, e.target.value);
        });
    }

    // Botões de exportar/importar
    const btnExportar = document.getElementById('btn-exportar');
    const btnSalvar = document.getElementById('btn-salvar-arquivo');
    const btnImportar = document.getElementById('btn-importar');
    const btnImportarArq = document.getElementById('btn-importar-arquivo');
    const btnReset = document.getElementById('btn-reset');

    if (btnExportar) btnExportar.addEventListener('click', exportarDados);
    if (btnSalvar) btnSalvar.addEventListener('click', salvarArquivo);
    if (btnImportar) btnImportar.addEventListener('click', importarDados);
    if (btnImportarArq) btnImportarArq.addEventListener('click', importarArquivo);
    if (btnReset) btnReset.addEventListener('click', resetarDados);

    // Form de professor
    const formProfessor = document.getElementById('professor-form');
    if (formProfessor) {
        formProfessor.addEventListener('submit', salvarProfessor);
    }
});

// ==========================================
// NAVEGAÇÃO ENTRE SEÇÕES
// ==========================================

function showSection(sectionName) {
    // Esconder todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar seção selecionada
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Atualizar navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });

    // Atualizar título da página
    const titles = {
        'dashboard': 'Dashboard',
        'turmas': 'Gestão de Turmas',
        'professores': 'Professores',
        'cronograma': 'Cronograma Semanal',
        'horas': 'Controle de Horas',
        'dados': 'Backup e Dados'
    };

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = titles[sectionName] || sectionName;
    }

    // Atualizar conteúdo específico da seção
    if (sectionName === 'dashboard') {
        atualizarDashboard();
    } else if (sectionName === 'cronograma') {
        renderizarCronograma();
    } else if (sectionName === 'horas') {
        atualizarHoras();
    } else if (sectionName === 'professores') {
        renderizarProfessores();
    }

    // Fechar sidebar mobile
    document.querySelector('.sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('show');
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('show');
}

// ==========================================
// MÓDULO DE PROFESSORES
// ==========================================

let professores = carregarProfessores();

function carregarProfessores() {
    const data = localStorage.getItem(PROFESSORES_KEY);
    if (data) {
        return JSON.parse(data);
    }

    // Dados iniciais dos professores
    return [
        {
            id: 'PROF-001',
            nome: 'Moyses Maciel Vieira Silva',
            email: 'moyses@prismatech.com',
            telefone: '',
            mei: {
                cnpj: '',
                razaoSocial: '',
                certificadoMEI: true
            },
            modulos: ['unity', 'excel', 'word', 'figma', 'informatica_powerbi', 'powerbi_avancado'],
            status: 'active',
            cor: '#2980b9'
        },
        {
            id: 'PROF-002',
            nome: 'Malu',
            email: 'malu@prismatech.com',
            telefone: '',
            mei: {
                cnpj: '',
                razaoSocial: '',
                certificadoMEI: true
            },
            modulos: ['canva', 'figma', 'excel', 'word', 'informatica_powerbi'],
            status: 'active',
            cor: '#27ae60'
        }
    ];
}

function salvarProfessores() {
    localStorage.setItem(PROFESSORES_KEY, JSON.stringify(professores));
}

function renderizarProfessores() {
    const container = document.getElementById('professores-container');
    if (!container) return;

    container.innerHTML = '';

    professores.forEach(prof => {
        const turmasProf = turmas.filter(t => {
            const modulo = aulaConteudo[t.modulo];
            return modulo && modulo.professor.toLowerCase().includes(prof.nome.toLowerCase().split(' ')[0].toLowerCase());
        });

        const horasTotal = calcularHorasProfessor(prof.id);

        const card = document.createElement('div');
        card.className = 'professor-card';
        card.innerHTML = `
            <div class="professor-avatar-large" style="background: ${prof.cor}">
                ${prof.nome.charAt(0)}
            </div>
            <h3 class="professor-nome">${prof.nome}</h3>
            <p class="professor-email">${prof.email}</p>
            ${prof.mei.certificadoMEI ? '<span class="professor-mei-badge">✅ MEI Ativo</span>' : ''}
            
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--text-secondary);">Turmas ativas:</span>
                    <strong>${turmasProf.filter(t => t.status === 'active').length}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--text-secondary);">Horas este mês:</span>
                    <strong>${horasTotal.horasMes.toFixed(1)}h</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary);">Valor estimado:</span>
                    <strong style="color: var(--success);">R$ ${horasTotal.valorMes.toFixed(2)}</strong>
                </div>
            </div>
            
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button class="btn btn-primary btn-mini" onclick="editarProfessor('${prof.id}')">
                    ✏️ Editar
                </button>
                <button class="btn btn-secondary btn-mini" onclick="verDetalhesProfessor('${prof.id}')">
                    👁️ Detalhes
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function abrirModalProfessor(professorId = null) {
    const modal = document.getElementById('professor-modal');
    const form = document.getElementById('professor-form');
    const titulo = document.getElementById('professor-modal-title');

    if (professorId) {
        const prof = professores.find(p => p.id === professorId);
        if (prof) {
            titulo.textContent = 'Editar Professor';
            document.getElementById('prof-nome').value = prof.nome;
            document.getElementById('prof-email').value = prof.email || '';
            document.getElementById('prof-telefone').value = prof.telefone || '';
            document.getElementById('prof-cnpj').value = prof.mei?.cnpj || '';
            document.getElementById('prof-razao').value = prof.mei?.razaoSocial || '';

            // Marcar módulos
            document.querySelectorAll('input[name="modulos"]').forEach(cb => {
                cb.checked = prof.modulos?.includes(cb.value) || false;
            });

            form.dataset.editId = professorId;
        }
    } else {
        titulo.textContent = 'Cadastrar Professor';
        form.reset();
        form.dataset.editId = '';
    }

    modal.style.display = 'flex';
}

function fecharModalProfessor() {
    document.getElementById('professor-modal').style.display = 'none';
    document.getElementById('professor-form').reset();
}

function salvarProfessor(e) {
    e.preventDefault();

    const form = e.target;
    const editId = form.dataset.editId;

    const modulosSelecionados = Array.from(document.querySelectorAll('input[name="modulos"]:checked'))
        .map(cb => cb.value);

    const dadosProfessor = {
        nome: document.getElementById('prof-nome').value.trim(),
        email: document.getElementById('prof-email').value.trim(),
        telefone: document.getElementById('prof-telefone').value.trim(),
        mei: {
            cnpj: document.getElementById('prof-cnpj').value.trim(),
            razaoSocial: document.getElementById('prof-razao').value.trim(),
            certificadoMEI: true
        },
        modulos: modulosSelecionados,
        status: 'active'
    };

    if (editId) {
        // Editar existente
        const index = professores.findIndex(p => p.id === editId);
        if (index !== -1) {
            professores[index] = { ...professores[index], ...dadosProfessor };
        }
    } else {
        // Novo professor
        const novoId = `PROF-${String(professores.length + 1).padStart(3, '0')}`;
        const cores = ['#2980b9', '#27ae60', '#8e44ad', '#e74c3c', '#f39c12'];
        professores.push({
            id: novoId,
            ...dadosProfessor,
            cor: cores[professores.length % cores.length]
        });
    }

    salvarProfessores();
    renderizarProfessores();
    fecharModalProfessor();
    mostrarNotificacao('Professor salvo com sucesso!');
}

function editarProfessor(professorId) {
    abrirModalProfessor(professorId);
}

function verDetalhesProfessor(professorId) {
    const prof = professores.find(p => p.id === professorId);
    if (!prof) return;

    const turmasProf = turmas.filter(t => {
        const modulo = aulaConteudo[t.modulo];
        return modulo && modulo.professor.toLowerCase().includes(prof.nome.toLowerCase().split(' ')[0].toLowerCase());
    });

    const modal = document.getElementById('aula-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content-container');

    modalTitle.textContent = `Professor: ${prof.nome}`;
    modalTitle.style.color = prof.cor;

    modalContent.innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            <div class="calculo-detalhe">
                <h4 style="margin-bottom: 1rem; color: var(--primary);">📋 Dados Pessoais</h4>
                <div class="calculo-linha">
                    <span class="calculo-label">Nome:</span>
                    <span class="calculo-valor">${prof.nome}</span>
                </div>
                <div class="calculo-linha">
                    <span class="calculo-label">E-mail:</span>
                    <span class="calculo-valor">${prof.email || '-'}</span>
                </div>
                <div class="calculo-linha">
                    <span class="calculo-label">Telefone:</span>
                    <span class="calculo-valor">${prof.telefone || '-'}</span>
                </div>
            </div>
            
            <div class="calculo-detalhe">
                <h4 style="margin-bottom: 1rem; color: var(--primary);">🏢 Dados MEI</h4>
                <div class="calculo-linha">
                    <span class="calculo-label">CNPJ:</span>
                    <span class="calculo-valor">${prof.mei?.cnpj || 'Não informado'}</span>
                </div>
                <div class="calculo-linha">
                    <span class="calculo-label">Razão Social:</span>
                    <span class="calculo-valor">${prof.mei?.razaoSocial || 'Não informado'}</span>
                </div>
                <div class="calculo-linha">
                    <span class="calculo-label">Status MEI:</span>
                    <span class="calculo-valor" style="color: var(--success);">✅ Ativo</span>
                </div>
            </div>
            
            <div class="calculo-detalhe">
                <h4 style="margin-bottom: 1rem; color: var(--primary);">📚 Turmas (${turmasProf.length})</h4>
                ${turmasProf.map(t => `
                    <div class="calculo-linha">
                        <span class="calculo-label">${t.nome}</span>
                        <span class="calculo-valor">${t.horario}</span>
                    </div>
                `).join('') || '<p style="color: var(--text-secondary);">Nenhuma turma atribuída</p>'}
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// ==========================================
// CÁLCULO DE HORAS TRABALHADAS
// ==========================================

function calcularHorasProfessor(professorId) {
    const prof = professores.find(p => p.id === professorId);
    if (!prof) return { horasMes: 0, valorMes: 0 };

    const turmasProf = turmas.filter(t => {
        const modulo = aulaConteudo[t.modulo];
        return modulo && modulo.professor.toLowerCase().includes(prof.nome.toLowerCase().split(' ')[0].toLowerCase());
    });

    const historico = carregarHistorico();
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    let totalHoras = 0;

    turmasProf.forEach(turma => {
        const historicoTurma = historico[turma.id] || [];

        historicoTurma.forEach(entrada => {
            const dataAula = new Date(entrada.data);
            if (dataAula.getMonth() === mesAtual && dataAula.getFullYear() === anoAtual) {
                // Calcular duração da aula (padrão 2.5 horas)
                const duracao = parseDuracao(aulaConteudo[turma.modulo]?.aulas[0]?.duracao || '2h30min');
                totalHoras += duracao;
            }
        });
    });

    const valorBase = totalHoras * REMUNERACAO_CONFIG.horaAulaBase;

    return {
        horasMes: totalHoras,
        valorMes: valorBase,
        valorComBonificacao: totalHoras * REMUNERACAO_CONFIG.horaAulaComBonificacao,
        retencao: valorBase * (REMUNERACAO_CONFIG.retencaoPercent / 100)
    };
}

function parseDuracao(duracaoStr) {
    // Converte "2h30min" para 2.5
    const match = duracaoStr.match(/(\d+)h(\d+)?/);
    if (match) {
        const horas = parseInt(match[1]) || 0;
        const minutos = parseInt(match[2]) || 0;
        return horas + (minutos / 60);
    }
    return 2.5; // Valor padrão
}

function popularMeses() {
    const select = document.getElementById('mes-selecionado');
    if (!select) return;

    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    select.innerHTML = '';

    // Últimos 6 meses + mês atual + próximos 2
    for (let i = -6; i <= 2; i++) {
        let mes = mesAtual + i;
        let ano = anoAtual;

        if (mes < 0) {
            mes += 12;
            ano--;
        } else if (mes > 11) {
            mes -= 12;
            ano++;
        }

        const option = document.createElement('option');
        option.value = `${ano}-${String(mes + 1).padStart(2, '0')}`;
        option.textContent = `${meses[mes]} ${ano}`;
        if (i === 0) option.selected = true;
        select.appendChild(option);
    }
}

function atualizarHoras() {
    const container = document.getElementById('horas-container');
    if (!container) return;

    const select = document.getElementById('mes-selecionado');
    const mesAno = select?.value || '';
    const [ano, mes] = mesAno.split('-').map(Number);

    container.innerHTML = '';

    professores.forEach(prof => {
        const horas = calcularHorasMesProfessor(prof.id, mes - 1, ano);

        const card = document.createElement('div');
        card.className = 'setup-container';
        card.style.marginBottom = '1.5rem';
        card.innerHTML = `
            <h3 class="setup-title" style="color: ${prof.cor};">
                ${prof.nome}
            </h3>
            
            <div class="horas-resumo">
                <div class="hora-item">
                    <div class="hora-valor">${horas.horasAula.toFixed(1)}</div>
                    <div class="hora-label">Horas de Aula</div>
                </div>
                <div class="hora-item">
                    <div class="hora-valor">${horas.aulasRealizadas}</div>
                    <div class="hora-label">Aulas Realizadas</div>
                </div>
                <div class="hora-item">
                    <div class="hora-valor" style="color: var(--success);">R$ ${horas.valorBruto.toFixed(2)}</div>
                    <div class="hora-label">Valor Bruto</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">@ R$ ${REMUNERACAO_CONFIG.horaAulaBase.toFixed(2)}/h</div>
                </div>
                <div class="hora-item">
                    <div class="hora-valor" style="color: var(--primary);">R$ ${horas.valorComBonificacao.toFixed(2)}</div>
                    <div class="hora-label">c/ Bonificação 33%</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">@ R$ ${REMUNERACAO_CONFIG.horaAulaComBonificacao.toFixed(2)}/h</div>
                </div>
            </div>
            
            <div class="calculo-detalhe">
                <div class="calculo-linha">
                    <span class="calculo-label">Total de horas-aula:</span>
                    <span class="calculo-valor">${horas.horasAula.toFixed(1)}h</span>
                </div>
                <div class="calculo-linha">
                    <span class="calculo-label">Valor por hora (base):</span>
                    <span class="calculo-valor">R$ ${REMUNERACAO_CONFIG.horaAulaBase.toFixed(2)}</span>
                </div>
                <div class="calculo-linha">
                    <span class="calculo-label">Valor bruto:</span>
                    <span class="calculo-valor">R$ ${horas.valorBruto.toFixed(2)}</span>
                </div>
                <div class="calculo-linha">
                    <span class="calculo-label">Retenção (${REMUNERACAO_CONFIG.retencaoPercent}%):</span>
                    <span class="calculo-valor">R$ ${(horas.valorBruto * REMUNERACAO_CONFIG.retencaoPercent / 100).toFixed(2)}</span>
                </div>
                <div class="calculo-linha" style="font-weight: 700; color: var(--success);">
                    <span class="calculo-label">Valor a Pagar:</span>
                    <span class="calculo-valor">R$ ${(horas.valorBruto * REMUNERACAO_CONFIG.retencaoPercent / 100).toFixed(2)}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function calcularHorasMesProfessor(professorId, mes, ano) {
    const prof = professores.find(p => p.id === professorId);
    if (!prof) return { horasAula: 0, aulasRealizadas: 0, valorBruto: 0, valorComBonificacao: 0 };

    const turmasProf = turmas.filter(t => {
        const modulo = aulaConteudo[t.modulo];
        return modulo && modulo.professor.toLowerCase().includes(prof.nome.toLowerCase().split(' ')[0].toLowerCase());
    });

    const historico = carregarHistorico();

    let totalHoras = 0;
    let aulasRealizadas = 0;

    turmasProf.forEach(turma => {
        const historicoTurma = historico[turma.id] || [];

        historicoTurma.forEach(entrada => {
            const dataAula = new Date(entrada.data);
            if (dataAula.getMonth() === mes && dataAula.getFullYear() === ano) {
                const duracao = parseDuracao(aulaConteudo[turma.modulo]?.aulas[0]?.duracao || '2h30min');
                totalHoras += duracao;
                aulasRealizadas++;
            }
        });
    });

    return {
        horasAula: totalHoras,
        aulasRealizadas: aulasRealizadas,
        valorBruto: totalHoras * REMUNERACAO_CONFIG.horaAulaBase,
        valorComBonificacao: totalHoras * REMUNERACAO_CONFIG.horaAulaComBonificacao
    };
}

// ==========================================
// CRONOGRAMA SEMANAL
// ==========================================

let semanaOffset = 0;

function mudarSemana(offset) {
    if (offset === 0) {
        semanaOffset = 0;
    } else {
        semanaOffset += offset;
    }
    renderizarCronograma();
}

function renderizarCronograma() {
    const container = document.getElementById('cronograma-container');
    if (!container) return;

    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const diasNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const hoje = new Date();
    hoje.setDate(hoje.getDate() + (semanaOffset * 7));

    // Encontrar segunda-feira da semana
    const diaSemana = hoje.getDay();
    const diff = diaSemana === 0 ? -6 : 1 - diaSemana;
    const segundaFeira = new Date(hoje);
    segundaFeira.setDate(hoje.getDate() + diff);

    let html = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <h3 style="color: var(--text);">
                Semana de ${formatarDataCurta(segundaFeira)} a ${formatarDataCurta(new Date(segundaFeira.getTime() + 5 * 24 * 60 * 60 * 1000))}
            </h3>
        </div>
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem;">
    `;

    diasSemana.forEach((dia, index) => {
        const dataDia = new Date(segundaFeira);
        dataDia.setDate(segundaFeira.getDate() + index);

        const turmasDia = turmas.filter(t => t.dias.includes(dia));
        turmasDia.sort((a, b) => {
            const horaA = a.horario.split(' - ')[0];
            const horaB = b.horario.split(' - ')[0];
            return horaA.localeCompare(horaB);
        });

        html += `
            <div style="background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--border-radius); overflow: hidden;">
                <div style="background: var(--primary); color: white; padding: 0.75rem; text-align: center;">
                    <div style="font-weight: 600;">${diasNomes[index]}</div>
                    <div style="font-size: 0.8rem; opacity: 0.9;">${formatarDataCurta(dataDia)}</div>
                </div>
                <div style="padding: 0.75rem; min-height: 200px;">
        `;

        if (turmasDia.length === 0) {
            html += '<p style="color: var(--text-secondary); text-align: center; font-size: 0.85rem;">Sem aulas</p>';
        } else {
            turmasDia.forEach(turma => {
                const modulo = aulaConteudo[turma.modulo];
                html += `
                    <div style="background: ${modulo.cor}15; border-left: 3px solid ${modulo.cor}; padding: 0.5rem; margin-bottom: 0.5rem; border-radius: 4px; font-size: 0.8rem;">
                        <div style="font-weight: 600; color: ${modulo.cor};">${turma.horario}</div>
                        <div style="color: var(--text);">${modulo.nome}</div>
                        <div style="color: var(--text-secondary); font-size: 0.75rem;">Prof. ${modulo.professor}</div>
                    </div>
                `;
            });
        }

        html += '</div></div>';
    });

    html += '</div>';
    container.innerHTML = html;
}

function formatarDataCurta(data) {
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// ==========================================
// DASHBOARD
// ==========================================

function atualizarDashboard() {
    // Estatísticas
    const statTurmas = document.getElementById('stat-total-turmas');
    const statAtivas = document.getElementById('stat-turmas-ativas');
    const statProfs = document.getElementById('stat-professores');
    const statHoras = document.getElementById('stat-horas-mes');

    if (statTurmas) statTurmas.textContent = turmas.length;
    if (statAtivas) statAtivas.textContent = turmas.filter(t => t.status === 'active').length;
    if (statProfs) statProfs.textContent = professores.length;

    // Calcular horas totais do mês
    let horasTotais = 0;
    professores.forEach(prof => {
        horasTotais += calcularHorasProfessor(prof.id).horasMes;
    });
    if (statHoras) statHoras.textContent = `${horasTotais.toFixed(1)}h`;

    // Top professores
    renderizarTopProfessores();

    // Próximas aulas
    renderizarProximasAulas();
}

function renderizarTopProfessores() {
    const container = document.getElementById('top-professores');
    if (!container) return;

    // Ordenar professores por número de turmas ativas
    const profsComTurmas = professores.map(prof => {
        const turmasProf = turmas.filter(t => {
            const modulo = aulaConteudo[t.modulo];
            return modulo && modulo.professor.toLowerCase().includes(prof.nome.toLowerCase().split(' ')[0].toLowerCase());
        });
        return {
            ...prof,
            turmasAtivas: turmasProf.filter(t => t.status === 'active').length,
            horasMes: calcularHorasProfessor(prof.id).horasMes
        };
    }).sort((a, b) => b.turmasAtivas - a.turmasAtivas);

    let html = '';

    profsComTurmas.forEach(prof => {
        html += `
            <div class="employee-item">
                <div class="employee-avatar" style="background: ${prof.cor};">${prof.nome.charAt(0)}</div>
                <div class="employee-info">
                    <div class="employee-name">${prof.nome}</div>
                    <div class="employee-sub">${prof.turmasAtivas} turmas ativas</div>
                </div>
                <div class="employee-value">${prof.horasMes.toFixed(1)}h</div>
            </div>
        `;
    });

    if (profsComTurmas.length === 0) {
        html = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">Nenhum professor cadastrado</p>';
    }

    container.innerHTML = html;
}

function renderizarProximasAulas() {
    const container = document.getElementById('proximas-aulas');
    if (!container) return;

    const hoje = new Date();
    const diaSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][hoje.getDay()];

    // Turmas de hoje
    const turmasHoje = turmas.filter(t => t.dias.includes(diaSemana) && t.status !== 'completed');
    turmasHoje.sort((a, b) => {
        const horaA = a.horario.split(' - ')[0];
        const horaB = b.horario.split(' - ')[0];
        return horaA.localeCompare(horaB);
    });

    if (turmasHoje.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;"><i class="bi bi-calendar-x" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>Nenhuma aula programada para hoje.</p>';
        return;
    }

    let html = '<div class="upcoming-classes">';

    turmasHoje.forEach(turma => {
        const modulo = aulaConteudo[turma.modulo];
        html += `
            <div class="upcoming-item" style="border-left-color: ${modulo.cor};">
                <div class="upcoming-time">${turma.horario}</div>
                <div class="upcoming-info">
                    <div class="upcoming-name">${turma.nome}</div>
                    <div class="upcoming-module">${modulo.nome} - Prof. ${modulo.professor}</div>
                </div>
                <div class="upcoming-progress">Aula ${turma.aulaAtual + 1}/${turma.totalAulas}</div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}