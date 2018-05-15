<template>
    <div>
        <div class="pull-left">
            {{account}}
        </div>
        <div class="pull-right">
            {{ ether }} ETH
        </div>
    </div>
</template>

<script>
    import * as types from '../store/types.js'
    import {mapGetters} from 'vuex'
    export default{
        data(){
            return {
                eth: web3.eth,
            }
        },
        computed:{
            account(){
                return this.eth.coinbase;
            },
            ...mapGetters({
                ether: types.ACCOUNT_GET_ETHER
            })
        },
        watch:{
            account:{
                immediate: true,
                handler(newVal, oldVal){
                    this.$store.dispatch(types.ACCOUNT_ACT_GETETHER)
                }
            }
        }
    }
</script>

<style scoped>
</style>