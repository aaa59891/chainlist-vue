<template>
    <div>
        <form>
            <div class="form-group">
                <label for="articleName">Article Name</label>
                <input id="articleName" type="text" class="form-control" v-model="name">
            </div>
            <div class="form-group">
                <label for="articlePrice">Price</label>
                <input type="number" id="articlePrice" v-model.number="price" class="form-control">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea v-model="desc" class="form-control"></textarea>
            </div>
            <div class="form-group">
                <button class="pull-right btn btn-default" @click.prevent="$emit('close')">Cancel</button>
                <button class="pull-right btn btn-default" @click.prevent="sellArticle()">Sell</button>
            </div>
        </form>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                name: '',
                price: 0,
                desc: ''
            }
        },
        methods:{
            sellArticle(){
                this.$chainList.sellArticle(
                    this.name,
                    this.desc,
                    web3.toWei(this.price, 'ether'),
                    {
                        from: web3.eth.coinbase
                    }
                ).then(() => {
                    this.$emit('close');
                }).catch((err) => {
                    console.error(err);
                })
            }
        }
    }
</script>

<style scoped>
</style>