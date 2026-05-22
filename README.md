# 🎓 EduAI - Assistente Inteligente Escolar

Bem-vindo ao **EduAI**, o seu Assistente Inteligente Escolar! Este projeto é uma aplicação web interativa projetada para ajudar estudantes com dúvidas escolares, resumos e explicações didáticas sobre qualquer matéria.

A aplicação utiliza inteligência artificial generativa conectada a uma interface moderna, amigável e responsiva. O projeto foi configurado utilizando o modelo **LLaMA 3.3 70B** através da API da **Groq**, garantindo respostas ultrarrápidas, de alta qualidade e contornando limites de taxa de requisição comuns em outras APIs.

---

## ✨ Funcionalidades

- **Chat Interativo:** Interface limpa e minimalista no estilo mensageiro.
- **Respostas Rápidas e Didáticas:** A IA foi instruída a atuar como um professor particular, fornecendo explicações simples e fáceis de entender.
- **Interface Responsiva e Moderna:** Desenvolvida com HTML, CSS puro e JavaScript Vanilla, com um design atraente sem depender de frameworks pesados.
- **Feedback de "IA Digitando":** Indica quando a requisição está sendo processada.
- **Usabilidade Otimizada:** Suporte ao envio de mensagens com a tecla "Enter" e rolagem automática (auto-scroll) da tela de mensagens.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - HTML5, CSS3, JavaScript (Vanilla JS)
  - [FontAwesome](https://fontawesome.com/) para ícones e [Google Fonts](https://fonts.google.com/) (Outfit)
- **Backend:**
  - [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/)
  - [TypeScript](https://www.typescriptlang.org/) (executado via `tsx`)
  - [Groq SDK](https://console.groq.com/) para integração com o modelo de LLM.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js instalado na sua máquina.
- Uma chave de API da [Groq](https://console.groq.com/keys) (Gratuita para desenvolvedores).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/EnzoFirmo14/simulador-de-agente-inteligente.git
   cd simulador-de-agente-inteligente
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configuração de Variáveis de Ambiente:**
   - Crie um arquivo chamado `.env` na raiz do projeto (ou copie o `.env.example`).
   - Adicione a sua chave de API no arquivo:
     ```env
     GROQ_API_KEY=sua_chave_api_da_groq_aqui
     ```

4. **Inicie o Servidor:**
   ```bash
   npm run dev
   ```

5. **Acesse a Aplicação:**
   - Abra o seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

---

## 📂 Estrutura do Projeto

```text
├── public/                 # Arquivos estáticos do Frontend
│   ├── index.html          # Marcação HTML da página
│   ├── style.css           # Estilos e design do layout
│   └── script.js           # Lógica do chat, envio de mensagens e animações
├── server.ts               # Servidor Node.js/Express, integra API e serve arquivos
├── package.json            # Dependências e scripts npm
├── .env                    # Variáveis de ambiente com chaves de API (ignorado pelo git)
└── README.md               # Documentação
```

---

## 💡 Dicas de Uso

Ao interagir com o Assistente, experimente pedir coisas como:
- *"Pode me explicar como funciona a fotossíntese como se eu tivesse 10 anos?"*
- *"Faça um resumo dos principais motivos da Revolução Francesa."*
- *"Quais as fórmulas mais importantes da física para o vestibular?"*

A IA é instruída para usar exemplos e ser extremamente didática!

---

## 📄 Relatório Acadêmico

Este projeto conta com um relatório acadêmico detalhado que documenta o processo de idealização, desenvolvimento e decisões de design do Assistente Inteligente Escolar. Você pode acessar o documento completo em PDF diretamente no repositório:
- [Visualizar Relatório Acadêmico (PDF)](EDUAI_Relatorio_Academico.pdf)

---

## 🤝 Contribuições

Sinta-se à vontade para fazer um _fork_ deste projeto, submeter _Pull Requests_ com melhorias, ou abrir _Issues_ relatando problemas. 
