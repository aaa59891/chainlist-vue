const ChainList = artifacts.require('./ChainList.sol')
const Article = require('./models/article.js')
const Account = require('./models/account.js')
const utils = require('./utils.js')

contract('ChainList', async(accounts) => {
    let chainListInstance
    let ins;
    const seller = new Account(accounts[1])
    const buyer = new Account(accounts[3])
    const article1 = new Article('article 1', 'desc 1', 10)
    const article2 = new Article('article 2', 'desc 2', 20)
    const articles = [article1, article2]

    before('setup ChainList instance', async () => {
        ins = await ChainList.deployed()
    })

    it('should be initialized with empty values', async () => {
        let count = await ins.getArticlesCount()
        let sellIds = await ins.getSellArticleIds()

        assert.equal(count.toNumber(), 0, 'the article count should be 0')
        assert.equal(sellIds.length, 0, 'the sell ids array sohuld be empty')
    })

    it('should sell multiple articles', async () => {
        const result1 = await ins.sellArticle(
            article1.name,
            article1.desc,
            web3.toWei(article1.price, 'ether'), {
                from: seller.account
            }
        )
        const result2 = await ins.sellArticle(
            article2.name,
            article2.desc,
            web3.toWei(article2.price, 'ether'), {
                from: seller.account
            }
        )
        const results = [result1, result2]

        for (let i = 0; i < articles.length; i++) {
            /* check the log */
            const article = articles[i]
            const result = results[i]
            const log = result.logs[0]

            assert.equal(result.logs.length, 1, 'sell a article should emit a event.')
            assert.equal(log.event, 'LogSellArticle', 'event should be LogSellArticle')
            assert.equal(log.args._id, i + 1, `log: article${i + 1}'s id should be ${i + 1}`)
            assert.equal(log.args._seller, seller.account, `log: article${i + 1}'s seller should be ${seller.account}`)
            assert.equal(log.args._name, article.name, `log: article${i + 1}'s name should be ${article.name}`)
            assert.equal(log.args._description, article.desc, `log: article${i + 1}'s desc should be ${article.desc}`)
            assert.equal(web3.fromWei(log.args._price, 'ether'), article.price, `log: article${i + 1}'s price should be ${article.price}`)

            /* check articles */
            const data = await ins.articles(i + 1)

            assert.equal(Number(data[0]), i + 1, `article${i + 1}'s id should be ${i + 1}`)
            assert.equal(data[1], seller.account, `article${i + 1}'s seller should be ${seller.account}`)
            assert.equal(data[2], 0x0, `article${i + 1}'s buyer should be empty`)
            assert.equal(data[3], article.name, `article${i + 1}'s name should be ${article.name}`)
            assert.equal(data[4], article.desc, `article${i + 1}'s desc should be ${article.desc}`)
            assert.equal(web3.fromWei(data[5], 'ether'), article.price, `article${i + 1}'s price should be ${article.price}`)
        }

        const sellIds = await ins.getSellArticleIds()

        assert.equal(sellIds.length, articles.length, `the sellIds's length should be ${articles.length}`)

        const count = await ins.getArticlesCount()
        assert.equal(count, articles.length, `the count of articles should be ${articles.length}`)
    })

    it('should buy an article', async () => {
        const article = articles[0]
        const id = 1

        const sellerEtherBeforeBuy = seller.getEther()
        const buyerEtherBeforeBuy = buyer.getEther()

        const result = await ins.buyArticle(id, {
            from: buyer.account,
            value: web3.toWei(article.price, 'ether')
        })
        const sellIds = await ins.getSellArticleIds()
        const log = result.logs[0]

        const sellerEtherAfterBuy = seller.getEther()
        const buyerEtherAfterBuy = buyer.getEther()

        assert.equal(sellIds.length, articles.length - 1, 'the sell ids length should be minus 1')

        assert.equal(result.logs.length, 1, 'buy a article should emit a event.')
        assert.equal(log.event, 'LogBuyArticle', 'event should be LogBuyArticle')
        assert.equal(log.args._id.toNumber(), id, `the seller should be ${id}`)
        assert.equal(log.args._seller, seller.account, `the seller should be ${seller.account}`)
        assert.equal(log.args._buyer, buyer.account, `the buyer should be ${buyer.account}`)
        assert.equal(log.args._name, article.name, `the name should be ${article.name}`)

        assert(sellerEtherAfterBuy - sellerEtherBeforeBuy == article.price, `seller should increase the Ether with ${article.price}`)
        assert(buyerEtherBeforeBuy - buyerEtherAfterBuy <= article.price, `buyer should decrease the Ether with ${article.price}`)
    })

})
