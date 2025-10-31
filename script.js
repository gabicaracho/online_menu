// Carrinho (array de objetos)
var carrinho = [];

// Carregar carrinho do localStorage quando a página carrega
window.onload = function() {
    var carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizar();
    }
};

// Adicionar item ao carrinho
function add(nome, preco) {
    // Verificar se item já existe
    var existe = false;
    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].nome == nome) {
            carrinho[i].qtd++;
            existe = true;
            break;
        }
    }

    // Se não existe, adicionar novo
    if (!existe) {
        carrinho.push({
            nome: nome,
            preco: preco,
            qtd: 1
        });
    }

    // Salvar no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // Atualizar interface
    atualizar();

    // Mostrar alerta
    alert('✅ ' + nome + ' adicionado ao carrinho!');
}

// Atualizar interface do carrinho
function atualizar() {
    var itensDiv = document.getElementById('itens');
    var totalBox = document.getElementById('total-box');
    var contador = document.getElementById('contador');

    // Calcular total de itens
    var totalItens = 0;
    for (var i = 0; i < carrinho.length; i++) {
        totalItens = totalItens + carrinho[i].qtd;
    }

    // Atualizar contador
    contador.innerHTML = totalItens;

    // Se carrinho vazio
    if (carrinho.length == 0) {
        itensDiv.innerHTML = '<div class="carrinho-vazio"><p>Seu carrinho está vazio</p></div>';
        totalBox.style.display = 'none';
        return;
    }

    // Mostrar total
    totalBox.style.display = 'block';

    // Gerar HTML dos itens
    var html = '';
    var totalValor = 0;

    for (var i = 0; i < carrinho.length; i++) {
        var item = carrinho[i];
        var subtotal = item.preco * item.qtd;
        totalValor = totalValor + subtotal;

        html = html + '<div class="carrinho-item">';
        html = html + '<h4>' + item.nome + '</h4>';
        html = html + '<p>R$ ' + item.preco.toFixed(2) + ' x ' + item.qtd + ' = R$ ' + subtotal.toFixed(2) + '</p>';
        html = html + '<div class="item-controles">';
        html = html + '<div class="quantidade">';
        html = html + '<button class="btn-qtd" onclick="mudar(' + i + ', -1)">-</button>';
        html = html + '<span>' + item.qtd + '</span>';
        html = html + '<button class="btn-qtd" onclick="mudar(' + i + ', 1)">+</button>';
        html = html + '</div>';
        html = html + '<button class="btn-remover" onclick="remover(' + i + ')">Remover</button>';
        html = html + '</div>';
        html = html + '</div>';
    }

    itensDiv.innerHTML = html;

    // Atualizar total
    document.getElementById('total').innerHTML = totalValor.toFixed(2);
}

// Mudar quantidade
function mudar(index, delta) {
    carrinho[index].qtd = carrinho[index].qtd + delta;

    // Se quantidade chegar a zero, remover
    if (carrinho[index].qtd <= 0) {
        carrinho.splice(index, 1);
    }

    // Salvar no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // Atualizar interface
    atualizar();
}

// Remover item
function remover(index) {
    carrinho.splice(index, 1);

    // Salvar no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // Atualizar interface
    atualizar();
}

// Abrir carrinho
function abrir() {
    document.getElementById('carrinho').classList.add('aberto');
}

// Fechar carrinho
function fechar() {
    document.getElementById('carrinho').classList.remove('aberto');
}

// Finalizar pedido
function finalizar() {
    if (carrinho.length == 0) {
        alert('❌ Seu carrinho está vazio!');
        return;
    }

    // Gerar número do pedido (1000-9999)
    var numeroPedido = Math.floor(Math.random() * 9000) + 1000;

    // Gerar data e hora
    var agora = new Date();
    var dia = agora.getDate();
    var mes = agora.getMonth() + 1;
    var ano = agora.getFullYear();
    var hora = agora.getHours();
    var min = agora.getMinutes();

    if (dia < 10) dia = '0' + dia;
    if (mes < 10) mes = '0' + mes;
    if (hora < 10) hora = '0' + hora;
    if (min < 10) min = '0' + min;

    var dataFormatada = dia + '/' + mes + '/' + ano + ' às ' + hora + ':' + min;

    // Preencher ticket
    document.getElementById('numero-pedido').innerHTML = numeroPedido;
    document.getElementById('data-pedido').innerHTML = dataFormatada;

    // Gerar HTML dos itens do ticket
    var html = '';
    var totalValor = 0;

    for (var i = 0; i < carrinho.length; i++) {
        var item = carrinho[i];
        var subtotal = item.preco * item.qtd;
        totalValor = totalValor + subtotal;

        html = html + '<div class="ticket-item">';
        html = html + '<div class="ticket-item-nome">' + item.nome + '</div>';
        html = html + '<div class="ticket-item-qtd">x' + item.qtd + '</div>';
        html = html + '<div class="ticket-item-valor">R$ ' + subtotal.toFixed(2) + '</div>';
        html = html + '</div>';
    }

    document.getElementById('ticket-itens').innerHTML = html;
    document.getElementById('ticket-total').innerHTML = totalValor.toFixed(2);

    // Mostrar ticket
    document.getElementById('ticket-backdrop').classList.add('ativo');

    // Limpar carrinho
    carrinho = [];
    localStorage.removeItem('carrinho');
    atualizar();
    fechar();
}

// Fechar ticket
function fecharTicket() {
    document.getElementById('ticket-backdrop').classList.remove('ativo');
}
