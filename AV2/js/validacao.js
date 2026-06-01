/* =============================================================
   EcoEscambo — validacao.js
   Módulo central: sessão, validação, dados (localStorage)
   ============================================================= */

/* ── UTILITÁRIOS DE ARMAZENAMENTO ── */

function getUsuarios() {
  return JSON.parse(localStorage.getItem('eco_usuarios') || '[]');
}
function salvarUsuarios(lista) {
  localStorage.setItem('eco_usuarios', JSON.stringify(lista));
}

function getSessao() {
  return JSON.parse(localStorage.getItem('eco_sessao') || 'null');
}
function salvarSessao(usuario) {
  localStorage.setItem('eco_sessao', JSON.stringify(usuario));
}
function encerrarSessao() {
  localStorage.removeItem('eco_sessao');
}

function getProdutos() {
  return JSON.parse(localStorage.getItem('eco_produtos') || '[]');
}
function salvarProdutos(lista) {
  localStorage.setItem('eco_produtos', JSON.stringify(lista));
}

function getInteresses() {
  return JSON.parse(localStorage.getItem('eco_interesses') || '[]');
}
function salvarInteresses(lista) {
  localStorage.setItem('eco_interesses', JSON.stringify(lista));
}

function getPropostas() {
  return JSON.parse(localStorage.getItem('eco_propostas') || '[]');
}
function salvarPropostas(lista) {
  localStorage.setItem('eco_propostas', JSON.stringify(lista));
}

/* ── SEED: dados de carga inicial (equivalente ao carga.sql) ──
   Usuários: mbelo@teste.com.br e jamile@teste.com.br
   Senha: patasdeGalinha1 (≥6 chars, maiúscula, minúscula, número)
   Cada um com 5 produtos ofertados
   ── */
function seedDados() {
  var usuarios = getUsuarios();

  var usuariosSeed = [
    { nome: 'Mbelo Silva',    email: 'mbelo@teste.com.br',  senha: 'patasdeGalinha1', ativo: true },
    { nome: 'Jamile Souza',   email: 'jamile@teste.com.br', senha: 'patasdeGalinha1', ativo: true },
    { nome: 'Ana Paula',      email: 'ana@teste.com.br',    senha: 'patasdeGalinha1', ativo: true }
  ];

  usuariosSeed.forEach(function(seed) {
    if (!usuarios.find(function(u) { return u.email === seed.email; })) {
      usuarios.push(seed);
    }
  });
  salvarUsuarios(usuarios);

  if (getProdutos().length === 0) {
    var produtos = [
      /* 5 produtos da Jamile */
      { id: 'p1', titulo: 'Coleção de livros técnicos', categoria: 'Livros',
        descricao: '5 livros de programação em ótimo estado. Inclui Clean Code, Pragmatic Programmer e outros clássicos.',
        foto: '../image/livro.jpg', email: 'jamile@teste.com.br', status: 'aberto' },
      { id: 'p2', titulo: 'Violão folk acústico', categoria: 'Música',
        descricao: 'Violão em bom estado, cordas novas, afinador de clip incluso.',
        foto: '../image/vialoafolk.jpg', email: 'jamile@teste.com.br', status: 'aberto' },
      { id: 'p3', titulo: 'Monitor 24" Full HD', categoria: 'Eletrônicos',
        descricao: 'Monitor IPS sem arranhões, cabo HDMI incluso. Excelente para trabalho.',
        foto: '../image/monitor.jpg', email: 'jamile@teste.com.br', status: 'aberto' },
      { id: 'p4', titulo: 'Câmera fotográfica digital', categoria: 'Eletrônicos',
        descricao: 'Câmera compacta 16MP, 3 baterias e cartão SD 32GB inclusos.',
        foto: '../image/camera.jpg', email: 'jamile@teste.com.br', status: 'aberto' },
      { id: 'p5', titulo: 'HQ Marvel — coleção completa', categoria: 'Livros',
        descricao: '12 volumes encadernados em ótimo estado. Sem manchas ou rasuras.',
        foto: '../image/livroMarvel.jpg', email: 'jamile@teste.com.br', status: 'aberto' },

      /* 5 produtos do Mbelo */
      { id: 'p6', titulo: 'Telefone Motorola G84', categoria: 'Eletrônicos',
        descricao: 'Funcionamento perfeito, sem marcas de uso. Carregador e capa originais inclusos.',
        foto: '../image/celular.jpg', email: 'mbelo@teste.com.br', status: 'aberto' },
      { id: 'p7', titulo: 'Bicicleta urbana aro 26', categoria: 'Esportes',
        descricao: 'Freios revisados, marcha 21 velocidades. Ideal para uso diário na cidade.',
        foto: '../image/bicicleta.jpg', email: 'mbelo@teste.com.br', status: 'aberto' },
      { id: 'p8', titulo: 'Kit de jardinagem completo', categoria: 'Casa',
        descricao: 'Pá, rastelo, tesoura de poda, avental e bolsa organizadora.',
        foto: '../image/kitjardinagem.jpg', email: 'mbelo@teste.com.br', status: 'aberto' },
      { id: 'p9', titulo: 'Console retrô + 2 controles', categoria: 'Games',
        descricao: 'Super Nintendo com 15 jogos originais. Funciona perfeitamente.',
        foto: '../image/videogame.jpg', email: 'mbelo@teste.com.br', status: 'aberto' },
      { id: 'p10', titulo: 'Controle PS4 DualShock', categoria: 'Games',
        descricao: 'Controle original Sony em bom estado, cabo USB incluso.',
        foto: '../image/controle.jpg', email: 'mbelo@teste.com.br', status: 'aberto' }
    ];
    salvarProdutos(produtos);
  }
}

