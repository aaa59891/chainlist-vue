<template>
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 text-center">
                <h1>ChainList practice</h1>
            </div>
        </div>
        <div class="row">
            <app-user-info></app-user-info>
        </div>
        <div class="row">
            <div class="pull-right">
                <button class="btn btn-primary" @click="showEditArticle = !showEditArticle">Sell Article</button>
            </div>
        </div>
        <div class="row">
            <app-article v-for="article in articles" :article="article" :key="article.id"></app-article>
        </div>
        <appDialog v-if="showEditArticle" @close="showEditArticle = false">
            <h3 slot="header">Sell Article</h3>
            <app-article-form slot="body" @close="showEditArticle = false"></app-article-form>
        </appDialog>
    </div>
</template>

<script>
    import UserInfo from './components/UserInfo.vue'
    import Dialog from './components/Dialog.vue'
    import ArticleForm from './components/form/SellArticle.vue'
    import Article from './components/Article.vue'
    import {mapGetters} from 'vuex'
    import * as types from './store/types.js'

    export default {
        data() {
            return {
                showEditArticle: false
            }
        },
        computed:{
            ...mapGetters({
                articles: types.ARTICLE_GET_ARTICLES
            })
        },
        components: {
            appUserInfo: UserInfo,
            appDialog: Dialog,
            appArticleForm: ArticleForm,
            appArticle: Article
        },
        beforeCreate(){
            this.$store.dispatch(types.ARTICLE_ACT_LOADARTICLE, this.$chainList)
        }
    }

</script>

<style>
    .row {
        margin: 10px;
    }

</style>
