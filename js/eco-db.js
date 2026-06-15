// EcoEscambo T2 — persistência (localStorage)
(function () {
  'use strict';

  var KEY_USUARIOS = 'eco_usuarios';
  var KEY_PRODUTOS = 'eco_produtos';
  var KEY_INTERESSES = 'eco_interesses';
  var KEY_PROPOSTAS = 'eco_propostas';

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function nextId(list) {
    if (!list || !list.length) return 1;
    return list.reduce(function (m, x) {
      return Math.max(m, x && x.id ? x.id : 0);
    }, 0) + 1;
  }

  function seed() {
    writeJson(KEY_USUARIOS, [
      { id: 1, nome: 'M. Belo', email: 'mbelo@teste.com.br', senha: '123456', ativo: true },
      { id: 2, nome: 'Jamile', email: 'jamile@teste.com.br', senha: '123456', ativo: true }
    ]);

    writeJson(KEY_PRODUTOS, [
      {
        id: 1,
        slug: 'livros-tecnicos',
        titulo: 'Coleção de livros técnicos',
        categoria: 'Livros',
        foto: '../image/livro.jpg',
        desc: '5 livros de programação em ótimo estado. SQL, JavaScript e mais.',
        ofertanteEmail: 'jamile@teste.com.br',
        iniciais: 'JA',
        estado: 'aberto'
      },
      {
        id: 2,
        slug: 'violao',
        titulo: 'Violão acústico',
        categoria: 'Música',
        foto: '../image/vialoafolk.jpg',
        desc: 'Violão em bom estado, afinador incluso. Pouco uso.',
        ofertanteEmail: 'mbelo@teste.com.br',
        iniciais: 'MB',
        estado: 'aberto'
      },
      {
        id: 3,
        slug: 'celular',
        titulo: 'Telefone Motorola',
        categoria: 'Eletrônicos',
        foto: '../image/celular.jpg',
        desc: 'Telefone Motorola em funcionamento perfeito. Carregador incluso.',
        ofertanteEmail: 'mbelo@teste.com.br',
        iniciais: 'MB',
        estado: 'aberto'
      }
    ]);

    writeJson(KEY_INTERESSES, []);
    writeJson(KEY_PROPOSTAS, []);
  }

  function ensureSeed() {
    var usuarios = readJson(KEY_USUARIOS, null);
    var produtos = readJson(KEY_PRODUTOS, null);
    if (!usuarios || !usuarios.length || !produtos || !produtos.length) {
      seed();
      return;
    }
    var emailsTeste = ['mbelo@teste.com.br', 'jamile@teste.com.br'];
    var falta = emailsTeste.some(function (em) {
      return !usuarios.some(function (u) { return u.email === em; });
    });
    if (falta) seed();
    if (!readJson(KEY_INTERESSES, null)) writeJson(KEY_INTERESSES, []);
    if (!readJson(KEY_PROPOSTAS, null)) writeJson(KEY_PROPOSTAS, []);
  }

  window.EcoDB = {
    ensureSeed: ensureSeed,
    nextId: nextId,
    getUsuarios: function () { return readJson(KEY_USUARIOS, []); },
    salvarUsuarios: function (l) { writeJson(KEY_USUARIOS, l); },
    getProdutos: function () { return readJson(KEY_PRODUTOS, []); },
    salvarProdutos: function (l) { writeJson(KEY_PRODUTOS, l); },
    getInteresses: function () { return readJson(KEY_INTERESSES, []); },
    salvarInteresses: function (l) { writeJson(KEY_INTERESSES, l); },
    getPropostas: function () { return readJson(KEY_PROPOSTAS, []); },
    salvarPropostas: function (l) { writeJson(KEY_PROPOSTAS, l); },
    getUsuarioPorEmail: function (email) {
      return readJson(KEY_USUARIOS, []).find(function (u) { return u.email === email; });
    },
    getProdutoPorId: function (id) {
      return readJson(KEY_PRODUTOS, []).find(function (p) { return p.id === id; });
    },
    getProdutoPorSlug: function (slug) {
      return readJson(KEY_PRODUTOS, []).find(function (p) { return p.slug === slug; });
    },
    getProdutosAbertos: function () {
      return readJson(KEY_PRODUTOS, []).filter(function (p) { return p.estado === 'aberto'; });
    }
  };
})();
