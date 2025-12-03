function mostrarHora() {
const data = new Date();
// Formata a hora para HH:MM:SS
const hora = data.toLocaleTimeString('pt-BR', { hour12: false });

// Altera o conteúdo do elemento com o ID 'relogio'
const elementoRelogio = document.getElementById('relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

// Atualiza a cada segundo
setInterval(mostrarHora, 1000);

// Mostra imediatamente ao carregar
mostrarHora();

function mostrarHoraEUA() {
const data = new Date();
// 'America/Los_Angeles' é o fuso horário
const hora = data.toLocaleTimeString('pt-BR', {
hour12: false,
timeZone: 'America/Los_Angeles'
});

const elementoRelogio = document.getElementById('eua-relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

// Inicializa e atualiza o relógio a cada segundo
mostrarHoraEUA();
setInterval(mostrarHoraEUA, 1000);

function mostrarHoraJapao() {
const data = new Date();
// 'Asia/Tokyo' é o fuso horário
const hora = data.toLocaleTimeString('pt-BR', {
hour12: false,
timeZone: 'Asia/Tokyo'
});

const elementoRelogio = document.getElementById('japao-relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

mostrarHoraJapao();
setInterval(mostrarHoraJapao, 1000);

function mostrarHoraSaoPaulo() {
const data = new Date();
const hora = data.toLocaleTimeString('pt-BR', {
hour12: false,
timeZone: 'America/Sao_Paulo'
});

const elementoRelogio = document.getElementById('sp-relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

mostrarHoraSaoPaulo();
setInterval(mostrarHoraSaoPaulo, 1000);

function mostrarHoraNoronha() {
const data = new Date();
const hora = data.toLocaleTimeString('pt-BR', {
hour12: false,
timeZone: 'America/Noronha'
});

const elementoRelogio = document.getElementById('noronha-relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

mostrarHoraNoronha();
setInterval(mostrarHoraNoronha, 1000);

function mostrarHoraManaus() {
const data = new Date();
const hora = data.toLocaleTimeString('pt-BR', {
hour12: false,
timeZone: 'America/Manaus'
});

const elementoRelogio = document.getElementById('manaus-relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

mostrarHoraManaus();
setInterval(mostrarHoraManaus, 1000);

function mostrarHoraAcre() {
const data = new Date();
const hora = data.toLocaleTimeString('pt-BR', {
hour12: false,
timeZone: 'America/Rio_Branco'
});

const elementoRelogio = document.getElementById('acre-relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

mostrarHoraAcre();
setInterval(mostrarHoraAcre, 1000);

function mostrarHoraET() {
const data = new Date();
const hora = data.toLocaleTimeString('pt-BR', {
hour12: false,
timeZone: 'America/New_York'
});

const elementoRelogio = document.getElementById('et-relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

mostrarHoraET();
setInterval(mostrarHoraET, 1000);

function mostrarHoraCT() {
const data = new Date();
const hora = data.toLocaleTimeString('pt-BR', {
hour12: false,
timeZone: 'America/Chicago'
});

const elementoRelogio = document.getElementById('ct-relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

mostrarHoraCT();
setInterval(mostrarHoraCT, 1000);

function mostrarHoraMT() {
const data = new Date();
const hora = data.toLocaleTimeString('pt-BR', {
hour12: false,
timeZone: 'America/Denver'
});

const elementoRelogio = document.getElementById('mt-relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

mostrarHoraMT();
setInterval(mostrarHoraMT, 1000);

function mostrarHoraPT() {
const data = new Date();
const hora = data.toLocaleTimeString('pt-BR', {
hour12: false,
timeZone: 'America/Los_Angeles'
});

const elementoRelogio = document.getElementById('pt-relogio');
if (elementoRelogio) {
elementoRelogio.textContent = hora;
}
}

mostrarHoraPT();
setInterval(mostrarHoraPT, 1000);