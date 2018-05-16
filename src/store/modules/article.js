import * as types from '../types.js'
import {getChainListInstance} from '../../setup.js'
import Article from '../../models/article.js'

const state = {
    articles: {}
}

const getters = {
    [types.ARTICLE_GET_ARTICLES]: (state) => state.articles
}

const mutations = {
    [types.ARTICLE_MUTATE_ARTICLES]: (state, articles) => {
        state.articles = articles
    },
    [types.ARTICLE_MUTATE_BUYING]: (state, {id, buying}) => {
        if(state.articles[id]){
            state.articles[id].buying = buying;
        }
    },
    [types.ARTICLE_MUTATE_ADD_ARTICLE]: (state, article) => {
        const id = article.id
        if(!state.articles[id]){
            state.articles = {...state.articles, id: article}
        }
    },
    [types.ARTICLE_MUTATE_REMOVE_ARTICLE]: (state, id) => {
        if(state.articles[id]){
            const newArticles = {...state.articles}
            delete newArticles[id]
            state.articles = newArticles
        }
    }
}

const actions = {
    [types.ARTICLE_ACT_LOADARTICLE]:  async ({commit}) => {
        try{
            const ins = await getChainListInstance()
            const sellIds = await ins.getSellArticleIds()
            let articlesArr = await Promise.all(sellIds.map((id) => ins.articles(Number(id))))
            commit(types.ARTICLE_MUTATE_ARTICLES, articlesArr.reduce((pre, cur) => {
                const article = new Article(
                    cur[0].toNumber(),
                    cur[1],
                    cur[2],
                    cur[3],
                    cur[4],
                    web3.fromWei(cur[5], 'ether').toNumber(),
                    false,
                )
                pre[article.id] = article
                return pre
            }, {}))
        }catch(e){
            throw e
        }
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}