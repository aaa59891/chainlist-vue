import * as types from '../types.js'
import {getChainListInstance} from '../../setup.js'

const state = {
    article: null,
    buying: false
}

const getters = {
    [types.ARTICLE_GET_ARTICLE]: (state) => state.article,
    [types.ARTICLE_GET_BUYING]: (state) => state.buying
}

const mutations = {
    [types.ARTICLE_MUTATE_ARTICLE]: (state, article) => {
        state.article = article;
    },
    [types.ARTICLE_MUTATE_BUYING]: (state, bool) => {
        state.buying = bool;
    }
}

const actions = {
    [types.ARTICLE_ACT_LOADARTICLE]: ({commit}) => {
        return new Promise((resolve, reject) => {
            getChainListInstance()
                .then((ins) => {
                    return ins.getArticle()
                })
                .then((article) => {
                    let obj = {}
                    const account = web3.eth.coinbase;
                    if(article[0] == 0x0){
                        resolve()
                        return
                    }
                    obj.seller = article[0];
                    obj.buyer = article[1];
                    obj.name = article[2];
                    obj.desc = article[3];
                    obj.price = web3.fromWei(article[4], 'ether').toNumber();
                    commit(types.ARTICLE_MUTATE_ARTICLE, obj);
                    resolve()
                })
                .catch(reject)
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}