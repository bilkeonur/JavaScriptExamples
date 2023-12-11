let formatNumber = (number) => {
    let formatedNumber = number < 10 ? "0" + number : number;
    return formatedNumber;
}