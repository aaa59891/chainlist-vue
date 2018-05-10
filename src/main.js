import Vue from 'vue'
import App from './App.vue'
import * as setup from './setup.js'
import store from './store/index.js'
import * as types from './store/types.js'

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
  instance.LogSellArticle({}, {}).watch((err, log) => {
    if (err) {
      console.error(err);
      return;
    }
    app.$store.dispatch(types.ARTICLE_ACT_LOADARTICLE)
  });

  instance.LogBuyArticle({}, {}).watch((err, log) => {
    if(err){
      console.error(err);
      return;
    }
    app.$store.dispatch(types.ARTICLE_ACT_LOADARTICLE);
    app.$store.dispatch(types.ACCOUNT_ACT_GETETHER);
    app.$store.commit(types.ARTICLE_MUTATE_BUYING, false);
  })
}
