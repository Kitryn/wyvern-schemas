import { describe, it } from "mocha";
import { assert } from "chai";
import { schemas } from "../dist/index.js";
import { ethers } from "ethers";
const { INFURA_API_KEY } = process.env;
if (!INFURA_API_KEY) {
    throw new Error("Need to set INFURA_API_KEY");
}

// const rpcUrl = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
const provider = new ethers.providers.InfuraProvider(
    "homestead",
    INFURA_API_KEY
);

schemas.main.map((schema) => {
    describe(schema.name, () => {
        it("should have a unique name", () => {
            const matching = schemas.main.filter((s) => s.name === schema.name);
            assert.equal(
                matching.length,
                1,
                "Schema name " + schema.name + " is not unique"
            );
        });

        const transfer = schema.events.transfer[0];
        if (transfer) {
            const transferContract = new ethers.Contract(
                transfer.target,
                [transfer],
                provider
            );
            // const transferContract = web3.eth
            //     .contract([transfer])
            //     .at(transfer.target);
            it("should have some transfer events", async () => {
                const fromBlock = schema.deploymentBlock + 23000;
                const toBlock = fromBlock + 500;
                const filter = transferContract.filters[transfer.name]();
                const events = await transferContract.queryFilter(
                    filter,
                    fromBlock,
                    toBlock
                );

                console.log(
                    events.length +
                        " transfer events for schema " +
                        schema.name +
                        " in a sample of 500 blocks"
                );
                assert.equal(
                    events.length > 0,
                    true,
                    "No transfer events found in first 10000 blocks"
                );
            });
        }
    });
});
