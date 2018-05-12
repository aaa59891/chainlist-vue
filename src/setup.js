import contract from 'truffle-contract'
import ChainListAbstract from '../build/contracts/ChainList.json'
import Web3 from 'web3'

export const getProvider = () => {
    if (typeof web3 !== 'undefined') {
        return web3.currentProvider;
    } else {
        return new Web3.providers.HttpProvider('http://localhost:7545');
    }
}

export const getChainListInstance = () => {
    const contractTemp = contract(ChainListAbstract);
    contractTemp.setProvider(getProvider());
    return new Promise((resolve, reject) => {
        contractTemp.deployed()
            .then((ins) => {
                resolve(ins)
            })
            .catch(reject)
    });
}
