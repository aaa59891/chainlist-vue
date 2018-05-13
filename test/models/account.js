const utils = require('../utils.js')

class Account{
    constructor(account){
        this.account = account
    }

    getEther(){
        return utils.account.getEtherByAccount(this.account)
    }
}

module.exports = Account