import { createPublicClient, http, hexToString } from "viem";
import { mainnet } from "viem/chains";
import { getERC20BytesContract, getERC20Contract } from "./utils";
import { createEffect, S } from "envio";

const RPC_URL = process.env.RPC_URL;

const client = createPublicClient({
  chain: mainnet,
  transport: http(RPC_URL, { batch: true }),
  batch: { multicall: true },
});

const metadataSchema = S.schema({
  name: S.string,
  symbol: S.string,
  decimals: S.number,
});

export const getTokenDetailsEffect = createEffect(
  {
    name: "getTokenDetails",
    input: {
      contractAddress: S.string,
      chainId: S.number,
      pool: S.string,
    },
    output: metadataSchema,
    rateLimit: false,
    cache: true,
  },
  async ({ input: { contractAddress, pool } }) => {
    const erc20 = getERC20Contract(contractAddress as `0x${string}`);
    const erc20Bytes = getERC20BytesContract(contractAddress as `0x${string}`);

    let results: [number, string, string];
    try {
      results = await client.multicall({
        allowFailure: false,
        contracts: [
          {
            ...erc20,
            functionName: "decimals",
          },
          {
            ...erc20,
            functionName: "name",
          },
          {
            ...erc20,
            functionName: "symbol",
          },
        ],
      });
    } catch (error) {
      console.log("First multicall failed, trying alternate method");
      try {
        const alternateResults = await client.multicall({
          allowFailure: false,
          contracts: [
            {
              ...erc20Bytes,
              functionName: "decimals",
            },
            {
              ...erc20Bytes,
              functionName: "name",
            },
            {
              ...erc20Bytes,
              functionName: "symbol",
            },
          ],
        });
        results = [
          alternateResults[0],
          hexToString(alternateResults[1]),
          hexToString(alternateResults[2]),
        ];
      } catch (alternateError) {
        console.error(`Alternate method failed for pool ${pool}:`);
        results = [0, "unknown", "unknown"];
      }
    }

    const [decimals, name, symbol] = results;

    if (decimals % 1 !== 0) {
      throw new Error("Decimals is not an integer");
    }
    if (decimals < 0 || decimals > 50) {
      throw new Error("Decimals is out of range");
    }

    return {
      name: name.replace(/\u0000/g, ""),
      symbol: symbol.replace(/\u0000/g, ""),
      decimals,
    };
  }
);
