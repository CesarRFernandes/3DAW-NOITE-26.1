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

// Validação email e senha
function emailValido(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

function validarSenha(senha) {
  if (senha.length < 6)      return { valida: false, mensagem: 'Mínimo de 6 caracteres.', forca: 0 };
  if (!/[a-z]/.test(senha))  return { valida: false, mensagem: 'Inclua ao menos uma letra minúscula.', forca: 1 };
  if (!/[A-Z]/.test(senha))  return { valida: false, mensagem: 'Inclua ao menos uma letra maiúscula.', forca: 1 };
  if (!/[0-9]/.test(senha))  return { valida: false, mensagem: 'Inclua ao menos um número.', forca: 2 };
  var forca = 3;
  if (senha.length >= 10)           forca++;
  if (/[^a-zA-Z0-9]/.test(senha))  forca++;
  return { valida: true, mensagem: '', forca };
}

function setEstadoCampo(campo, spanErro, valido, mensagem) {
  campo.classList.toggle('campo-erro', !valido);
  campo.classList.toggle('campo-ok', valido && campo.value.length > 0);
  if (spanErro) spanErro.textContent = valido ? '' : mensagem;
}

function atualizarForcaBarra(forca, barra, texto) {
  var niveis   = ['', 'Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
  var cores    = ['', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
  var larguras = ['0%', '20%', '40%', '60%', '80%', '100%'];
  barra.style.width      = larguras[forca] || '0%';
  barra.style.background = cores[forca]    || 'transparent';
  if (texto) texto.textContent = niveis[forca] || '';
}

function initEyeIcons() {
  document.querySelectorAll('.eye-btn').forEach(function(btn) {
    btn.type = 'button';
    btn.addEventListener('click', function() {
      var input = btn.previousElementSibling;
      if (!input || input.tagName !== 'INPUT') return;
      var img = btn.querySelector('.eye-icon');
      var mostrar = input.type === 'password';
      input.type = mostrar ? 'text' : 'password';
      if (img) img.src = mostrar
        ? 'https://img.icons8.com/ios-glyphs/30/000000/visible.png'
        : 'https://img.icons8.com/ios-glyphs/30/000000/invisible.png';
    });
  });
}


// LOGIN
function initLogin() {
  var form       = document.getElementById('form-login');
  if (!form) return;
  initEyeIcons();

  var campoEmail = document.getElementById('email');
  var campoSenha = document.getElementById('senha');
  var btnEntrar  = document.getElementById('btn-entrar');
  var spanEmail  = document.getElementById('email-erro');

  function checar() {
    var ok = emailValido(campoEmail.value);
    setEstadoCampo(campoEmail, spanEmail, ok || campoEmail.value === '', 'E-mail inválido.');
    if (btnEntrar) btnEntrar.disabled = !ok;
  }
  campoEmail.addEventListener('input', checar);
  checar();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!emailValido(campoEmail.value)) return;

    var usuarios = getUsuarios();
    var usuario = usuarios.find(function(u) {
      return u.email === campoEmail.value.trim() && u.senha === campoSenha.value;
    });

    if (!usuario) {
      alert('E-mail ou senha incorretos.');
      return;
    }

    salvarSessao({ nome: usuario.nome, email: usuario.email });
    window.location.href = 'explorar.html';
  });
}

// CADASTRO
function initCadastro() {
  var form = document.getElementById('form-cadastro');
  if (!form) return;
  initEyeIcons();

  var campoEmail   = document.getElementById('email');
  var campoNome    = document.getElementById('nome');
  var campoSenha   = document.getElementById('senha');
  var campoConf    = document.getElementById('senha-conf');
  var btnCadastrar = document.getElementById('btn-cadastrar');
  var spanEmail    = document.getElementById('email-erro');
  var spanNome     = document.getElementById('nome-erro');
  var spanSenha    = document.getElementById('senha-erro');
  var spanConf     = document.getElementById('conf-erro');
  var barraForca   = document.getElementById('forca-progresso');
  var textoForca   = document.getElementById('forca-texto');

  function checar() {
    var emailOk     = emailValido(campoEmail.value);
    var nomeOk      = campoNome.value.trim().length >= 2;
    var senhaResult = validarSenha(campoSenha.value);
    var confOk      = campoConf.value === campoSenha.value && campoConf.value.length > 0;

    setEstadoCampo(campoEmail, spanEmail, emailOk  || campoEmail.value === '', 'E-mail inválido.');
    setEstadoCampo(campoNome,  spanNome,  nomeOk   || campoNome.value === '',  'Nome deve ter ao menos 2 caracteres.');
    setEstadoCampo(campoSenha, spanSenha, senhaResult.valida || campoSenha.value === '', senhaResult.mensagem);
    setEstadoCampo(campoConf,  spanConf,  confOk   || campoConf.value === '',  'As senhas não coincidem.');

    if (barraForca && campoSenha.value.length > 0) {
      atualizarForcaBarra(senhaResult.forca, barraForca, textoForca);
    } else if (barraForca) {
      barraForca.style.width = '0%';
      if (textoForca) textoForca.textContent = '';
    }
    if (btnCadastrar) btnCadastrar.disabled = !(emailOk && nomeOk && senhaResult.valida && confOk);
  }

  [campoEmail, campoNome, campoSenha, campoConf].forEach(function(c) {
    c.addEventListener('input', checar);
  });
  checar();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var senhaResult = validarSenha(campoSenha.value);
    if (!senhaResult.valida || campoSenha.value !== campoConf.value) return;

    var usuarios = getUsuarios();
    var jaExiste = usuarios.some(function(u) {
      return u.email === campoEmail.value.trim();
    });

    if (jaExiste) {
      if (spanEmail) spanEmail.textContent = 'Este e-mail já está cadastrado.';
      setEstadoCampo(campoEmail, spanEmail, false, 'Este e-mail já está cadastrado.');
      return;
    }

    usuarios.push({
      nome:  campoNome.value.trim(),
      email: campoEmail.value.trim(),
      senha: campoSenha.value
    });
    salvarUsuarios(usuarios);

    // Já inicia sessão automaticamente
    salvarSessao({ nome: campoNome.value.trim(), email: campoEmail.value.trim() });

    alert('Conta criada com sucesso! Bem-vindo(a), ' + campoNome.value.trim() + '!');
    window.location.href = 'explorar.html';
  });
}

