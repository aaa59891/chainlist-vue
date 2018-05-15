import Vue from 'vue'
import App from './App.vue'
import * as setup from './setup.js'
import store from './store/index.js'
import * as types from './store/types.js'
import Article from './models/article.js'

web3 = new Web3(setup.getProvider());

setup.getChainListInstance()
    .then((ins) => {
        Vue.prototype.$chainList = ins;
        setChainListWatches(ins);
    })

const app = new Vue({
    el: '#app',
    store,
    render: h => h(App)
})

function setChainListWatches(instance) {
    instance.LogSellArticle().watch((err, log) => {
        if (err) {
            console.error(err);
            return;
        }
        const {args} = log
        app.$store.commit(types.ARTICLE_MUTATE_ADD_ARTICLE, new Article(
            args._id.toNumber(),
            args._seller,
            0x0,
            args._name,
            args._description,
            web3.fromWei(args._price, 'ether').toNumber(),
            false
        ))
    });

    instance.LogBuyArticle({},{fromBlock:'latest', toBlock:'pending'}).watch((err, log) => {
        if (err) {
            console.error(err);
            return;
        }
        app.$store.commit(types.ARTICLE_MUTATE_REMOVE_ARTICLE, log.args._id)
        app.$store.dispatch(types.ACCOUNT_ACT_GETETHER);
        app.$store.commit(types.ARTICLE_MUTATE_BUYING, {id: log.args._id.toNumber(), buying:false});
    })
}
