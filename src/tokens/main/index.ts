import {
  NetworkTokens,
} from '../../types';

export const mainTokens: NetworkTokens = {
  canonicalWrappedEther: {name: 'Canonical Wrapped Ether', symbol: 'WETH', decimals: 18, address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'},
  otherTokens: [
    {name: 'Decentraland', symbol: 'MANA', decimals: 18, address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942'},
  ],
}; // tslint:disable:max-file-line-count