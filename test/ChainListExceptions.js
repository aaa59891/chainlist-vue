const ChainList = artifacts.require('./ChainList.sol')
const utils = require('./utils.js')
const Article = require('./models/article.js')
const Account = require('./models/account.js')

contract('ChainList exceptions', (accounts) => {
    let ins
    const seller = new Account(accounts[1])
    const buyer = new Account(accounts[2])
    const article = new Article('article', 'desc', 10)

    before('setup ChainList instance', async () => {
        ins = await ChainList.deployed()
    })

    it('should throw an exception when trying to buy an article and there is no article for sale',
        async () => {
            await ins.buyArticle(1, {
                    from: buyer.account,
                    value: web3.toWei(article.price, 'ether')
                })
                .catch(() => assert(true))

            const count = await ins.getArticlesCount()
            const sellIds = await ins.getSellArticleIds()

            assert.equal(count, 0, 'the count of the articles should be 0')
            assert.equal(sellIds.length, 0, 'the length of the sellIds should be 0')
        })

    it('should throw an exception when you buy your own article', async () => {
        await ins.sellArticle(
            article.name,
            article.desc,
            web3.toWei(article.price, 'ether'),
            {from: seller.account}
        )

        await ins.buyArticle(1, {from: seller, value: web3.toWei(article.price, 'ether')})
            .catch(() => assert(true))
        const sellIds = await ins.getSellArticleIds()
        const data = await ins.articles(1)
        assert.equal(sellIds.length, 1, 'the length of the sellIds should still be 1')

        assert.equal(data[0], 1, 'id should be 1')
        assert.equal(data[1], seller.account, `seller should be ${seller.account}`)
        assert.equal(data[2], 0x0, 'buyer should be empty')
        assert.equal(data[3], article.name, `name should be ${article.name}`)
        assert.equal(data[4], article.desc, `description should be ${article.desc}`)
        assert.equal(utils.currency.getEtherFromWei(data[5]), article.price, `price should be ${article.price}`)
    })

    it('should throw an exception when you buy an article with wrong price', async () => {
        await ins.buyArticle({from: buyer.account, value: web3.toWei(article.price - 1, 'ether')})
            .catch(() => assert(true))
        const sellIds = await ins.getSellArticleIds()
        const count = await ins.getArticlesCount()
        const data = await ins.articles(1)

        assert.equal(sellIds.length, 1, 'the length of the sellIds should be 1')
        assert.equal(count, 1, 'the count of the articles should be 1')
        assert.equal(data[0], 1, 'id should be 1')
        assert.equal(data[1], seller.account, `seller should be ${seller.account}`)
        assert.equal(data[2], 0x0, 'buyer should be empty')
        assert.equal(data[3], article.name, `name should be ${article.name}`)
        assert.equal(data[4], article.desc, `description should be ${article.desc}`)
        assert.equal(utils.currency.getEtherFromWei(data[5]), article.price, `price should be ${article.price}`)
    })

    it('should throw an exception when you buy an article which has already been sold out', async () => {
        const buyObj = {from: buyer.account, value: web3.toWei(article.price, 'ether')}
        await ins.buyArticle(1, buyObj)
        await ins.buyArticle(1, buyObj)
            .catch(() => assert(true))
        
        const sellIds = await ins.getSellArticleIds()
        const data = await ins.articles(1)

        assert.equal(sellIds.length, 0, 'the length of the sellIds should be 0')
        assert.equal(data[0], 1, 'id should be 1')
        assert.equal(data[1], seller.account, `seller should be ${seller.account}`)
        assert.equal(data[2], buyer.account, `buyer should be ${buyer.account}`)
        assert.equal(data[3], article.name, `name should be ${article.name}`)
        assert.equal(data[4], article.desc, `description should be ${article.desc}`)
        assert.equal(utils.currency.getEtherFromWei(data[5]), article.price, `price should be ${article.price}`)
    })
})
