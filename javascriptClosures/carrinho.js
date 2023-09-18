(function () {


    function carrinho() {
        const sacola = JSON.parse(localStorage.getItem('sacola')) || [];

        function salvarCarrinho() {
            localStorage.setItem('sacola', JSON.stringify(sacola));
        }

        function addProduto(produto) {
            const index = encontrarItemIndex(produto.name)
            if (index !== -1) {
                sacola[index].amount += produto.amount
            } else {
                sacola.push({
                    id: sacola.length + 1,
                    name: produto.name,
                    description: produto.description,
                    amount: produto.amount,
                    price: produto.price
                })
            }
            salvarCarrinho();
            atualizarCarrinho();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Produto adicionado na sacola!',
                showConfirmButton: false,
                timer: 3000
            })

        }

        function calcularTotal() {
            let total = 0;
            for (const produto of sacola) {
                total += produto.price * produto.amount
            }
            return total
        }

        function getSacola() {
            return sacola;
        }
        function encontrarItemIndex(nomeItem) {
            return sacola.findIndex(produto => produto.name == nomeItem)
        }

        return {
            addProduto: addProduto,
            getSacola: getSacola,
            calcularTotal: calcularTotal
        }
    }

    const minhaSacola = carrinho();

    const addBtns = document.querySelectorAll(".add-btn");

    addBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const nomeItem = btn.getAttribute("data-name");
            const precoItem = parseFloat(btn.getAttribute("data-preco"))
            minhaSacola.addProduto({
                name: nomeItem,
                price: precoItem,
                amount: 1
            })
        })
    })

    function atualizarCarrinho() {
        const carrinhoItensDiv = document.getElementById("carrinho-itens");
        const totalCarrinhoDiv = document.getElementById("total-carrinho");

        carrinhoItensDiv.innerHTML = ""
        totalCarrinhoDiv.textContent = ""

        let total = 0;
        minhaSacola.getSacola().forEach(item => {
            total += item.price * item.amount;
            carrinhoItensDiv.innerHTML +=
                `<div class="dropdown-item">${item.name} Qtd: ${item.amount} - R$ ${item.price.toFixed(2)}</div>`;
        })

        totalCarrinhoDiv.textContent = `Total: R$ ${total.toFixed(2)}`

    }

})();

function exibirItensDoLocalStorage() {
    const carrinho = JSON.parse(localStorage.getItem("sacola")) || [];

    const tabela = document.getElementById("tabela-itens");
    const totalGeralDiv = document.getElementById("total-geral");

    tabela.getElementsByTagName('tbody')[0].innerHTML = '';
    totalGeralDiv.innerHTML = '';

    let totalGeral = 0;

    const cabecalho = tabela.createTHead();
    const cabecalhoRow = cabecalho.insertRow();
    const cabecalhoCol1 = cabecalhoRow.insertCell(0);
    const cabecalhoCol2 = cabecalhoRow.insertCell(1);
    const cabecalhoCol3 = cabecalhoRow.insertCell(2);
    const cabecalhoCol4 = cabecalhoRow.insertCell(3);

    cabecalhoCol1.textContent = "Item";
    cabecalhoCol2.textContent = "Preço";
    cabecalhoCol3.textContent = "Quantidade";
    cabecalhoCol4.textContent = "Total";

    carrinho.forEach((item, index) => {
        const row = tabela.getElementsByTagName('tbody')[0].insertRow();
        const cell1 = row.insertCell(0)
        const cell2 = row.insertCell(1)
        const cell3 = row.insertCell(2)
        const cell4 = row.insertCell(3)
        const cell5 = row.insertCell(4)

        cell1.textContent = item.name;
        cell2.textContent = item.price.toFixed(2);
        cell3.textContent = item.amount;
        const totalItem = item.price * item.amount;
        cell4.textContent = totalItem.toFixed(2);
        totalGeral += totalItem;

        const botaoExcluir = document.createElement("button");
        botaoExcluir.classList.add("icon-button");
        botaoExcluir.innerHTML = '<i class="fas fa-trash"></i>'; 
        botaoExcluir.addEventListener("click", function () {
            excluirItem(index); 
        });
        cell5.appendChild(botaoExcluir);
    });

    totalGeralDiv.textContent = `Total Geral: R$ ${totalGeral.toFixed(2)}`;
}
exibirItensDoLocalStorage();

const inputCEP = document.getElementById("cep");
const inputEndereco = document.getElementById("endereco");

inputCEP.addEventListener("blur", function () {
    const cep = inputCEP.value.replace(/\D/g, '');
    if (cep.length === 8) {
        buscarEnderecoPorCEP(cep);
    }
});

function limparCarrinho() {
    const sacola = JSON.parse(localStorage.getItem("sacola"));

    if (sacola && sacola.length > 0) {
        localStorage.removeItem("sacola");

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Carrinho limpo com sucesso!',
            showConfirmButton: false,
            timer: 3000
        });

        setTimeout(function () {
            location.reload();
        }, 1000);
    } else {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'O Carrinho já está vazio!',
            showConfirmButton: false,
            timer: 3000
        });
    }
}

function excluirItem(indice) {
    const sacola = JSON.parse(localStorage.getItem("sacola"));
    if (sacola && sacola.length > indice) {
        sacola.splice(indice, 1);
        localStorage.setItem("sacola", JSON.stringify(sacola));
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Item removido do carrinho!',
            showConfirmButton: false,
            timer: 3000
        });

        setTimeout(function () {
            location.reload();
        }, 1000);
    }
}

function buscarEnderecoPorCEP(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                inputEndereco.value = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
            } else {
                alert("CEP não encontrado");
            }
        })
        .catch(error => {
            console.error("Erro ao buscar o CEP:", error);
        });
}

/*
function excluirItem(indice) {
    const sacola = JSON.parse(localStorage.getItem("sacola"));
    if (sacola && sacola.length > indice) {
        if (sacola[indice].amount > 1) {
            // Reduz a quantidade em 1
            sacola[indice].amount--;
        } else {
            // Se a quantidade for 1, remove o item do carrinho
            sacola.splice(indice, 1);
        }
        
        localStorage.setItem("sacola", JSON.stringify(sacola));
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Item removido do carrinho!',
            showConfirmButton: false,
            timer: 3000
        });

        setTimeout(function () {
            location.reload();
        }, 1000);
    }
}
*/