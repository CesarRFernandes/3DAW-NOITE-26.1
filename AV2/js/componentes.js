/* EcoEscambo — componentes.js

Gera HTML da navbar conforme sessão atual */
function renderNavbar(paginaAtiva) {
  var sessao = getSessao();

  var linksAutenticado = sessao ? [
    { href: 'meus-produtos.html',  label: 'Meus produtos'    },
    { href: 'propostas.html',      label: 'Propostas'        },
    { href: 'ver-interesses.html', label: 'Ver interesses'   },
    { href: 'analise-oferta.html', label: 'Análise de oferta'}
  ] : [];

  var linksBase = [
    { href: 'explorar.html', label: 'Explorar' }
  ].concat(linksAutenticado);

  var itensNav = linksBase.map(function(link) {
    var ativo = link.href === paginaAtiva ? ' class="ativo"' : '';
    return '<li><a href="' + link.href + '"' + ativo + '>' + link.label + '</a></li>';
  }).join('');

  var areaUsuario = sessao
    ? '<div class="navbar-usuario">' +
        '<img src="../image/icone.png" alt="Usuário" class="icone-usuario" />' +
        '<span id="navbar-nome">' + sessao.nome.split(' ')[0] + '</span>' +
        '<a href="#" id="btn-sair" class="navbar-sair">Sair</a>' +
      '</div>'
    : '<div><a href="login.html" class="btn-navbar-entrar">Entrar</a></div>';

  var html =
    '<nav class="navbar">' +
      '<a href="explorar.html" class="navbar-logo">' +
        '<img src="../image/ecoescambo.png" alt="EcoEscambo" />' +
      '</a>' +
      '<ul class="navbar-nav">' + itensNav + '</ul>' +
      areaUsuario +
    '</nav>';

  var placeholder = document.getElementById('navbar-placeholder');
  if (placeholder) {
    placeholder.outerHTML = html;
  } else {
    document.body.insertAdjacentHTML('afterbegin', html);
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

function renderRodape() {
  var html =
    '<footer class="rodape">' +
      '<p>&copy; ' + new Date().getFullYear() + ' EcoEscambo — Trocas ecológicas com propósito</p>' +
    '</footer>';

  var placeholder = document.getElementById('rodape-placeholder');
  if (placeholder) {
    placeholder.outerHTML = html;
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}
