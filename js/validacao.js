/* validacao.js — módulo de validação para formulários de autenticação */

/**
 * Valida formato de e-mail
 * @param {string} email
 * @returns {boolean}
 */
function emailValido(email) {
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return regex.test(email.trim());
}

/**
 * Valida critérios de senha:
 * - mínimo 6 caracteres
 * - ao menos uma letra minúscula
 * - ao menos uma letra maiúscula
 * - ao menos um número
 * @param {string} senha
 * @returns {{ valida: boolean, mensagem: string, forca: number }}
 */
function validarSenha(senha) {
if (senha.length < 6) {
    return { valida: false, mensagem: "Mínimo de 6 caracteres.", forca: 0 };
}
if (!/[a-z]/.test(senha)) {
    return { valida: false, mensagem: "Inclua ao menos uma letra minúscula.", forca: 1 };
}
if (!/[A-Z]/.test(senha)) {
    return { valida: false, mensagem: "Inclua ao menos uma letra maiúscula.", forca: 1 };
}
if (!/[0-9]/.test(senha)) {
    return { valida: false, mensagem: "Inclua ao menos um número.", forca: 2 };
}

let forca = 3;
if (senha.length >= 10) forca++;
if (/[^a-zA-Z0-9]/.test(senha)) forca++;

return { valida: true, mensagem: "", forca };
}

/**
 * Exibe ou limpa mensagem de erro num campo
 * @param {HTMLElement} campo
 * @param {HTMLElement} spanErro
 * @param {boolean} valido
 * @param {string} mensagem
 */
function setEstadoCampo(campo, spanErro, valido, mensagem) {
campo.classList.toggle("campo-erro", !valido);
campo.classList.toggle("campo-ok", valido && campo.value.length > 0);
if (spanErro) spanErro.textContent = valido ? "" : mensagem;
}

/**
 * Atualiza barra visual de força da senha
 * @param {number} forca (0-5)
 * @param {HTMLElement} barra
 * @param {HTMLElement} texto
 */
function atualizarForcaBarra(forca, barra, texto) {
const niveis = ["", "Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];
const cores = ["", "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"];
const larguras = ["0%", "20%", "40%", "60%", "80%", "100%"];

barra.style.width = larguras[forca] || "0%";
barra.style.background = cores[forca] || "transparent";
if (texto) texto.textContent = niveis[forca] || "";
}

/**
 * Inicializa validação do formulário de LOGIN
 */
function initLogin() {
const form = document.getElementById("form-login");
if (!form) return;

const campoEmail = document.getElementById("email");
const btnEntrar = document.getElementById("btn-entrar");
const spanEmail = document.getElementById("email-erro");

function checar() {
    const ok = emailValido(campoEmail.value);
    setEstadoCampo(campoEmail, spanEmail, ok || campoEmail.value === "", "E-mail inválido.");
    btnEntrar.disabled = !ok;
}

campoEmail.addEventListener("input", checar);
checar();

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!emailValido(campoEmail.value)) return;
    window.location.href = "../pages/explorar.html";
});
}

/**
 * Inicializa validação do formulário de CADASTRO
 */
function initCadastro() {
const form = document.getElementById("form-cadastro");
if (!form) return;

const campoEmail = document.getElementById("email");
const campoNome = document.getElementById("nome");
const campoSenha = document.getElementById("senha");
const campoConf = document.getElementById("senha-conf");
const btnCadastrar = document.getElementById("btn-cadastrar");
const spanEmail = document.getElementById("email-erro");
const spanNome = document.getElementById("nome-erro");
const spanSenha = document.getElementById("senha-erro");
const spanConf = document.getElementById("conf-erro");
const barraForca = document.getElementById("forca-progresso");
const textoForca = document.getElementById("forca-texto");

function checar() {
    const emailOk = emailValido(campoEmail.value);
    const nomeOk = campoNome.value.trim().length >= 2;
    const senhaResult = validarSenha(campoSenha.value);
    const confOk = campoConf.value === campoSenha.value && campoConf.value.length > 0;

    setEstadoCampo(campoEmail, spanEmail, emailOk || campoEmail.value === "", "E-mail inválido.");
    setEstadoCampo(campoNome, spanNome, nomeOk || campoNome.value === "", "Nome deve ter ao menos 2 caracteres.");
    setEstadoCampo(campoSenha, spanSenha, senhaResult.valida || campoSenha.value === "", senhaResult.mensagem);
    setEstadoCampo(campoConf, spanConf, confOk || campoConf.value === "", "As senhas não coincidem.");

    if (barraForca && campoSenha.value.length > 0) {
    atualizarForcaBarra(senhaResult.forca, barraForca, textoForca);
    } else if (barraForca) {
    barraForca.style.width = "0%";
    if (textoForca) textoForca.textContent = "";
    }

    btnCadastrar.disabled = !(emailOk && nomeOk && senhaResult.valida && confOk);
}

[campoEmail, campoNome, campoSenha, campoConf].forEach(c => c.addEventListener("input", checar));
checar();

form.addEventListener("submit", function (e) {
    e.preventDefault();
    window.location.href = "../pages/explorar.html";
});
}

/**
 * Inicializa validação do formulário de RECUPERAÇÃO DE SENHA
 */
function initRecuperarSenha() {
const form = document.getElementById("form-recuperar");
if (!form) return;

const campoEmail = document.getElementById("email");
const btnRecuperar = document.getElementById("btn-recuperar");
const spanEmail = document.getElementById("email-erro");
const aviso = document.getElementById("aviso-enviado");

function checar() {
    const ok = emailValido(campoEmail.value);
    setEstadoCampo(campoEmail, spanEmail, ok || campoEmail.value === "", "E-mail inválido.");
    btnRecuperar.disabled = !ok;
}

campoEmail.addEventListener("input", checar);
checar();

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!emailValido(campoEmail.value)) return;
    if (aviso) {
    aviso.style.display = "flex";
    form.style.display = "none";
    }
});
}