/* ── PROTEÇÃO DE ROTA ──
   Chame em toda página que exige login (exceto explorar e catálogo).
   Redireciona para login.html se não há sessão ativa.            */
function exigirAutenticacao() {
  var sessao = getSessao();
  if (!sessao) {
    window.location.href = 'login.html';
    return null;
  }
  return sessao;
}

/* ── NAVBAR: preenche nome e botão sair ── */
function initNavbar(sessao) {
  var elNome = document.getElementById('navbar-nome');
  if (elNome && sessao) {
    elNome.textContent = sessao.nome.split(' ')[0];
  }
  var btnSair = document.getElementById('btn-sair');
  if (btnSair) {
    btnSair.addEventListener('click', function(e) {
      e.preventDefault();
      encerrarSessao();
      window.location.href = 'login.html';
    });
  }
}

/* ── VALIDAÇÕES ── */

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validarSenha(senha) {
  if (senha.length < 6)     return { valida: false, mensagem: 'Mínimo de 6 caracteres.', forca: 0 };
  if (!/[a-z]/.test(senha)) return { valida: false, mensagem: 'Inclua ao menos uma letra minúscula.', forca: 1 };
  if (!/[A-Z]/.test(senha)) return { valida: false, mensagem: 'Inclua ao menos uma letra maiúscula.', forca: 1 };
  if (!/[0-9]/.test(senha)) return { valida: false, mensagem: 'Inclua ao menos um número.', forca: 2 };
  var forca = 3;
  if (senha.length >= 10)          forca++;
  if (/[^a-zA-Z0-9]/.test(senha)) forca++;
  return { valida: true, mensagem: '', forca: forca };
}

/* Aplica classe visual e mensagem de erro num campo */
function setEstadoCampo(campo, spanErro, valido, mensagem) {
  var preenchido = campo.value.length > 0;
  campo.classList.toggle('campo-erro', !valido && preenchido);
  campo.classList.toggle('campo-ok',   valido  && preenchido);
  if (spanErro) spanErro.textContent = (!valido && preenchido) ? mensagem : '';
}

