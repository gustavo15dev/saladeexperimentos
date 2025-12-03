/**
 * Abre o menu lateral, definindo sua largura e deslocando o conteúdo principal.
 */
function abrirMenu() {
    // Define a largura visível do menu lateral
    document.getElementById("menu-lateral").style.width = "250px"; 
    
    // Desloca o conteúdo principal para a direita
    document.getElementById("conteudo-principal").style.marginLeft = "250px"; 
}

/**
 * Fecha o menu lateral, retornando sua largura para zero e recolocando o conteúdo principal.
 */
function fecharMenu() {
    // Fecha o menu lateral (largura zero)
    document.getElementById("menu-lateral").style.width = "0"; 
    
    // Retorna o conteúdo principal para o lado esquerdo
    document.getElementById("conteudo-principal").style.marginLeft = "0";
}