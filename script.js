document.addEventListener("DOMContentLoaded", () => {
  const converterPage = document.getElementById("converterPage");
  const ratesPage = document.getElementById("ratesPage");
  const converterDiv = document.getElementById("converter");
  const ratesDiv = document.getElementById("rates");
  const currencyInput = document.getElementById("currencyInput");
  const convertButton = document.getElementById("convertButton");
  const conversionResult = document.getElementById("conversionResult");
  const baseCurrencySpan = document.getElementById("baseCurrency");
  const ratesList = document.getElementById("ratesList");

  let baseCurrency = "USD";
  baseCurrencySpan.textContent = baseCurrency;

  const showConverterPage = () => {
    converterDiv.classList.add("active");
    ratesDiv.classList.remove("active");
  };

  const showRatesPage = () => {
    converterDiv.classList.remove("active");
    ratesDiv.classList.add("active");
    fetchRates();
  };

  converterPage.addEventListener("click", showConverterPage);
  ratesPage.addEventListener("click", showRatesPage);

  const fetchRates = async () => {
    try {
      const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=YOUR_APP_ID`);
      const data = await response.json();
      const rates = data.rates;
      ratesList.innerHTML = '';
      for (const currency in rates) {
        const rateItem = document.createElement("div");
        rateItem.textContent = `1 ${baseCurrency} = ${rates[currency]} ${currency}`;
        ratesList.appendChild(rateItem);
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  const convertCurrency = async () => {
    const [amount, from, , to] = currencyInput.value.toUpperCase().split(' ');
    try {
      const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=YOUR_APP_ID`);
      const data = await response.json();
      const rates = data.rates;
      const convertedAmount = (amount / rates[from]) * rates[to];
      conversionResult.textContent = `${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}`;
    } catch (error) {
      console.error("Error converting currency:", error);
      conversionResult.textContent = 'Error converting currency';
    }
  };

  convertButton.addEventListener("click", convertCurrency);

  // Show the converter page by default
  showConverterPage();
});
