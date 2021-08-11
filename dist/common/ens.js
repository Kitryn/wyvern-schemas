"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENSNameBaseSchema = exports.nodehash = exports.namehash = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const namehash = (name) => {
    let node = '0000000000000000000000000000000000000000000000000000000000000000';
    if (name !== '') {
        const labels = name.split('.');
        for (let i = labels.length - 1; i >= 0; i--) {
            // I'm not convinced this is necessary but this will match the behaviour from original repo
            const labelHash = ethereumjs_util_1.isHexString(labels[i]) ? ethereumjs_util_1.keccakFromHexString(labels[i]).toString('hex') : ethereumjs_util_1.keccakFromString(labels[i]).toString('hex');
            node = ethereumjs_util_1.keccak(Buffer.from(node + labelHash, 'hex')).toString('hex');
        }
    }
    return '0x' + node.toString();
};
exports.namehash = namehash;
const nodehash = (name) => {
    const label = name.split('.')[0];
    if (label) {
        return '0x' + ethereumjs_util_1.keccakFromString(label).toString('hex');
    }
    else {
        return '';
    }
};
exports.nodehash = nodehash;
exports.ENSNameBaseSchema = {
    fields: [
        { name: 'Name', type: 'string', description: 'ENS Name' },
        {
            name: 'NodeHash',
            type: 'bytes32',
            description: 'ENS Node Hash',
            readOnly: true,
        },
        {
            name: 'NameHash',
            type: 'bytes32',
            description: 'ENS Name Hash',
            readOnly: true,
        },
    ],
    assetFromFields: (fields) => ({
        id: fields.ID,
        address: fields.Address,
        name: fields.Name,
        nodeHash: exports.nodehash(fields.Name),
        nameHash: exports.namehash(fields.Name),
    }),
    checkAsset: (asset) => {
        return asset.name
            ? exports.namehash(asset.name) === asset.nameHash &&
                exports.nodehash(asset.name) === asset.nodeHash
            : true;
    },
    hash: ({ nodeHash }) => nodeHash,
};
//# sourceMappingURL=ens.js.map