/* Atualiza barra de força de senha */
function atualizarForcaBarra(forca, barra, texto) {
  var niveis   = ['', 'Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
  var cores    = ['', '#e74c3c',     '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
  var larguras = ['0%','20%','40%','60%','80%','100%'];
  barra.style.width      = larguras[forca] || '0%';
  barra.style.background = cores[forca]    || 'transparent';
  if (texto) texto.textContent = niveis[forca] || '';
}

/* Ativa alternância mostrar/ocultar senha */
function initEyeIcons() {
  document.querySelectorAll('.eye-btn').forEach(function(btn) {
    btn.type = 'button';
    btn.addEventListener('click', function() {
      var input  = btn.previousElementSibling;
      if (!input || input.tagName !== 'INPUT') return;
      var img    = btn.querySelector('.eye-icon');
      var visivel = input.type === 'password';
      input.type = visivel ? 'text' : 'password';
      if (img) {
        img.src = visivel
          ? 'https://img.icons8.com/ios-glyphs/30/000000/visible.png'
          : 'https://img.icons8.com/ios-glyphs/30/000000/invisible.png';
      }
    });
  });
}

/* ── INICIALIZADORES DE PÁGINA ── */

/* Login */
function initLogin() {
  seedDados();
  initEyeIcons();

  var campoEmail = document.getElementById('email');
  var campoSenha = document.getElementById('senha');
  var btnEntrar  = document.getElementById('btn-entrar');
  var spanEmail  = document.getElementById('email-erro');
  var msgGeral   = document.getElementById('msg-geral');
  var msgGeralTxt= document.getElementById('msg-geral-txt');

  function mostrarErro(msg) {
    if (msgGeral && msgGeralTxt) {
      msgGeralTxt.textContent = msg;
      msgGeral.style.display  = 'flex';
    }
  }
  function esconderErro() {
    if (msgGeral) msgGeral.style.display = 'none';
  }

  function checar() {
    var ok = emailValido(campoEmail.value);
    setEstadoCampo(campoEmail, spanEmail, ok || campoEmail.value === '', 'E-mail inválido.');
    if (btnEntrar) btnEntrar.disabled = !ok;
    esconderErro();
  }

  campoEmail.addEventListener('input', checar);
  checar();

  document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!emailValido(campoEmail.value)) return;

    var usuarios = getUsuarios();
    var usuario  = usuarios.find(function(u) {
      return u.email === campoEmail.value.trim() && u.senha === campoSenha.value;
    });

    if (!usuario) {
      mostrarErro('E-mail ou senha incorretos.');
      return;
    }
    if (usuario.ativo === false) {
      mostrarErro('Conta desativada. Ative sua conta clicando no link enviado para seu e-mail.');
      return;
    }

    salvarSessao({ nome: usuario.nome, email: usuario.email });
    window.location.href = 'explorar.html';
  });
}

