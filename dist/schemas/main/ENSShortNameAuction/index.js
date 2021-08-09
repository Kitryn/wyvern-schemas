"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENSShortNameAuctionSchema = exports.ENS_SHORT_NAME_AUCTION_ADDRESS = void 0;
const ethereum_types_1 = require("ethereum-types");
const ens_1 = require("../../../common/ens");
const types_1 = require("../../../types");
exports.ENS_SHORT_NAME_AUCTION_ADDRESS = '0x699c7f511c9e2182e89f29b3bfb68bd327919d17';
exports.ENSShortNameAuctionSchema = Object.assign(Object.assign({}, ens_1.ENSNameBaseSchema), { version: 0, deploymentBlock: 8488908, name: 'ENSShortNameAuction', description: 'ERC721 ENS short (3-6 character) names sold via auction.', thumbnail: '', website: 'https://ens.domains/', formatter: ({ name }) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            title: 'ENS Short Name: ' + name,
            description: '',
            url: '',
            thumbnail: '',
            properties: [],
        };
    }), functions: {
        transfer: ({ name }) => ({
            type: ethereum_types_1.AbiType.Function,
            name: 'register',
            payable: false,
            constant: false,
            stateMutability: types_1.StateMutability.Nonpayable,
            target: exports.ENS_SHORT_NAME_AUCTION_ADDRESS,
            inputs: [
                {
                    kind: types_1.FunctionInputKind.Data,
                    name: 'name',
                    type: 'string',
                    value: name.split('.')[0],
                },
                { kind: types_1.FunctionInputKind.Replaceable, name: 'owner', type: 'address' },
            ],
            outputs: [],
        }),
        assetsOfOwnerByIndex: [],
    }, events: {
        transfer: [
            {
                type: ethereum_types_1.AbiType.Event,
                name: 'NameRegistered',
                target: exports.ENS_SHORT_NAME_AUCTION_ADDRESS,
                anonymous: false,
                inputs: [
                    {
                        kind: types_1.EventInputKind.Asset,
                        indexed: false,
                        name: 'name',
                        type: 'string',
                    },
                    {
                        kind: types_1.EventInputKind.Destination,
                        indexed: false,
                        name: 'owner',
                        type: 'address',
                    },
                ],
                assetFromInputs: (inputs) => __awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        name: inputs.name,
                        nodeHash: ens_1.nodehash(inputs.name),
                        nameHash: ens_1.namehash(inputs.name),
                    });
                }),
            },
        ],
    } });
//# sourceMappingURL=index.js.map