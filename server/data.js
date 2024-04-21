const ratesPerGBP = {
    EUR: {
        rate: 1.1661482,
        name: "Euro",
        symbol: "€"
    },
    USD: {
        rate:  1.4638436,
        name: "US Dollar",
        symbol: "$"
    },
    CAD: {
        rate:  1.7173866,
        name: "Canadian dollar",
        symbol: "$"
    },
    JPY: {
        rate:  191.63238,
        name: "Japanese Yen",
        symbol: "¥"
    },
    NZD: {
        rate:  2.1018546,
        name: "New Zealand Dollar",
        symbol: "$"
    },
    THB: {
        rate:  46.45587,
        name: "Thai Bhat",
        symbol: "฿"
    },
    CNY: {
        rate:  9.1417166,
        name: "Chinese Yuan",
        symbol: "¥"
    },
    AUD: {
        rate:  1.9147731,
        name: "Australian Dollar",
        symbol: "$"
    },
    CHF: {
        rate:  1.1399409,
        name: "Swiss Franc",
        symbol: "Fr"
    },
    ZAR: {
        rate:  23.606591,
        name: "South African Rand",
        symbol: "R"
    }
}

const getRateForCurrency = (currency) => {
    if(currency === "GBP") {
        return ratesPerGBP;
    } else if(ratesPerGBP[currency]){
        const gbpToCurrencyRate = ratesPerGBP[currency].rate
        let response = {}
        for (const [key, value] of Object.entries(ratesPerGBP)) {
            if(key === currency) {
                response = {
                    GBP: {
                        rate: parseFloat((1/gbpToCurrencyRate).toFixed(7)),
                        name: "British Pound",
                        symbol: "£"
                    },
                    ...response
                }
            } else {
                response[key] = {
                    rate: parseFloat(((1/gbpToCurrencyRate)*value.rate).toFixed(7)),
                    name: value.name,
                    symbol: value.symbol
                }
            }
        }
        return response;
    } else {
        return null;
    }
}

exports.getRateForCurrency = getRateForCurrency