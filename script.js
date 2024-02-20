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
    stopLoadingAnimation();
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








const apiUrl = 'https://api.coingecko.com/api/v3/';
const chartElement = document.getElementById('chart');
let chartData = [];

function getData(range) {
  let url;
  const currentDate = new Date().toISOString().split('T')[0];

  switch (range) {
    case '1w':
      url = `${apiUrl}coins/bitcoin/market_chart?vs_currency=brl&days=7&interval=daily`;
      break;
    case '1m':
      url = `${apiUrl}coins/bitcoin/market_chart?vs_currency=brl&days=30&interval=daily`;
      break;
    case '6m':
      url = `${apiUrl}coins/bitcoin/market_chart?vs_currency=brl&days=180&interval=daily`;
      break;
    case '1y':
      url = `${apiUrl}coins/bitcoin/market_chart?vs_currency=brl&days=365&interval=daily`;
      break;
    case 'max':
      url = `${apiUrl}coins/bitcoin/market_chart?vs_currency=brl&days=max&interval=daily`;
      break;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      chartData = data.prices;
      plotChart(chartData);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function plotChart(prices) {
  const formattedData = prices.map(entry => ({
    x: new Date(entry[0]),
    y: entry[1]
  }));

  const options = {
    series: [{
      name: 'Bitcoin Price (BRL)',
      data: formattedData
    }],
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return 'R$ ' + value.toFixed(2);
        }
      }
    },
    title: {
      text: 'Gráfico de preços do Bitcoin',
      align: 'center'
    },
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#FF0000',
        fontSize: '20px'
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yyyy HH:mm'
      }
    },
    locales: [{
      name: 'pt-br',
      options: {
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        toolbar: {
          exportToSVG: 'Exportar SVG',
          exportToPNG: 'Exportar PNG',
          menu: 'Menu',
          selection: 'Selecionar',
          selectionZoom: 'Selecionar Zoom',
          zoomIn: 'Zoom In',
          zoomOut: 'Zoom Out',
          pan: 'Pan',
          reset: 'Resetar Zoom'
        }
      }
    }],
    defaultLocale: 'pt-br'
  };

  const chart = new ApexCharts(chartElement, options);
  chart.render();
}

function downloadCSV() {
  const csvContent = "data:text/csv;charset=utf-8," +
    "Date,Price\n" +
    chartData.map(entry => `${new Date(entry[0]).toLocaleString()},${entry[1]}`).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "bitcoin_prices.csv");
  document.body.appendChild(link); // Required for Firefox
  link.click();
}

// Initialize with default data (1 week)
getData('1w');




// Conversor de moeda fiat para BTC


function converterParaBTC() {
  const moedaSelecionada = document.getElementById('moeda').value;
  const valorDigitado = document.getElementById('valor').value;

  fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${moedaSelecionada}`)
    .then(response => response.json())
    .then(data => {
      const taxaDeCambio = data.bitcoin[moedaSelecionada];
      const valorConvertido = valorDigitado / taxaDeCambio;

      document.getElementById('resultado').innerHTML = `<p>Valor em BTC:</p> <h1>${valorConvertido.toFixed(8)}</h1>`;
    })
    .catch(error => {
      console.error('Erro ao obter a taxa de câmbio:', error);
      document.getElementById('resultado').innerText = 'Erro ao converter para BTC';
    });
}

function converterParaMoeda() {
  const moedaSelecionada = document.getElementById('moeda').value;
  const valorDigitado = document.getElementById('valor').value;

  fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${moedaSelecionada}`)
    .then(response => response.json())
    .then(data => {
      const taxaDeCambio = data.bitcoin[moedaSelecionada];
      const valorConvertido = valorDigitado * taxaDeCambio;

      document.getElementById('resultado').innerHTML = `<p> Valor em ${moedaSelecionada.toUpperCase()}:</p> <h1>${valorConvertido.toFixed(2)}</h1>`;
    })
    .catch(error => {
      console.error('Erro ao obter a taxa de câmbio:', error);
      document.getElementById('resultado').innerText = 'Erro ao converter para Moeda';
    });
}





function open_sidebar() {
  var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  // Verifica se a largura da tela é menor que 600 pixels (um exemplo, ajuste conforme necessário)
  if (screenWidth < 600) {
    document.querySelector(".sidebar").style.width = "50%";
    document.querySelector(".btnOpenSedebar").style.display = "none";
  } else {
    document.querySelector(".sidebar").style.width = "15%";
    document.querySelector(".btnOpenSedebar").style.display = "none";
  }
}

function close_sidebar() {
  document.querySelector(".sidebar").style.width = "0";
  document.querySelector(".btnOpenSedebar").style.display = "block";
}




var qrcodeElement = document.getElementById('qrcode');
var qrcodeTextElement = document.getElementById('qrcodeText');

