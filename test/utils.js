const account = {
    getEtherByAccount(account){
        return Math.round(Number(web3.fromWei(web3.eth.getBalance(account), 'ether')));
    }
}

const currency = {
    getEtherFromWei(wei){
        return Number(web3.fromWei(wei, 'ether'));
    }
}

module.exports = {
    account,
    currency
};