/* Cadastro */
function initCadastro() {
  seedDados();
  initEyeIcons();

  var campoNome    = document.getElementById('nome');
  var campoEmail   = document.getElementById('email');
  var campoSenha   = document.getElementById('senha');
  var campoConf    = document.getElementById('senha-conf');
  var btnCadastrar = document.getElementById('btn-cadastrar');
  var spanNome     = document.getElementById('nome-erro');
  var spanEmail    = document.getElementById('email-erro');
  var spanSenha    = document.getElementById('senha-erro');
  var spanConf     = document.getElementById('conf-erro');
  var barraForca   = document.getElementById('forca-progresso');
  var textoForca   = document.getElementById('forca-texto');

  function checar() {
    var nomeOk      = campoNome.value.trim().length >= 2;
    var emailOk     = emailValido(campoEmail.value);
    var senhaRes    = validarSenha(campoSenha.value);
    var confOk      = campoConf.value === campoSenha.value && campoConf.value.length > 0;

    setEstadoCampo(campoNome,  spanNome,  nomeOk  || campoNome.value === '',  'Nome deve ter ao menos 2 caracteres.');
    setEstadoCampo(campoEmail, spanEmail, emailOk || campoEmail.value === '', 'E-mail inválido.');
    setEstadoCampo(campoSenha, spanSenha, senhaRes.valida || campoSenha.value === '', senhaRes.mensagem);
    setEstadoCampo(campoConf,  spanConf,  confOk  || campoConf.value === '',  'As senhas não coincidem.');

    if (barraForca) {
      if (campoSenha.value.length > 0) {
        atualizarForcaBarra(senhaRes.forca, barraForca, textoForca);
      } else {
        barraForca.style.width = '0%';
        if (textoForca) textoForca.textContent = '';
      }
    }

    if (btnCadastrar) {
      btnCadastrar.disabled = !(nomeOk && emailOk && senhaRes.valida && confOk);
    }
  }

  [campoNome, campoEmail, campoSenha, campoConf].forEach(function(c) {
    c.addEventListener('input', checar);
  });
  checar();

  document.getElementById('form-cadastro').addEventListener('submit', function(e) {
    e.preventDefault();

    var senhaRes = validarSenha(campoSenha.value);
    if (!senhaRes.valida || campoSenha.value !== campoConf.value) return;

    var usuarios = getUsuarios();
    if (usuarios.some(function(u) { return u.email === campoEmail.value.trim(); })) {
      setEstadoCampo(campoEmail, spanEmail, false, 'Este e-mail já está cadastrado.');
      return;
    }

    /* Conta criada como INATIVA — aguarda confirmação por e-mail */
    var novoUsuario = {
      nome:  campoNome.value.trim(),
      email: campoEmail.value.trim(),
      senha: campoSenha.value,
      ativo: false
    };
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    /* Monta link de ativação com e-mail como parâmetro (simula token) */
    var linkAtivacao = document.getElementById('link-ativacao');
    if (linkAtivacao) {
      linkAtivacao.href = 'ativar-conta.html?email=' + encodeURIComponent(novoUsuario.email);
    }

    document.getElementById('form-cadastro').style.display = 'none';
    var msgOk = document.getElementById('msg-cadastro-ok');
    if (msgOk) msgOk.style.display = 'flex';
  });
}

/* Recuperar senha */
function initRecuperarSenha() {
  var campoEmail   = document.getElementById('email');
  var btnRecuperar = document.getElementById('btn-recuperar');
  var spanEmail    = document.getElementById('email-erro');
  var avisoEnviado = document.getElementById('aviso-enviado');

  function checar() {
    var ok = emailValido(campoEmail.value);
    setEstadoCampo(campoEmail, spanEmail, ok || campoEmail.value === '', 'E-mail inválido.');
    if (btnRecuperar) btnRecuperar.disabled = !ok;
  }
  campoEmail.addEventListener('input', checar);
  checar();

  document.getElementById('form-recuperar').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!emailValido(campoEmail.value)) return;
    localStorage.setItem('eco_recuperar_email', campoEmail.value.trim());
    if (avisoEnviado) { avisoEnviado.style.display = 'flex'; }
    document.getElementById('form-recuperar').style.display = 'none';
  });
}

/* Nova senha */
function initNovaSenha() {
  initEyeIcons();

  var senhaInput = document.getElementById('senha');
  var confInput  = document.getElementById('senha-conf');
  var spanSenha  = document.getElementById('senha-erro');
  var spanConf   = document.getElementById('conf-erro');
  var barraForca = document.getElementById('forca-progresso');
  var textoForca = document.getElementById('forca-texto');

  function checar() {
    var res    = validarSenha(senhaInput.value);
    var confOk = confInput.value === senhaInput.value && confInput.value.length > 0;
    setEstadoCampo(senhaInput, spanSenha, res.valida || senhaInput.value === '', res.mensagem);
    setEstadoCampo(confInput,  spanConf,  confOk     || confInput.value === '',  'As senhas não coincidem.');
    if (barraForca) {
      if (senhaInput.value.length > 0) atualizarForcaBarra(res.forca, barraForca, textoForca);
      else { barraForca.style.width = '0%'; if (textoForca) textoForca.textContent = ''; }
    }
  }
  [senhaInput, confInput].forEach(function(c) { c.addEventListener('input', checar); });
  checar();

  document.getElementById('form-nova-senha').addEventListener('submit', function(e) {
    e.preventDefault();
    var res = validarSenha(senhaInput.value);
    if (!res.valida) { if (spanSenha) spanSenha.textContent = res.mensagem; return; }
    if (senhaInput.value !== confInput.value) { if (spanConf) spanConf.textContent = 'As senhas não coincidem.'; return; }

    var emailRec = localStorage.getItem('eco_recuperar_email');
    if (!emailRec) {
      alert('Sessão de recuperação expirada. Tente novamente.');
      window.location.href = 'recuperar-senha.html';
      return;
    }

    var usuarios   = getUsuarios();
    var encontrado = false;
    usuarios = usuarios.map(function(u) {
      if (u.email === emailRec) {
        encontrado = true;
        return { nome: u.nome, email: u.email, senha: senhaInput.value, ativo: u.ativo !== false };
      }
      return u;
    });

    if (!encontrado) {
      alert('E-mail não encontrado.');
      window.location.href = 'recuperar-senha.html';
      return;
    }

    salvarUsuarios(usuarios);
    localStorage.removeItem('eco_recuperar_email');
    alert('Senha redefinida com sucesso!');
    window.location.href = 'login.html';
  });
}

