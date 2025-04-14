import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
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

if (network === "sapphireTestnet") {
  addressChainlinkAggregatorProxy = await deployments.get("WROSE-TestnetPriceAggregator-Sapphire");
  addressChainlinkEthUsdAggregatorProxy = await deployments.get("USDC-TestnetPriceAggregator-Sapphire");
}

if (network === "sapphireMainnet") {
  addressChainlinkAggregatorProxy = await deployments.get("WROSE-MainnetPriceAggregator-Sapphire");
  addressChainlinkEthUsdAggregatorProxy = await deployments.get("USDC-MainnetPriceAggregator-Sapphire");
}

if (network === "oraiTestnet") {
  addressChainlinkAggregatorProxy = await deployments.get("WORAI-TestnetPriceAggregator-Orai");
  addressChainlinkEthUsdAggregatorProxy = await deployments.get("USDC-TestnetPriceAggregator-Orai");
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
