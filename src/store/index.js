import Vue from 'vue';
import Vuex from 'vuex';
import article from './modules/article.js'
import account from './modules/account.js'

Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
        article,
        account
    },
    strict: true
})