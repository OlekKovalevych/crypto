const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'ENV',
		'X-RapidAPI-Host': 'ENV'
	}
};

fetch('https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0', options)
	.then(response => response.json())
	.then(response => createCoinsTable(response.data.coins))
	.catch(err => console.error(err));

function createCoinsTable(data){
    const coinsTableBodyElement = document.getElementById("coinsTableBody");
    data.forEach(element => {
        let priceFormatted = parseFloat(element.price).toLocaleString("en-US", {style:"currency", currency:"USD"});
        let marketCapFormatted = parseInt(element.marketCap).toLocaleString("en-US", {style:"currency", currency:"USD"});

        coinsTableBodyElement.innerHTML += `
        <tr onclick="displayCoinDetails(this)" id=${element.uuid}>
            <td>${element.rank}</td>
            <td><img src="${element.iconUrl}" alt="${element.name} icon" > ${element.name}</td>
            <td>${element.symbol}</td>
            <td >${priceFormatted}</td>
            <td>${marketCapFormatted}</td>
            <td><svg id="sparkline-chart${element.uuid}"></svg></td>
        </tr>
        `;
        var data = element.sparkline;
        var width = 200, height = 50;

        var svg = d3.select(`#sparkline-chart${element.uuid}`)
                    .attr("width", width)
                    .attr("height", height);

        var x = d3.scaleLinear()
                .domain([0, data.length])
                .range([0, width]);

        var y = d3.scaleLinear()
                .domain([d3.min(data), d3.max(data)])
                .range([height, 0]);

        var line = d3.line()
                    .x(function(d, i) { return x(i); })
                    .y(function(d) { return y(d); });

        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#89e894")
        .attr("stroke-width", 1.5)
        .attr("d", line);
            });
        }

function displayCoinDetails(x){
    const url = 'https://coinranking1.p.rapidapi.com/coin/' + x.id + '?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h';
    fetch(url, options)
	.then(response => response.json())
	.then(response => displayCryptoModal(response.data.coin))
	.catch(err => console.error(err));
}

function displayCryptoModal(coinData){
    const cryptoModalTitle = document.getElementById("cryptoModalTitle");
    cryptoModalTitle.innerHTML = coinData.name;
    const cryptoModalBody = document.getElementById("cryptoModalBody");
    cryptoModalBody.innerHTML = `
        <a href="${coinData.websiteUrl}">Strona internetowa projektu</a><br />
        <p>${coinData.description}</p>
    `;

    const cryptoModal = new bootstrap.Modal('#cryptoModal');
    cryptoModal.show();
}


