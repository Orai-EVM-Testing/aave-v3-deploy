import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS, MARKET_NAME } from "../../helpers/env";
import {
  MAINNET_PRICE_AGGR_PREFIX,
TESTNET_PRICE_AGGR_PREFIX
} from "../../helpers/deploy-ids";
import {
chainlinkAggregatorProxy,
chainlinkEthUsdAggregatorProxy,
} from "../../helpers/constants";
import { eNetwork } from "../../helpers";

const func: DeployFunction = async function ({
getNamedAccounts,
deployments,
...hre
}: HardhatRuntimeEnvironment) {
const { deploy } = deployments;
const { deployer } = await getNamedAccounts();

const network = (
  process.env.FORK ? process.env.FORK : hre.network.name
) as eNetwork;

// if (!chainlinkAggregatorProxy[network]) {
//   console.log(
//     '[Deployments] Skipping the deployment of UiPoolDataProvider due missing constant "chainlinkAggregatorProxy" configuration at ./helpers/constants.ts'
//   );
//   return;
// }

let addressChainlinkAggregatorProxy, addressChainlinkEthUsdAggregatorProxy;

if (network === "sapphireTestnet" ) {
  addressChainlinkAggregatorProxy = (await deployments.get(`WROSE-${TESTNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address;
  addressChainlinkEthUsdAggregatorProxy = (await deployments.get(`USDC-${TESTNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address;
}

if (network === "sapphireMainnet") {
  addressChainlinkAggregatorProxy = (await deployments.get(`WROSE-${MAINNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address;
  addressChainlinkEthUsdAggregatorProxy = (await deployments.get(`USDC-${MAINNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address;
}

if (network === "oraiTestnet") {
  addressChainlinkAggregatorProxy = (await deployments.get(`WORAI-${TESTNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address;
  addressChainlinkEthUsdAggregatorProxy = (await deployments.get(`USDT-${TESTNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address;
}

if (network === "oraiMainnet") {
  addressChainlinkAggregatorProxy = (await deployments.get(`WORAI-${MAINNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address;
  addressChainlinkEthUsdAggregatorProxy = (await deployments.get(`usdc-${MAINNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address;
}

// Deploy UiIncentiveDataProvider getter helper
await deploy("UiIncentiveDataProviderV3", {
  from: deployer,
});

if (!addressChainlinkAggregatorProxy || !addressChainlinkEthUsdAggregatorProxy) {
  throw new Error("Missing addressChainlinkAggregatorProxy or addressChainlinkEthUsdAggregatorProxy");
}

// Deploy UiPoolDataProvider getter helper
await deploy("UiPoolDataProviderV3", {
  from: deployer,
  args: [
    addressChainlinkAggregatorProxy,
    addressChainlinkEthUsdAggregatorProxy,
  ],
  ...COMMON_DEPLOY_PARAMS,
});
};

func.tags = ["periphery-post", "ui-helpers"];

export default func;
