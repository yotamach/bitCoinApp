export const convertFronBTCtoUSD = () => fetch('https://api.coindesk.com/v1/bpi/currentprice/usd.json');
export const numm = (v, decPoint = null, max = Infinity) => {
    const r = parseFloat(Math.min(max, v)).toFixed(decPoint ? decPoint : 2);
    return (isNaN(r * 1)) ? 0 : r
}