/* Ativar conta */
function initAtivarConta() {
  seedDados();
  var params = new URLSearchParams(window.location.search);
  var email  = params.get('email');
  var msgEl  = document.getElementById('msg-ativacao');

  if (!email) {
    if (msgEl) {
      msgEl.className = 'alerta alerta-erro';
      msgEl.innerHTML = '<span>&#10005;</span><span>Link de ativação inválido.</span>';
    }
    return;
  }

  var emailDec  = decodeURIComponent(email);
  var usuarios  = getUsuarios();
  var encontrado = false;

  usuarios = usuarios.map(function(u) {
    if (u.email === emailDec) { encontrado = true; return { nome: u.nome, email: u.email, senha: u.senha, ativo: true }; }
    return u;
  });

  salvarUsuarios(usuarios);

  if (msgEl) {
    if (encontrado) {
      msgEl.className = 'alerta alerta-sucesso';
      msgEl.innerHTML = '<span>&#10003;</span><span>A conta relativa ao e-mail <strong>' + emailDec +
        '</strong> foi desbloqueada com sucesso!<br><br>' +
        '<a href="login.html" style="color:inherit;font-weight:700;">Clique aqui para entrar &rarr;</a></span>';
    } else {
      msgEl.className = 'alerta alerta-erro';
      msgEl.innerHTML = '<span>&#10005;</span><span>E-mail não encontrado.</span>';
    }
  }
}

/* Cadastro de produto */
function initCadastroProduto() {
  var sessao = exigirAutenticacao();
  if (!sessao) return;
  seedDados();
  initNavbar(sessao);

  var campoNome   = document.getElementById('nome-produto');
  var campoCat    = document.getElementById('categoria');
  var btnPublicar = document.getElementById('btn-publicar');
  var spanNome    = document.getElementById('nome-produto-erro');

  function checar() {
    var nomeOk = campoNome.value.trim().length >= 2;
    var catOk  = campoCat.value !== '';
    setEstadoCampo(campoNome, spanNome, nomeOk || campoNome.value === '', 'Informe o nome do produto.');
    if (btnPublicar) btnPublicar.disabled = !(nomeOk && catOk);
  }
  [campoNome, campoCat].forEach(function(c) { c.addEventListener('input', checar); });
  checar();

  document.getElementById('form-produto').addEventListener('submit', function(e) {
    e.preventDefault();
    var nomeOk = campoNome.value.trim().length >= 2;
    var catOk  = campoCat.value !== '';
    if (!nomeOk || !catOk) return;

    var produtos = getProdutos();
    var novo = {
      id:        'p' + Date.now(),
      titulo:    campoNome.value.trim(),
      categoria: campoCat.value,
      descricao: document.getElementById('descricao').value.trim(),
      foto:      '../image/livro.jpg',
      email:     sessao.email,
      status:    'aberto'
    };
    produtos.push(novo);
    salvarProdutos(produtos);
    window.location.href = 'meus-produtos.html';
  });
}
