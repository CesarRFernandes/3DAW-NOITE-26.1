-- =============================================================
--  EcoEscambo — cria_banco.sql
--  Script de criação do banco de dados relacional
--  (MySQL)
-- =============================================================

CREATE DATABASE IF NOT EXISTS ecoescambo
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ecoescambo;

-- ── UTILIZADORES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS utilizadores (
  id       INT          NOT NULL AUTO_INCREMENT,
  nome     VARCHAR(120) NOT NULL,
  email    VARCHAR(120) NOT NULL UNIQUE,
  senha    VARCHAR(255) NOT NULL,   -- hash bcrypt em produção
  ativo    TINYINT(1)   NOT NULL DEFAULT 0,
  criado_em DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ── PRODUTOS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produtos (
  id           INT          NOT NULL AUTO_INCREMENT,
  titulo       VARCHAR(200) NOT NULL,
  categoria    VARCHAR(80)  NOT NULL,
  descricao    TEXT,
  foto         VARCHAR(300),
  id_utilizador INT         NOT NULL,
  status       ENUM('aberto','finalizado') NOT NULL DEFAULT 'aberto',
  criado_em    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (id_utilizador) REFERENCES utilizadores(id) ON DELETE CASCADE
);

-- ── INTERESSES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interesses (
  id                  INT  NOT NULL AUTO_INCREMENT,
  id_produto          INT  NOT NULL,
  id_utilizador_interessado INT NOT NULL,
  status              ENUM('pendente','proposto','removido') NOT NULL DEFAULT 'pendente',
  criado_em           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (id_produto)               REFERENCES produtos(id)      ON DELETE CASCADE,
  FOREIGN KEY (id_utilizador_interessado) REFERENCES utilizadores(id)  ON DELETE CASCADE
);

-- ── PROPOSTAS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS propostas (
  id                      INT  NOT NULL AUTO_INCREMENT,
  id_interesse            INT  NOT NULL,
  id_produto_interessado  INT  NOT NULL,  -- produto que o interessado oferece
  id_produto_ofertante    INT  NOT NULL,  -- produto que o ofertante propõe
  id_utilizador_ofertante INT  NOT NULL,
  status  ENUM('aguardando','aceita','recusada') NOT NULL DEFAULT 'aguardando',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (id_interesse)            REFERENCES interesses(id)    ON DELETE CASCADE,
  FOREIGN KEY (id_produto_interessado)  REFERENCES produtos(id)      ON DELETE CASCADE,
  FOREIGN KEY (id_produto_ofertante)    REFERENCES produtos(id)      ON DELETE CASCADE,
  FOREIGN KEY (id_utilizador_ofertante) REFERENCES utilizadores(id)  ON DELETE CASCADE
);

-- ── AVALIAÇÕES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS avaliacoes (
  id           INT  NOT NULL AUTO_INCREMENT,
  id_proposta  INT  NOT NULL,
  id_avaliador INT  NOT NULL,
  nota         TINYINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario   TEXT,
  criado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (id_proposta)  REFERENCES propostas(id)     ON DELETE CASCADE,
  FOREIGN KEY (id_avaliador) REFERENCES utilizadores(id)  ON DELETE CASCADE
);
