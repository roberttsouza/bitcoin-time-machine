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
                <span>Previsto para ${halvingDate.toLocaleString()}</span>
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
  
  
  
  
  
  document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/bitcoin";
  
    const cardsContainer = document.getElementById("cards-container");
  
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
  
  
  

  var qrcodeElement = document.getElementById('qrcode');
var qrcodeTextElement = document.getElementById('qrcodeText');

function toggleQRCode() {
  if (qrcodeElement.style.width === "60px") {
    // Expandir o QR Code
    qrcodeElement.style.width = "250px";
    qrcodeElement.style.height = "300px";
    qrcodeElement.style.borderRadius = "6px";
    qrcodeElement.style.backgroundImage = 'url("/img/QRcodeLightnig.jpeg")';
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