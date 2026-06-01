-- =============================================================
--  EcoEscambo — carga.sql
--  Dados iniciais de teste
--  Senha em texto plano: patasdeGalinha1
--  (em produção usar hash bcrypt/argon2 na coluna 'senha')
-- =============================================================

USE ecoescambo;

-- ── UTILIZADORES DE TESTE ─────────────────────────────────────
INSERT INTO utilizadores (nome, email, senha, ativo) VALUES
  ('Mbelo Silva',  'mbelo@teste.com.br',  'patasdeGalinha1', 1),
  ('Jamile Souza', 'jamile@teste.com.br', 'patasdeGalinha1', 1),
  ('Ana Paula',    'ana@teste.com.br',    'patasdeGalinha1', 1);

-- ── PRODUTOS — Jamile (id=2) — 5 produtos ─────────────────────
INSERT INTO produtos (titulo, categoria, descricao, foto, id_utilizador, status) VALUES
  ('Coleção de livros técnicos', 'Livros',
   '5 livros de programação em ótimo estado. Inclui Clean Code e Pragmatic Programmer.',
   'image/livro.jpg', 2, 'aberto'),

  ('Violão folk acústico', 'Música',
   'Violão em bom estado, cordas novas, afinador de clip incluso.',
   'image/vialoafolk.jpg', 2, 'aberto'),

  ('Monitor 24" Full HD', 'Eletrônicos',
   'Monitor IPS sem arranhões, cabo HDMI incluso.',
   'image/monitor.jpg', 2, 'aberto'),

  ('Câmera fotográfica digital', 'Eletrônicos',
   'Câmera compacta 16MP, 3 baterias e cartão SD 32GB inclusos.',
   'image/camera.jpg', 2, 'aberto'),

  ('HQ Marvel — coleção completa', 'Livros',
   '12 volumes encadernados em ótimo estado. Sem manchas ou rasuras.',
   'image/livroMarvel.jpg', 2, 'aberto');

-- ── PRODUTOS — Mbelo (id=1) — 5 produtos ──────────────────────
INSERT INTO produtos (titulo, categoria, descricao, foto, id_utilizador, status) VALUES
  ('Telefone Motorola G84', 'Eletrônicos',
   'Funcionamento perfeito, sem marcas de uso. Carregador e capa originais inclusos.',
   'image/celular.jpg', 1, 'aberto'),

  ('Bicicleta urbana aro 26', 'Esportes',
   'Freios revisados, marcha 21 velocidades. Ideal para uso diário.',
   'image/bicicleta.jpg', 1, 'aberto'),

  ('Kit de jardinagem completo', 'Casa',
   'Pá, rastelo, tesoura de poda, avental e bolsa organizadora.',
   'image/kitjardinagem.jpg', 1, 'aberto'),

  ('Console retrô + 2 controles', 'Games',
   'Super Nintendo com 15 jogos originais. Funciona perfeitamente.',
   'image/videogame.jpg', 1, 'aberto'),

  ('Controle PS4 DualShock', 'Games',
   'Controle original Sony em bom estado, cabo USB incluso.',
   'image/controle.jpg', 1, 'aberto');
