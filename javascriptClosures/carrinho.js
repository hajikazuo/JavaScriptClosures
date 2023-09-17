(function () {


    function carrinho() {
        const sacola = [];
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

function salvarCarrinhoNoLocalStorage(dadosCarrinho) {
    localStorage.setItem("carrinho", JSON.stringify(dadosCarrinho));
}

function salvarItemNoLocalStorage(nome, preco) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    let item = {
        nome: nome,
        preco: preco
    };

    carrinho.push(item);

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

const addButtons = document.querySelectorAll(".add-btn");
addButtons.forEach(button => {
    button.addEventListener("click", function () {
        const nome = this.getAttribute("data-name");
        const preco = parseFloat(this.getAttribute("data-preco"));
        salvarItemNoLocalStorage(nome, preco);
    });
});

function redirecionarParaEntrega() {
    window.location.href = "dadosEntrega.html";
}

function exibirItensDoLocalStorage() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const tabela = document.getElementById("tabela-itens");

    tabela.innerHTML = "";

    carrinho.forEach(item => {
        const row = tabela.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);

        cell1.innerHTML = item.nome;
        cell2.innerHTML = item.preco;
    });
}

exibirItensDoLocalStorage();