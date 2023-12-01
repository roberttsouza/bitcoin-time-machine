document.getElementById("calculateButton").addEventListener("click", function () {
    startLoadingAnimation();
    calculateBitcoinValue();
});

function startLoadingAnimation() {
    const resultCard = document.querySelector(".result-card");
    resultCard.classList.add("loading");
}

function stopLoadingAnimation() {
    const resultCard = document.querySelector(".result-card");
    resultCard.classList.remove("loading");
}

function calculateBitcoinValue() {
    const currency = document.getElementById("currency").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    if (isNaN(amount) || amount <= 0) {
        alert("Por favor, insira uma quantidade válida na moeda selecionada.");
        stopLoadingAnimation(); // Adicione esta linha para parar a animação em caso de erro
        return;
    }

    const currencySymbol = (currency === "USD") ? "$" : "R$";

    $.ajax({
        url: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=${currency}&ts=${Date.parse(date) / 1000}`,
        success: function (data) {
            if (data.BTC && data.BTC[currency]) {
                const bitcoinPriceAtPurchase = data.BTC[currency];
                const amountInBTC = amount / bitcoinPriceAtPurchase;

                // Obtenha o preço atual do Bitcoin
                $.ajax({
                    url: `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=${currency}`,
                    success: function (currentData) {
                        if (currentData[currency]) {
                            const currentBitcoinPrice = currentData[currency];
                            const totalValueNow = amountInBTC * currentBitcoinPrice;
                            const profitInCurrency = totalValueNow - amount;
                            const profitPercentage = (profitInCurrency / amount) * 100;

                            const textResultHTML = `<h2>Você agora teria <span class="textdecorResult">${amountInBTC.toFixed(3)} BTC</span>, que valem <span class="textdecorResult">${currency} ${totalValueNow.toFixed(2)}</span> hoje.</h2>
                            <h2>Seria um lucro de <span class="textdecorResult2">${profitPercentage.toFixed(2)}%</span></h2>`
                            document.querySelector(".resultText").innerHTML = textResultHTML;
                            // Cards informativos
                            const resultHTML = `
                            <div class="card-item"><p>Preço de Compra (na data informada) </p><span id="purchasePrice">${currencySymbol}${bitcoinPriceAtPurchase.toFixed(2)}</span></div>
                            <div class="card-item"><p>Quantidade (BTC que poderia ter comprado na data informada) </p><span id="purchaseAmount">${amountInBTC.toFixed(6)} BTC</span></div>
                            <div class="card-item"><p>Preço Atual do Bitcoin </p><span id="currentPrice">${currencySymbol}${currentBitcoinPrice.toFixed(2)}</span></div>
                            <div class="card-item"><p>Valor Total Agora </p><span id="currentTotalValue">${currencySymbol}${totalValueNow.toFixed(2)}</span></div>
                            <div class="card-item"><p>Lucro em ${currency} </p><span id="profitInUSD">${currencySymbol}${profitInCurrency.toFixed(2)}</span></div>
                            <div class="card-item"><p>Porcentagem de Ganho ou Perda </p><span id="profitPercentage">${profitPercentage.toFixed(2)}%</span></div>
                                
                            `;

                            document.getElementById("result").innerHTML = resultHTML;
                        } else {
                            alert("Não foi possível obter o preço atual do Bitcoin.");
                        }
                        // Remova a classe de animação quando a requisição for concluída com sucesso
                        stopLoadingAnimation();
                    },
                    error: function () {
                        alert("Ocorreu um erro ao buscar o preço atual do Bitcoin.");
                        // Remova a classe de animação quando a requisição falhar
                        stopLoadingAnimation();
                    }
                });
            } else {
                alert("Não foi possível obter os dados de preço na data informada.");
                // Remova a classe de animação quando a requisição falhar
                stopLoadingAnimation();
            }
        },
        error: function () {
            alert("Ocorreu um erro ao buscar os dados de preço do Bitcoin na data informada.");
            // Remova a classe de animação quando a requisição falhar
            stopLoadingAnimation();
        }
    });
}
