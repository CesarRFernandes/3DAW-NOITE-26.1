// EcoEscambo T2 — catálogo, interesses e propostas
(function () {
  'use strict';

  var PAGE_SIZE = 6;

  function param(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function usuarioNome(email) {
    var u = window.EcoDB.getUsuarioPorEmail(email);
    return u ? u.nome : email;
  }

  function registrarInteresse(produtoId) {
    if (!window.EcoAuth.requireAuth()) return;

    var email = window.EcoAuth.getEmail();
    var produto = window.EcoDB.getProdutoPorId(produtoId);
    if (!produto || produto.estado !== 'aberto') {
      alert('Produto indisponível.');
      return;
    }
    if (produto.ofertanteEmail === email) {
      alert('Você é o ofertante deste produto.');
      return;
    }

    var interesses = window.EcoDB.getInteresses();
    var dup = interesses.some(function (i) {
      return i.produtoDesejadoId === produtoId && i.interessadoEmail === email;
    });
    if (dup) {
      alert('Seu interesse já foi registrado para este produto.');
      return;
    }

    interesses.push({
      id: window.EcoDB.nextId(interesses),
      produtoDesejadoId: produtoId,
      interessadoEmail: email,
      ofertanteEmail: produto.ofertanteEmail,
      criadoEm: Date.now()
    });
    window.EcoDB.salvarInteresses(interesses);
    alert('Seu interesse foi registrado com sucesso. Aguarde o contato do ofertante.');
  }

  function cardProduto(p, comInteresse) {
    var btn = '';
    if (comInteresse) {
      btn =
        '<button type="button" class="btn btn-primario" style="width:auto;padding:8px 12px;font-size:0.85rem;" ' +
        'onclick="EcoT2.registrarInteresse(' + p.id + ')">Tenho interesse</button>';
    }
    return (
      '<div class="card-produto">' +
        '<div class="card-produto-imagem"><img src="' + p.foto + '" alt="' + p.titulo + '" /></div>' +
        '<div class="card-produto-corpo">' +
          '<p class="card-produto-titulo">' + p.titulo + '</p>' +
          '<p class="card-produto-desc">' + p.desc + '</p>' +
          '<div class="card-produto-rodape">' +
            '<span class="badge badge-verde">' + p.categoria + '</span>' +
            '<a href="detalhe-produto.html?id=' + encodeURIComponent(p.slug) + '" class="btn btn-secundario" ' +
              'style="padding:5px 12px;font-size:0.8rem;width:auto;">Ver detalhes</a>' +
          '</div>' +
          (btn ? '<div style="margin-top:12px;text-align:right;">' + btn + '</div>' : '') +
        '</div>' +
      '</div>'
    );
  }

  function initExplorar() {
    window.EcoDB.ensureSeed();
    var pagina = parseInt(param('p') || '1', 10);
    if (isNaN(pagina) || pagina < 1) pagina = 1;

    var lista = window.EcoDB.getProdutosAbertos().sort(function (a, b) { return a.id - b.id; });
    var total = Math.max(1, Math.ceil(lista.length / PAGE_SIZE));
    if (pagina > total) pagina = total;

    var fatia = lista.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
    var email = window.EcoAuth.getEmail();
    var grid = document.getElementById('grid-produtos');
    if (!grid) return;

    grid.innerHTML = fatia.map(function (p) {
      var pode = email && email !== p.ofertanteEmail;
      return cardProduto(p, pode);
    }).join('');

    var pagEl = document.getElementById('paginacao');
    if (pagEl) {
      pagEl.innerHTML = '';
      for (var i = 1; i <= total; i++) {
        var a = document.createElement('a');
        a.href = 'explorar.html?p=' + i;
        a.textContent = String(i);
        if (i === pagina) a.className = 'ativa';
        pagEl.appendChild(a);
      }
    }
  }

  function initDetalhe() {
    window.EcoDB.ensureSeed();
    var slug = param('id');
    var p = window.EcoDB.getProdutoPorSlug(slug);
    var wrap = document.getElementById('detalhe-produto');
    var btn = document.getElementById('btn-interesse');

    if (!p || p.estado !== 'aberto') {
      if (wrap) {
        wrap.innerHTML = '<p style="padding:20px;">Produto não disponível. <a href="explorar.html">Voltar</a></p>';
      }
      return;
    }

    document.title = p.titulo + ' — EcoEscambo';
    document.getElementById('produto-foto').src = p.foto;
    document.getElementById('produto-foto').alt = p.titulo;
    document.getElementById('produto-categoria').textContent = p.categoria;
    document.getElementById('produto-titulo').textContent = p.titulo;
    document.getElementById('produto-desc').textContent = p.desc;
    document.getElementById('ofertante-avatar').textContent = p.iniciais;
    document.getElementById('ofertante-nome').textContent = usuarioNome(p.ofertanteEmail);
    document.getElementById('ofertante-avaliacoes').textContent = '';

    if (btn) {
      btn.onclick = function () {
        registrarInteresse(p.id);
        document.getElementById('area-interesse').style.display = 'none';
        document.getElementById('confirmacao-interesse').style.display = 'flex';
      };
    }
  }

  function initAnaliseOferta() {
    window.EcoDB.ensureSeed();
    if (!window.EcoAuth.requireAuth()) return;

    var email = window.EcoAuth.getEmail();
    var interesseId = param('interesseId');
    var secLista = document.getElementById('secao-interesses');
    var secDet = document.getElementById('secao-detalhe');

    if (!interesseId) {
      if (secDet) secDet.style.display = 'none';
      var recebidos = window.EcoDB.getInteresses().filter(function (i) {
        return i.ofertanteEmail === email;
      });

      if (!recebidos.length) {
        secLista.innerHTML = '<p style="color:var(--cinza-medio);">Nenhum interesse recebido.</p>';
        return;
      }

      var porEmail = {};
      recebidos.forEach(function (i) {
        if (!porEmail[i.interessadoEmail]) porEmail[i.interessadoEmail] = i;
      });

      secLista.innerHTML = Object.keys(porEmail).map(function (em) {
        var inter = porEmail[em];
        var prod = window.EcoDB.getProdutoPorId(inter.produtoDesejadoId);
        return (
          '<div class="card-proposta pendente" style="margin-bottom:16px;">' +
            '<div class="proposta-header">' +
              '<div><p style="font-weight:600;">Interesse de <strong>' + em + '</strong></p>' +
              '<p style="font-size:0.85rem;color:var(--cinza-medio);">No produto: ' +
              (prod ? prod.titulo : '') + '</p></div>' +
              '<a href="analise-oferta.html?interesseId=' + inter.id + '" class="btn btn-primario" ' +
                'style="width:auto;padding:8px 16px;">' + em + '</a>' +
            '</div></div>'
        );
      }).join('');
      return;
    }

    var interesse = window.EcoDB.getInteresses().find(function (i) {
      return String(i.id) === String(interesseId);
    });
    if (!interesse || interesse.ofertanteEmail !== email) {
      window.location.href = 'analise-oferta.html';
      return;
    }

    if (secLista) secLista.style.display = 'none';
    if (secDet) secDet.style.display = 'block';

    var prodDesejado = window.EcoDB.getProdutoPorId(interesse.produtoDesejadoId);
    var produtosInteressado = window.EcoDB.getProdutosAbertos().filter(function (p) {
      return p.ofertanteEmail === interesse.interessadoEmail;
    }).sort(function (a, b) { return a.id - b.id; });

    secDet.innerHTML =
      '<div class="cabecalho-pagina" style="margin-bottom:18px;">' +
        '<h1>Analisar interesse</h1>' +
        '<a href="analise-oferta.html" class="btn btn-secundario" style="width:auto;padding:10px 20px;">Voltar</a>' +
      '</div>' +
      '<div class="alerta alerta-aviso" style="margin-bottom:18px;">' +
        '<span>&#9888;</span><span><strong>' + interesse.interessadoEmail + '</strong> tem interesse em ' +
        '<strong>' + (prodDesejado ? prodDesejado.titulo : '') + '</strong>.</span></div>' +
      '<button type="button" class="btn btn-perigo" style="width:auto;margin-bottom:20px;" ' +
        'onclick="EcoT2.rejeitarTodas(' + interesse.id + ')">rejeitar todas as ofertas</button>' +
      '<h2 style="font-size:1.3rem;margin-bottom:14px;">Produtos de ' + interesse.interessadoEmail + '</h2>' +
      '<div id="lista-produtos-interessado" class="grade-produtos"></div>';

    var lista = document.getElementById('lista-produtos-interessado');
    lista.innerHTML = produtosInteressado.map(function (p, idx) {
      return (
        '<div class="card-produto">' +
          '<div class="card-produto-imagem"><img src="' + p.foto + '" alt="' + p.titulo + '" /></div>' +
          '<div class="card-produto-corpo">' +
            '<p class="card-produto-titulo">' + p.titulo + '</p>' +
            '<p class="card-produto-desc">' + p.desc + '</p>' +
            '<div style="margin-top:12px;text-align:right;">' +
              '<button type="button" class="btn btn-primario" style="width:auto;padding:10px 18px;" ' +
              'onclick="EcoT2.criarProposta(' + interesse.id + ',' + p.id + ')">aceitar troca</button>' +
            '</div></div></div>'
      );
    }).join('');
  }

  function rejeitarTodas(interesseId) {
    var interesses = window.EcoDB.getInteresses();
    var alvo = interesses.find(function (i) { return i.id === interesseId; });
    if (!alvo) return;

    var filtrados = interesses.filter(function (i) {
      return !(i.ofertanteEmail === alvo.ofertanteEmail && i.interessadoEmail === alvo.interessadoEmail);
    });
    window.EcoDB.salvarInteresses(filtrados);

    var propostas = window.EcoDB.getPropostas().filter(function (p) {
      if (p.status !== 'pendente') return true;
      return !(p.ofertanteEmail === alvo.ofertanteEmail && p.interessadoEmail === alvo.interessadoEmail);
    });
    window.EcoDB.salvarPropostas(propostas);
    window.location.href = 'analise-oferta.html';
  }

  function criarProposta(interesseId, produtoOfertadoId) {
    var email = window.EcoAuth.getEmail();
    var interesses = window.EcoDB.getInteresses();
    var interesse = interesses.find(function (i) { return i.id === interesseId; });
    if (!interesse || interesse.ofertanteEmail !== email) return;

    var propostas = window.EcoDB.getPropostas();
    propostas.push({
      id: window.EcoDB.nextId(propostas),
      produtoDesejadoId: interesse.produtoDesejadoId,
      produtoOfertadoId: produtoOfertadoId,
      interessadoEmail: interesse.interessadoEmail,
      ofertanteEmail: email,
      status: 'pendente',
      criadoEm: Date.now()
    });
    window.EcoDB.salvarPropostas(propostas);
    alert('Proposta enviada!');
    window.location.href = 'propostas.html';
  }

  function initAvaliarProposta() {
    window.EcoDB.ensureSeed();
    if (!window.EcoAuth.requireAuth()) return;

    var email = window.EcoAuth.getEmail();
    var pendentes = window.EcoDB.getPropostas().filter(function (p) {
      return p.interessadoEmail === email && p.status === 'pendente';
    });

    var lista = document.getElementById('lista-propostas');
    var detalhe = document.getElementById('detalhe-proposta');
    var conteudo = document.getElementById('detalhe-conteudo');

    if (!pendentes.length) {
      lista.innerHTML = '<p style="color:var(--cinza-medio);">Nenhuma proposta pendente.</p>';
      detalhe.style.display = 'none';
      return;
    }

    lista.innerHTML = pendentes.map(function (p) {
      var pd = window.EcoDB.getProdutoPorId(p.produtoDesejadoId);
      var po = window.EcoDB.getProdutoPorId(p.produtoOfertadoId);
      return (
        '<div class="card-proposta pendente" style="cursor:pointer;margin-bottom:14px;" ' +
          'data-id="' + p.id + '">' +
          '<p style="font-weight:600;">Proposta de <strong>' + p.ofertanteEmail + '</strong></p>' +
          '<p style="font-size:0.85rem;color:var(--cinza-medio);">Desejado: ' + (pd ? pd.titulo : '') +
          ' | Seu item: ' + (po ? po.titulo : '') + '</p></div>'
      );
    }).join('');

    lista.querySelectorAll('[data-id]').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = parseInt(el.getAttribute('data-id'), 10);
        mostrarDetalheProposta(id);
      });
    });
  }

  function mostrarDetalheProposta(id) {
    var p = window.EcoDB.getPropostas().find(function (x) { return x.id === id; });
    if (!p) return;

    var pd = window.EcoDB.getProdutoPorId(p.produtoDesejadoId);
    var po = window.EcoDB.getProdutoPorId(p.produtoOfertadoId);
    var detalhe = document.getElementById('detalhe-proposta');
    var conteudo = document.getElementById('detalhe-conteudo');

    conteudo.innerHTML =
      '<div class="proposta-itens" style="margin:16px 0;">' +
        '<div class="proposta-item-box"><img src="' + (pd ? pd.foto : '') + '" class="proposta-img" ' +
          'style="width:80px;height:80px;object-fit:cover;border-radius:8px;" /><p>' + (pd ? pd.titulo : '') + '</p></div>' +
        '<div class="proposta-seta">&#8644;</div>' +
        '<div class="proposta-item-box"><img src="' + (po ? po.foto : '') + '" class="proposta-img" ' +
          'style="width:80px;height:80px;object-fit:cover;border-radius:8px;" /><p>' + (po ? po.titulo : '') + '</p></div>' +
      '</div>' +
      '<div class="proposta-acoes">' +
        '<button type="button" class="btn btn-primario" style="width:auto;flex:1;" onclick="EcoT2.aceitar(' + id + ')">aceitar</button>' +
        '<button type="button" class="btn btn-perigo" style="width:auto;flex:1;" onclick="EcoT2.recusar(' + id + ')">recusar</button>' +
      '</div>';
    detalhe.style.display = 'block';
  }

  function aceitar(id) {
    var propostas = window.EcoDB.getPropostas();
    var p = propostas.find(function (x) { return x.id === id; });
    if (!p) return;

    var produtos = window.EcoDB.getProdutos();
    produtos.forEach(function (prod) {
      if (prod.id === p.produtoDesejadoId || prod.id === p.produtoOfertadoId) {
        prod.estado = 'finalizada';
      }
    });
    window.EcoDB.salvarProdutos(produtos);

    propostas.forEach(function (pr) {
      if (pr.id === id) pr.status = 'aceita';
      else if (pr.status === 'pendente' &&
        (pr.produtoDesejadoId === p.produtoDesejadoId || pr.produtoOfertadoId === p.produtoOfertadoId)) {
        pr.status = 'recusada';
      }
    });
    window.EcoDB.salvarPropostas(propostas);

    var interesses = window.EcoDB.getInteresses().filter(function (i) {
      return !(i.produtoDesejadoId === p.produtoDesejadoId &&
        i.interessadoEmail === p.interessadoEmail &&
        i.ofertanteEmail === p.ofertanteEmail);
    });
    window.EcoDB.salvarInteresses(interesses);

    alert('Troca aceita! Os produtos foram retirados da visualização.');
    window.location.href = 'explorar.html';
  }

  function recusar(id) {
    var propostas = window.EcoDB.getPropostas();
    var p = propostas.find(function (x) { return x.id === id; });
    if (p) {
      p.status = 'recusada';
      window.EcoDB.salvarPropostas(propostas);
    }
    window.location.href = 'avaliar-proposta.html';
  }

  window.EcoT2 = {
    initExplorar: initExplorar,
    initDetalhe: initDetalhe,
    initAnaliseOferta: initAnaliseOferta,
    initAvaliarProposta: initAvaliarProposta,
    registrarInteresse: registrarInteresse,
    rejeitarTodas: rejeitarTodas,
    criarProposta: criarProposta,
    aceitar: aceitar,
    recusar: recusar
  };
})();
