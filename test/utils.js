const account = {
    getEtherByAccount(account){
        return Math.round(web3.fromWei(web3.eth.getBalance(account), 'ether').toNumber());
    }
}

const currency = {
    getEtherFromWei(wei){
        return web3.fromWei(wei, 'ether').toNumber();
    }
}

module.exports = {
    account,
    currency
};