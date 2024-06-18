async function fetchCurrencyRates(baseCurrency = 'USD') {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

function convertCurrency() {
    const conversionInput = document.getElementById('conversionInput').value.trim().toLowerCase();
    const conversionResult = document.getElementById('conversionResult');

    if (!conversionInput) {
        conversionResult.textContent = 'Please enter a conversion (e.g., 15 USD to EUR)';
        return;
    }

    const regex = /^(\d+(?:\.\d+)?)\s+(\w{3})\s+(?:to|in)\s+(\w{3})$/;
    const match = conversionInput.match(regex);

    if (!match) {
        conversionResult.textContent = 'Invalid input format. Please enter in format like "15 USD to EUR".';
        return;
    }

    const amount = parseFloat(match[1]);
    const fromCurrency = match[2].toUpperCase();
    const toCurrency = match[3].toUpperCase();

    fetchCurrencyRates(fromCurrency)
        .then(data => {
            const rate = data.rates[toCurrency];
            if (rate) {
                const result = amount * rate;
                conversionResult.textContent = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
            } else {
                conversionResult.textContent = `Conversion rate for ${toCurrency} not found.`;
            }
        })
        .catch(error => {
            conversionResult.textContent = `Error fetching data: ${error.message}`;
        });
}

async function displayCurrencyRates() {
    const currencyRatesDiv = document.getElementById('currencyRates');
    currencyRatesDiv.innerHTML = '<p>Loading...</p>';

    try {
        const data = await fetchCurrencyRates();
        const rates = data.rates;
        const baseCurrency = data.base;

        let html = '<ul>';
        for (const currency in rates) {
            if (rates.hasOwnProperty(currency)) {
                html += `<li>1 ${baseCurrency} = ${rates[currency].toFixed(2)} ${currency}</li>`;
            }
        }
        html += '</ul>';

        currencyRatesDiv.innerHTML = html;
    } catch (error) {
        currencyRatesDiv.innerHTML = `<p>Error loading currency rates: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayCurrencyRates();
});
