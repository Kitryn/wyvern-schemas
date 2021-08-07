import { Schema } from '../types';
import { keccak, keccakFromString, keccakFromHexString, isHexString } from 'ethereumjs-util';

export interface ENSName {
  nodeHash: string;
  nameHash: string;
  name: string;
}

export const namehash = (name: string) => {
  let node = '0000000000000000000000000000000000000000000000000000000000000000';
  if (name !== '') {
    const labels = name.split('.');
    for (let i = labels.length - 1; i >= 0; i--) {
      // I'm not convinced this is necessary but this will match the behaviour from original repo
      const labelHash = isHexString(labels[i]) ? keccakFromHexString(labels[i]).toString('hex') : keccakFromString(labels[i]).toString('hex');
      node = keccak(Buffer.from(node + labelHash, 'hex')).toString('hex');
    }
  }
  return '0x' + node.toString();
};

export const nodehash = (name: string) => {
  const label = name.split('.')[0];
  if (label) {
    return '0x' + keccakFromString(label).toString('hex');
  } else {
    return '';
  }
};

export const ENSNameBaseSchema: Required<
  Pick<
    Schema<ENSName>,
    'fields' | 'assetFromFields' | 'checkAsset' | 'hash'
  >
> = {
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
  assetFromFields: (fields: any) => ({
    id: fields.ID,
    address: fields.Address,
    name: fields.Name,
    nodeHash: nodehash(fields.Name),
    nameHash: namehash(fields.Name),
  }),
  checkAsset: (asset: ENSName) => {
    return asset.name
      ? namehash(asset.name) === asset.nameHash &&
          nodehash(asset.name) === asset.nodeHash
      : true;
  },
  hash: ({ nodeHash }) => nodeHash,
};