function toggleQRCode() {
  if (qrcodeElement.style.width === "60px") {
    // Expandir o QR Code
    qrcodeElement.style.width = "250px";
    qrcodeElement.style.height = "300px";
    qrcodeElement.style.borderRadius = "6px";
    qrcodeElement.style.backgroundImage = 'url("img/QRcodeLightnig.jpeg")';
    qrcodeTextElement.textContent = 'Me doe uns Satoshinhos';
    qrcodeTextElement.style.textAlign = 'center';


    // Adicionar um ouvinte de clique no documento para fechar o QR Code
    document.addEventListener('click', closeQRCode);
  } else {
    // Reduzir o QR Code
    qrcodeElement.style.width = "60px";
    qrcodeElement.style.height = "60px";
    qrcodeElement.style.borderRadius = "50px";
    qrcodeElement.style.backgroundImage = '';
    qrcodeTextElement.textContent = '';

    // Remover o ouvinte de clique no documento
    document.removeEventListener('click', closeQRCode);
  }
}

function closeQRCode(event) {
  // Verificar se o clique foi dentro ou fora do QR Code
  if (!qrcodeElement.contains(event.target)) {
    // Reduzir o QR Code quando o usuário clicar fora dele
    qrcodeElement.style.width = "60px";
    qrcodeElement.style.height = "60px";
    qrcodeElement.style.borderRadius = "50px";
    qrcodeElement.style.backgroundImage = '';
    qrcodeTextElement.textContent = ''


    // Remover o ouvinte de clique no documento
    document.removeEventListener('click', closeQRCode);
  }
}



document.addEventListener("DOMContentLoaded", function () {
  const countdownElement = document.getElementById('countdown');

  // Função para atualizar o contador
  function updateCountdown() {
    // Obtendo a data prevista para o próximo halving usando a API do Blockchain.info
    fetch('https://blockchain.info/q/getblockcount')
      .then(response => response.text())
      .then(blockCount => {
        const currentBlock = parseInt(blockCount);
        const blocksPerHalving = 210000;
        const blocksRemaining = blocksPerHalving - (currentBlock % blocksPerHalving);
        const secondsRemaining = blocksRemaining * 600; // aproximadamente 10 minutos por bloco

        let seconds = secondsRemaining % 60;
        let minutes = Math.floor((secondsRemaining / 60) % 60);
        let hours = Math.floor((secondsRemaining / (60 * 60)) % 24);
        let days = Math.floor(secondsRemaining / (60 * 60 * 24));

        const now = new Date();
        const halvingDate = new Date(now.getTime() + secondsRemaining * 1000);


        countdownElement.innerHTML = `
            <div class="countdown">
                <div><span id="days" class="count">${days}</span>dias</div>
                <div><span id="hours" class="count">${hours}</span>horas</div>
                <div><span id="minutes" class="count">${minutes}</span>min</div>
                <div><span id="seconds" class="count">${seconds}</span>seg</div>
            </div>
            
            <div class="previstoHalving">
            <span>previsto para ${halvingDate.toLocaleString()}</span>
            </div>`


        // Atualizar o contador a cada segundo
        setInterval(() => {
          seconds--;
          if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
              minutes = 59;
              hours--;
              if (hours < 0) {
                hours = 23;
                days--;
              }
            }
          }

          countdownElement.innerHTML = `
              <div class="countdown">
                  <div><span id="days" class="count">${days}</span><div>dias</div></div>
                  <div><span id="hours" class="count">${hours}</span><div>horas</div></div>
                  <div><span id="minutes" class="count">${minutes}</span><div>min</div></div>
                  <div><span id="seconds" class="count">${seconds}</span><div>seg</div></div>
              </div>
              
              <div class="previstoHalving">
              <span>previsto para ${halvingDate.toLocaleString()}</span>
              </div>`

        }, 1000);
      })
      .catch(error => {
        console.error('Erro ao obter dados da API:', error);
        countdownElement.innerHTML = 'Erro ao obter dados da API.';
      });
  }

  // Chamar a função de atualização inicialmente
  updateCountdown();
});





// Atualiza o ano no rodapé
function updateYear() {
  var currentYear = new Date().getFullYear();
  document.getElementById("current-year").textContent = currentYear;
}

// função uma vez para definir o ano inicial
updateYear();

//intervalo para atualizar o ano a cada virada de ano
setInterval(updateYear, 1000 * 60 * 60 * 24); // Atualiza a cada 24 horas (para lidar com alterações de fuso horário)



document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://api.coingecko.com/api/v3/coins/bitcoin";

  const cardsContainer = document.getElementById("cards-container");

  // Simulando requisição à API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      createCard("Preço atual", formatNumber(data.market_data.current_price.usd) + " USD");
      createCard("Capitalização de mercado", formatNumber(data.market_data.market_cap.usd) + " USD");
      createCard("Volume total", formatNumber(data.market_data.total_volume.usd) + " USD");
      createCard("Oferta circulante", `${data.circulating_supply}`);
      createCard("Variação nas últimas 24 horas", `${data.market_data.price_change_percentage_24h}%`);
      createCard("Tempo médio por bloco", `${data.block_time_in_minutes} minutos`);
    })
    .catch(error => console.error("Erro ao obter dados da API:", error));

  function createCard(title, content) {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardTitle = document.createElement("h2");
    cardTitle.textContent = title;

    const cardContent = document.createElement("p");
    cardContent.textContent = content;

    card.appendChild(cardTitle);
    card.appendChild(cardContent);

    cardsContainer.appendChild(card);
  }

  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
});



