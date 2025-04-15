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
import { eNetwork, getChainlinkOracles, isTestnetMarket, loadPoolConfig } from "../../helpers";

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

const poolConfig = loadPoolConfig(MARKET_NAME);

let addressChainlinkAggregatorProxy, addressChainlinkEthUsdAggregatorProxy;

if (isTestnetMarket(poolConfig)) {
  const deployedAggregators = await getChainlinkOracles(poolConfig, network);
  addressChainlinkAggregatorProxy = deployedAggregators["WORAI"];
  addressChainlinkEthUsdAggregatorProxy = deployedAggregators["USDT"]
}

if (network === "sapphireTestnet" ) {
  addressChainlinkAggregatorProxy = (await deployments.get(`WROSE${TESTNET_PRICE_AGGR_PREFIX}`)).address;
  addressChainlinkEthUsdAggregatorProxy = (await deployments.get(`USDC${TESTNET_PRICE_AGGR_PREFIX}`)).address;
}

if (network === "sapphireMainnet") {
  addressChainlinkAggregatorProxy = (await deployments.get(`WROSE${MAINNET_PRICE_AGGR_PREFIX}`)).address;
  addressChainlinkEthUsdAggregatorProxy = (await deployments.get(`USDC${MAINNET_PRICE_AGGR_PREFIX}`)).address;
}

if (network === "oraiTestnet") {
  addressChainlinkAggregatorProxy = (await deployments.get(`WORAI${TESTNET_PRICE_AGGR_PREFIX}`)).address;
  addressChainlinkEthUsdAggregatorProxy = (await deployments.get(`USDT${TESTNET_PRICE_AGGR_PREFIX}`)).address;
}

if (network === "oraiMainnet") {
  addressChainlinkAggregatorProxy = (await deployments.get(`WORAI${MAINNET_PRICE_AGGR_PREFIX}`)).address;
  addressChainlinkEthUsdAggregatorProxy = (await deployments.get(`USDC${MAINNET_PRICE_AGGR_PREFIX}`)).address;
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
