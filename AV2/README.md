# EcoEscambo — T2

Sistema web de trocas ecológicas. Permite que utilizadores cadastrem produtos,
manifestem interesse em itens de outros utilizadores e negociem trocas diretas.

---

## Estrutura do projeto

```
ecoescambo/
├── css/
│   └── styles.css          # Todo o CSS externo do projeto
├── image/                  # Imagens dos produtos e logotipo
├── js/
│   ├── validacao.js        # Sessão, validação, CRUD no localStorage
│   └── componentes.js      # Navbar e rodapé reutilizáveis
├── pages/
│   ├── login.html
│   ├── cadastro.html
│   ├── ativar-conta.html
│   ├── recuperar-senha.html
│   ├── nova-senha.html
│   ├── explorar.html       # Catálogo público (paginado, filtros)
│   ├── detalhe-produto.html
│   ├── cadastro-produto.html  # Requer autenticação
│   ├── meus-produtos.html     # Requer autenticação
│   ├── ver-interesses.html    # Requer autenticação
│   ├── analise-oferta.html    # Requer autenticação
│   ├── propostas.html         # Requer autenticação
│   └── avaliar.html           # Requer autenticação
└── sql/
    ├── cria_banco.sql      # DDL: criação das tabelas (MySQL/MariaDB)
    └── carga.sql           # DML: dados iniciais de teste
```

---

## Como executar (frontend estático)

Abra qualquer página da pasta `pages/` num navegador moderno.
Todos os dados são persistidos no **localStorage** do navegador,
simulando o banco de dados enquanto o backend não é implementado.

> **Não é necessário servidor** para rodar o frontend.
> Para um ambiente com backend real, use o script SQL em `sql/`.

---

## Credenciais de teste

| Utilizador       | E-mail                   | Senha             |
|------------------|--------------------------|-------------------|
| Mbelo Silva      | mbelo@teste.com.br       | patasdeGalinha1   |
| Jamile Souza     | jamile@teste.com.br      | patasdeGalinha1   |

Cada utilizador possui **5 produtos** pré-cadastrados.

---

## Fluxo principal — Cenários de teste da T2

### Cenário de Teste — Cadastro de utilizador

1. Acesse `cadastro.html`
2. Preencha nome, e-mail e senha válida (≥6 chars, maiúscula, minúscula, número)
3. Clique em **Cadastrar**
4. Mensagem exibida: *"Utilizador registrado com sucesso. Ative sua conta com o link enviado para seu e-mail."*
5. Clique no link de ativação simulado
6. Faça login com as credenciais cadastradas
7. Todas as páginas exceto `explorar.html` redirecionam para login se não autenticado

### Cenário de Teste 1 — Rejeição de interesse

1. Login como `mbelo@teste.com.br`
2. Em `explorar.html`, clique em **Tenho interesse** no primeiro produto de `jamile@teste.com.br`
3. Login como `jamile@teste.com.br`
4. Acesse `ver-interesses.html`
5. Clique em **Não tenho interesse por nenhum** no interesse do Mbelo
6. O interesse é removido e desaparece da lista

### Cenário de Teste 3 — Troca aceita

1. Login como `mbelo@teste.com.br`
2. Em `explorar.html`, clique em **Tenho interesse** no primeiro produto de `jamile@teste.com.br`
3. Login como `jamile@teste.com.br`
4. Acesse `ver-interesses.html`
5. Clique em **Propor** no segundo produto de `mbelo@teste.com.br`
6. Login como `mbelo@teste.com.br`
7. Acesse `analise-oferta.html` (ou via `propostas.html` → *Avaliar proposta*)
8. Clique em **Aceitar**
9. Ambos os produtos são marcados como *Finalizada* e saem do catálogo

---

## Regras de validação (servidor/JS)

| Campo     | Regra                                              |
|-----------|----------------------------------------------------|
| Nome      | Mínimo 2 caracteres                               |
| E-mail    | Formato válido `nome@servidor.com`                |
| Senha     | ≥ 6 caracteres, ao menos 1 maiúscula, 1 minúscula, 1 número |
| Confirmação | Deve ser idêntica à senha                       |

Validações são aplicadas em tempo real com feedback visual nos campos
(borda verde/vermelha e mensagem descritiva).

---

## Banco de dados (SQL)

### Criar o banco
```sql
SOURCE sql/cria_banco.sql;
```

### Carregar dados de teste
```sql
SOURCE sql/carga.sql;
```

### Tabelas

| Tabela        | Descrição                                     |
|---------------|-----------------------------------------------|
| utilizadores  | Contas de utilizador (nome, email, senha, ativo) |
| produtos      | Itens ofertados (título, categoria, status)   |
| interesses    | Manifestações de interesse num produto        |
| propostas     | Propostas de troca entre utilizadores         |
| avaliacoes    | Avaliações pós-troca com nota e comentário    |

---

## Decisões técnicas

- **Persistência**: `localStorage` (client-side) simula o banco durante o frontend.
  Os scripts SQL (`cria_banco.sql` / `carga.sql`) documentam o schema relacional
  equivalente para integração com backend.
- **Modularização JS**: `validacao.js` centraliza todas as funções reutilizáveis;
  `componentes.js` gera navbar e rodapé dinamicamente, evitando repetição de HTML.
- **CSS externo**: todo o estilo está em `styles.css`. Nenhuma página usa `<style>`
  interno nem atributos `style=""`.
- **Proteção de rotas**: `exigirAutenticacao()` redireciona para `login.html` em
  todas as páginas protegidas, exceto `explorar.html` e `detalhe-produto.html`.
- **Conta desativada**: contas novas nascem com `ativo: false`. O link de ativação
  usa o e-mail como parâmetro de URL (simula token). Login com conta inativa exibe
  mensagem clara ao utilizador.
