"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeDefaultCall = exports.encodeBuy = exports.encodeAtomicizedBuy = exports.encodeAtomicizedSell = exports.encodeSell = exports.encodeCall = exports.encodeReplacementPattern = void 0;
const bignumber_js_1 = require("bignumber.js");
const ethABI = __importStar(require("ethereumjs-abi"));
const wyvern_js_1 = require("wyvern-js");
const types_1 = require("./types");
const failWith = (msg) => {
    throw new Error(msg);
};
exports.encodeReplacementPattern = wyvern_js_1.WyvernProtocol.encodeReplacementPattern;
const encodeCall = (abi, parameters) => {
    const inputTypes = abi.inputs.map((i) => i.type);
    return '0x' + Buffer.concat([
        ethABI.methodID(abi.name, inputTypes),
        ethABI.rawEncode(inputTypes, parameters),
    ]).toString('hex');
};
exports.encodeCall = encodeCall;
const encodeSell = (schema, asset, address) => {
    const transfer = schema.functions.transfer(asset);
    return {
        target: transfer.target,
        calldata: exports.encodeDefaultCall(transfer, address),
        replacementPattern: exports.encodeReplacementPattern(transfer),
    };
};
exports.encodeSell = encodeSell;
const encodeAtomicizedSell = (schema, assets, address, atomicizer) => {
    const transactions = assets.map(asset => {
        const { target, calldata } = exports.encodeSell(schema, asset, address);
        return {
            calldata,
            abi: schema.functions.transfer(asset),
            address: target,
            value: new bignumber_js_1.BigNumber(0),
        };
    });
    const atomicizedCalldata = atomicizer.atomicize.getABIEncodedTransactionData(transactions.map(t => t.address), transactions.map(t => t.value), transactions.map(t => new bignumber_js_1.BigNumber((t.calldata.length - 2) / 2)), // subtract 2 for '0x', divide by 2 for hex
    transactions.map(t => t.calldata).reduce((x, y) => x + y.slice(2)));
    const atomicizedReplacementPattern = wyvern_js_1.WyvernProtocol.encodeAtomicizedReplacementPattern(transactions.map(t => t.abi));
    return {
        calldata: atomicizedCalldata,
        replacementPattern: atomicizedReplacementPattern,
    };
};
exports.encodeAtomicizedSell = encodeAtomicizedSell;
const encodeAtomicizedBuy = (schema, assets, address, atomicizer) => {
    const transactions = assets.map(asset => {
        const { target, calldata } = exports.encodeBuy(schema, asset, address);
        return {
            calldata,
            abi: schema.functions.transfer(asset),
            address: target,
            value: new bignumber_js_1.BigNumber(0),
        };
    });
    const atomicizedCalldata = atomicizer.atomicize.getABIEncodedTransactionData(transactions.map(t => t.address), transactions.map(t => t.value), transactions.map(t => new bignumber_js_1.BigNumber((t.calldata.length - 2) / 2)), // subtract 2 for '0x', divide by 2 for hex
    transactions.map(t => t.calldata).reduce((x, y) => x + y.slice(2)));
    const atomicizedReplacementPattern = wyvern_js_1.WyvernProtocol.encodeAtomicizedReplacementPattern(transactions.map(t => t.abi), types_1.FunctionInputKind.Owner);
    return {
        calldata: atomicizedCalldata,
        replacementPattern: atomicizedReplacementPattern,
    };
};
exports.encodeAtomicizedBuy = encodeAtomicizedBuy;
const encodeBuy = (schema, asset, address) => {
    const transfer = schema.functions.transfer(asset);
    const replaceables = transfer.inputs.filter((i) => i.kind === types_1.FunctionInputKind.Replaceable);
    const ownerInputs = transfer.inputs.filter((i) => i.kind === types_1.FunctionInputKind.Owner);
    // Validate
    if (replaceables.length !== 1) {
        failWith('Only 1 input can match transfer destination, but instead ' + replaceables.length + ' did');
    }
    // Compute calldata
    const parameters = transfer.inputs.map((input) => {
        switch (input.kind) {
            case types_1.FunctionInputKind.Replaceable:
                return address;
            case types_1.FunctionInputKind.Owner:
                return wyvern_js_1.WyvernProtocol.generateDefaultValue(input.type);
            default:
                return input.value.toString();
        }
    });
    const calldata = exports.encodeCall(transfer, parameters);
    // Compute replacement pattern
    let replacementPattern = '0x';
    if (ownerInputs.length > 0) {
        replacementPattern = exports.encodeReplacementPattern(transfer, types_1.FunctionInputKind.Owner);
    }
    return {
        target: transfer.target,
        calldata,
        replacementPattern,
    };
};
exports.encodeBuy = encodeBuy;
const encodeDefaultCall = (abi, address) => {
    const parameters = abi.inputs.map((input) => {
        switch (input.kind) {
            case types_1.FunctionInputKind.Replaceable:
                return wyvern_js_1.WyvernProtocol.generateDefaultValue(input.type);
            case types_1.FunctionInputKind.Owner:
                return address;
            case types_1.FunctionInputKind.Asset:
            default:
                return input.value;
        }
    });
    return exports.encodeCall(abi, parameters);
};
exports.encodeDefaultCall = encodeDefaultCall;
//# sourceMappingURL=schemaFunctions.js.map