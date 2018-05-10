const ChainList = artifacts.require('./ChainList.sol');
const utils = require('./utils.js');

contract('ChainList exceptions', (accounts) => {
    let chainListInstance;
    let seller = accounts[1];
    let buyer = accounts[2];
    const name = 'article';
    const desc = 'desc';
    const price = 10;

    it('should throw an exception when trying to buy an article and there is no article for sale', () => {
        return ChainList.deployed()
            .then((instance) => {
                chainListInstance = instance;
                return chainListInstance.buyArticle({from: buyer, value: web3.toWei(price, 'ether')})
            })
            .then(assert.fail)
            .catch((err) => {
                assert(true);
                return chainListInstance.getArticle()
            })
            .then((article) => {
                assert.equal(article[0], 0x0, 'seller should be empty');
                assert.equal(article[1], 0x0, 'buyer should be empty');
                assert.equal(article[2], '', 'name should be empty');
                assert.equal(article[3], '', 'description should be empty');
                assert.equal(article[4].toNumber(), 0, 'price should be zero');
            })
    });

    it('should throw an exception when you buy your article', () => {
        return ChainList.deployed()
            .then((ins) => {
                chainListInstance = ins;
                return chainListInstance.sellArticle(name, desc, web3.toWei(price, 'ether'), {from: seller});
            })
            .then(() => {
                return chainListInstance.buyArticle({from: seller, value: web3.toWei(price, 'ether')});
            })
            .then(assert.fail)
            .catch((err) => {
                assert(true);
                return chainListInstance.getArticle();
            })
            .then((article) => {
                assert.equal(article[0], seller, `seller should be ${seller}`);
                assert.equal(article[1], 0x0, 'buyer should be empty');
                assert.equal(article[2], name, `name should be ${name}`);
                assert.equal(article[3], desc, `description should be ${desc}`);
                assert.equal(utils.currency.getEtherFromWei(article[4]), price, `price should be ${price}`);
            });
    });

    it('should throw an exception when you buy an article with wrong price', () => {
        return ChainList.deployed()
            .then((ins) => {
                chainListInstance = ins;
                return chainListInstance.buyArticle({from: buyer, value: web3.toWei(price - 1, 'ether')})
            })
            .then(assert.fail)
            .catch(() => {
                assert(true);
                return chainListInstance.getArticle();
            })
            .then((article) => {
                assert.equal(article[0], seller, `seller should be ${seller}`);
                assert.equal(article[1], 0x0, 'buyer should be empty');
                assert.equal(article[2], name, `name should be ${name}`);
                assert.equal(article[3], desc, `description should be ${desc}`);
                assert.equal(utils.currency.getEtherFromWei(article[4]), price, `price should be ${price}`);
            })
    });

    it('should throw an exception when you buy an article which has already been sold out', () => {
        const buyObj = {from: buyer, value: web3.toWei(price, 'ether')};
        return ChainList.deployed()
            .then((ins) => {
                chainListInstance = ins;
                return chainListInstance.buyArticle(buyObj);
            })
            .then(() => chainListInstance.buyArticle(buyObj))
            .then(assert.fail)
            .catch(() => {
                assert(true);
                return chainListInstance.getArticle()
            })
            .then((article) => {
                assert.equal(article[0], seller, `seller should be ${seller}`);
                assert.equal(article[1], buyer, `buyer should be ${buyer}`);
                assert.equal(article[2], name, `name should be ${name}`);
                assert.equal(article[3], desc, `description should be ${desc}`);
                assert.equal(utils.currency.getEtherFromWei(article[4]), price, `price should be ${price}`);
            })
    })
});