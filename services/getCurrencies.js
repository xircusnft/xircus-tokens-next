const getCurrencies = async(chainId) => {
    const res = await fetch(`https://api.xircus.app/currencies?chainId=${form.chainId}`, {
      method: "GET",
    })
    const currencies = await res.json()
    return currencies
  }