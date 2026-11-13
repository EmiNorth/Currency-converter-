
const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convert");
const swapBtn = document.getElementById("swap");
const result = document.getElementById("result");
const rate = document.getElementById("rate");
const message = document.getElementById("message");

async function convertCurrency() {
    const value = Number(amount.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    message.textContent = "";

    if (!amount.value || !Number.isFinite(value) || value <= 0) {
        message.textContent = "Please enter a valid amount.";
        result.textContent = "0.00";
        rate.textContent = "";
        return;
    }

    convertBtn.disabled = true;
    convertBtn.textContent = "Converting...";

    try {
        const response = await fetch(
            `https://open.er-api.com/v6/latest/${from}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch exchange rates.");
        }

        const data = await response.json();

        if (data.result !== "success" || !data.rates[to]) {
            throw new Error("Currency rate unavailable.");
        }

        const exchangeRate = data.rates[to];
        const convertedAmount = value * exchangeRate;

        result.textContent = convertedAmount.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ) + " " + to;

        rate.textContent =
            `1 ${from} = ${exchangeRate.toFixed(4)} ${to}`;

    } catch (error) {
        message.textContent = "Conversion failed. Check your internet connection.";
        result.textContent = "0.00";
        rate.textContent = "";
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = "Convert Now";
    }
}

convertBtn.addEventListener("click", convertCurrency);

swapBtn.addEventListener("click", () => {
    const temporary = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = temporary;

    convertCurrency();
});

amount.addEventListener("input", () => {
    if (amount.value > 0) {
        convertCurrency();
    }
});

fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

// Convert immediately when the page opens
convertCurrency();


