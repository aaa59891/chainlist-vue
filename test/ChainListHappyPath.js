const ChainList = artifacts.require('./ChainList.sol');
const utils = require('./utils.js');

contract('ChainList', (accounts) => {
    let chainListInstance;
    const seller = accounts[1];
    const buyer = accounts[3]
    const name = 'article 1';
    const desc = 'desc';
    const price = 10;
    let sellerEtherBeforeBuy, sellerEtherAfterBuy;
    let buyerEtherBeforeBuy, buyerEtherAfterBuy;

    
    
    it('should be initialized with empty values', async () => {
        let ins = await ChainList.deployed()
        let count = await ins.getArticlesCount()
        let sellIds = await ins.getSellArticleIds()

        assert.equal(count.toNumber(), 0, 'the article count should be 0')
        assert.equal(sellIds.length, 0, 'the sell ids array sohuld be empty')
    });

    // it('should set the article for selling', () => {
    //     return ChainList.deployed()
    //             .then((instance) => {
    //                 chainListInstance = instance;
    //                 return instance.sellArticle(name, desc, web3.toWei(price, 'ether'), {from: seller})
    //             })
    //             .then(() => {
    //                 return chainListInstance.getArticle()
    //             })
    //             .then((article) => {
    //                 assert.equal(article[0], seller, 'seller should be ' + seller);
    //                 assert.equal(article[1], 0x0, 'buyer should be 0x0');
    //                 assert.equal(article[2], name, 'name should be ' + name);
    //                 assert.equal(article[3], desc, 'description should be ' + desc);
    //                 assert.equal(web3.fromWei(article[4], 'ether'), price, 'price should be ' + price);
    //             })
    // });

    // it('should buy an article', () => {
    //     return ChainList.deployed()
    //         .then((instance) => {
    //             chainListInstance = instance;
    //             sellerEtherBeforeBuy = utils.account.getEtherByAccount(seller);
    //             buyerEtherBeforeBuy = utils.account.getEtherByAccount(buyer);
    //             return chainListInstance.buyArticle({from: buyer, value: web3.toWei(price, 'ether')});
    //         })
    //         .then((data) => {
    //             const log = data.logs[0];
    //             sellerEtherAfterBuy = utils.account.getEtherByAccount(seller);
    //             buyerEtherAfterBuy = utils.account.getEtherByAccount(buyer);

    //             assert.equal(data.logs.length, 1, 'buy a article should emit a event.');
    //             assert.equal(log.event, 'LogBuyArticle', 'event should be LogBuyArticle');
    //             assert.equal(log.args._seller, seller, 'the seller should be ' + seller);
    //             assert.equal(log.args._buyer, buyer, 'the buyer should be ' + buyer);
    //             assert.equal(log.args._name, name, 'the name should be ' + name);
    //             assert.equal(web3.fromWei(log.args._price, 'ether'), price, 'the pirce in eth should be ' + price);
    //             assert(sellerEtherAfterBuy - sellerEtherBeforeBuy == price, `seller should increase the Ether with ${price}`);
    //             assert(buyerEtherBeforeBuy - buyerEtherAfterBuy <= price, `buyer should decrease the Ether with ${price}`);
    //             return chainListInstance.getArticle();
    //         })
    //         .then((article) => {
    //             assert.equal(article[0], seller, 'seller should be ' + seller);
    //             assert.equal(article[1], buyer, `buyer should be ${buyer}`);
    //             assert.equal(article[2], name, 'name should be ' + name);
    //             assert.equal(article[3], desc, 'description should be ' + desc);
    //             assert.equal(web3.fromWei(article[4], 'ether'), price, 'price should be ' + price);
    //         })
    // });

    // it('should trigger an event when a new article is sold', () => {
    //     return ChainList.deployed()
    //         .then((ins) => {
    //             chainListInstance = ins;
    //             return chainListInstance.sellArticle(name, desc, web3.toWei(price, 'ether'), {from: seller});
    //         })
    //         .then((data) => {
    //             const log = data.logs[0];
    //             assert.equal(data.logs.length, 1, 'sell a article should emit a event.');
    //             assert.equal(log.event, 'LogSellArticle', 'event should be LogSellArticle');
    //             assert.equal(log.args._seller, seller, 'the seller should be ' + seller);
    //             assert.equal(log.args._name, name, 'the name should be ' + name);
    //             assert.equal(log.args._description, desc, 'the desc should be ' + desc);
    //             assert.equal(web3.fromWei(log.args._price, 'ether'), price, 'the pirce in eth should be ' + price);
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         })
    // })
});