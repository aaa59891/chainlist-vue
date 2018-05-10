<template>
  <div v-if="article" class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">{{article.name}}</h3>
    </div>
    <div class="panel-body">
      <div>
        Description: {{article.desc}}
      </div>
      <div>
        Price: {{article.price}}
      </div>
      <div>
        <div class="col-xs-6">
          Sold by: {{seller}}
        </div>
        <div class="col-xs-6" v-if="buyer">
          Bought by: {{buyer}}
        </div>
      </div>
    </div>
    <div class="panel-footer text-right" v-if="eth.coinbase != article.seller && eth.coinbase != article.buyer">
      <button class="btn btn-primary btn-sm" @click="buyArticle()" :disabled="buying">
        Buy 
      </button>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex';
  import * as types from '../store/types.js';

  export default {
    data() {
      return {
        eth: web3.eth
      }
    },
    computed: {
      ...mapGetters({
        article: types.ARTICLE_GET_ARTICLE,
        buying: types.ARTICLE_GET_BUYING
      }),
      seller(){
          return this.article.seller === this.eth.coinbase? 'You': this.article.seller;
      },
      buyer(){
          if(this.article.buyer == 0x0){
              return '';
          }
          return this.article.buyer === this.eth.coinbase? 'You': this.article.buyer;
      }
    },
    methods: {
      buyArticle() {
        const vm = this;
        vm.$store.commit(types.ARTICLE_MUTATE_BUYING, true);
        vm.$chainList.buyArticle({
          from: web3.eth.coinbase,
          value: web3.toWei(this.article.price, 'ether')
        })
        .catch((err) => {
            console.error(err)
            vm.$store.commit(types.ARTICLE_MUTATE_BUYING, false);
        })
      }
    }
  }

</script>

<style scoped>
  .panel-body>div {
    overflow: hidden;
    margin: 10px 0;
  }

  .col-xs-6 {
    padding: 0
  }

</style>
