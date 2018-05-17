import * as types from '../types.js';

const state = {
    ether: 0
}

const getters = {
    [types.ACCOUNT_GET_ETHER]: (state) => state.ether
}

const mutations = {
    [types.ACCOUNT_MUTATE_ETHER]: (state, ether) => {
        state.ether = ether;
    }
}

const actions = {
    [types.ACCOUNT_ACT_GETETHER]: ({commit}) => {
        const account = web3.eth.coinbase;
        return new Promise((resolve, reject) => {
            web3.eth.getBalance(account, (err, balance) => {
                if(err){
                    reject(err)
                    return
                }
                commit(types.ACCOUNT_MUTATE_ETHER, Number(web3.fromWei(balance, 'ether')))
                resolve()
            })
        });
    }
}

export default{
    state,
    getters,
    mutations,
    actions
}