// RECUPERAR SENHA
function initRecuperarSenha() {
  var form = document.getElementById('form-recuperar');
  if (!form) return;

  var campoEmail   = document.getElementById('email');
  var btnRecuperar = document.getElementById('btn-recuperar');
  var spanEmail    = document.getElementById('email-erro');
  var aviso        = document.getElementById('aviso-enviado');

  function checar() {
    var ok = emailValido(campoEmail.value);
    setEstadoCampo(campoEmail, spanEmail, ok || campoEmail.value === '', 'E-mail inválido.');
    if (btnRecuperar) btnRecuperar.disabled = !ok;
  }
  campoEmail.addEventListener('input', checar);
  checar();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!emailValido(campoEmail.value)) return;

    // Verifica se o e-mail existe e guarda para a tela de nova senha
    var usuarios = getUsuarios();
    var existe = usuarios.some(function(u) { return u.email === campoEmail.value.trim(); });

    // Por segurança, não informamos se o e-mail existe ou não
    localStorage.setItem('eco_recuperar_email', campoEmail.value.trim());

    if (aviso) {
      aviso.style.display = 'flex';
      form.style.display = 'none';
    } else {
      alert('Se este e-mail estiver cadastrado, você poderá redefinir sua senha.');
      window.location.href = 'nova-senha.html';
    }
  });
}

// NOVA SENHA
function initNovaSenha() {
  var form = document.getElementById('form-nova-senha');
  if (!form) return;
  initEyeIcons();

  var senhaInput = document.getElementById('senha');
  var confInput  = document.getElementById('senha-conf');
  var spanSenha  = document.getElementById('senha-erro');
  var spanConf   = document.getElementById('conf-erro');
  var barraForca = document.getElementById('forca-progresso');
  var textoForca = document.getElementById('forca-texto');

  function checar() {
    var senhaResult = validarSenha(senhaInput.value);
    var confOk = confInput.value === senhaInput.value && confInput.value.length > 0;
    setEstadoCampo(senhaInput, spanSenha, senhaResult.valida || senhaInput.value === '', senhaResult.mensagem);
    setEstadoCampo(confInput,  spanConf,  confOk || confInput.value === '', 'As senhas não coincidem.');
    if (barraForca && senhaInput.value.length > 0) {
      atualizarForcaBarra(senhaResult.forca, barraForca, textoForca);
    } else if (barraForca) {
      barraForca.style.width = '0%';
      if (textoForca) textoForca.textContent = '';
    }
  }

  [senhaInput, confInput].forEach(function(c) { c.addEventListener('input', checar); });
  checar();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var senhaResult = validarSenha(senhaInput.value);
    if (!senhaResult.valida) { if (spanSenha) spanSenha.textContent = senhaResult.mensagem; return; }
    if (senhaInput.value !== confInput.value) { if (spanConf) spanConf.textContent = 'As senhas não coincidem.'; return; }

    var emailRecuperar = localStorage.getItem('eco_recuperar_email');
    if (!emailRecuperar) {
      alert('Sessão de recuperação expirada. Tente novamente.');
      window.location.href = 'recuperar-senha.html';
      return;
    }

    var usuarios = getUsuarios();
    var encontrado = false;
    usuarios = usuarios.map(function(u) {
      if (u.email === emailRecuperar) {
        encontrado = true;
        return { nome: u.nome, email: u.email, senha: senhaInput.value };
      }
      return u;
    });

    if (!encontrado) {
      alert('E-mail não encontrado. Tente recuperar novamente.');
      window.location.href = 'recuperar-senha.html';
      return;
    }

    salvarUsuarios(usuarios);
    localStorage.removeItem('eco_recuperar_email');
    alert('Senha redefinida com sucesso! Faça login com a nova senha.');
    window.location.href = 'login.html';
  });
}
