// EcoEscambo T2 — autenticação
(function () {
  'use strict';

  function getSessao() {
    try {
      return JSON.parse(localStorage.getItem('eco_sessao') || 'null');
    } catch (e) {
      return null;
    }
  }

  function setSessao(sessao) {
    localStorage.setItem('eco_sessao', JSON.stringify(sessao));
  }

  function sair() {
    localStorage.removeItem('eco_sessao');
    window.location.href = 'login.html';
  }

  function requireAuth() {
    var s = getSessao();
    if (!s || !s.email) {
      var next = encodeURIComponent(window.location.href);
      window.location.href = 'login.html?next=' + next;
      return false;
    }
    return true;
  }

  function getEmail() {
    var s = getSessao();
    return s ? s.email : null;
  }

  function initNavbar() {
    var s = getSessao();
    var el = document.getElementById('navbar-nome');
    if (el && s) el.textContent = s.nome || s.email;
    var sairBtn = document.getElementById('btn-sair');
    if (sairBtn) {
      sairBtn.addEventListener('click', function (e) {
        e.preventDefault();
        sair();
      });
    }
  }

  window.EcoAuth = {
    getSessao: getSessao,
    setSessao: setSessao,
    sair: sair,
    requireAuth: requireAuth,
    getEmail: getEmail,
    initNavbar: initNavbar
  };
})();
