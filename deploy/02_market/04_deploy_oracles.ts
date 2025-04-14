import { chainlinkAggregatorProxy } from './../../helpers/constants';
import { getChainlinkOracles } from "../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { V3_CORE_VERSION, ZERO_ADDRESS } from "../../helpers/constants";
import {
  FALLBACK_ORACLE_ID,
  MAINNET_PRICE_AGGR_PREFIX,
  ORACLE_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  TESTNET_PRICE_AGGR_PREFIX,
} from "../../helpers/deploy-ids";
import {
  loadPoolConfig,
  ConfigNames,
  getParamPerNetwork,
  checkRequiredEnvironment,
  getReserveAddresses,
} from "../../helpers/market-config-helpers";
import { eNetwork, ICommonConfiguration, SymbolMap } from "../../helpers/types";
import { getPairsTokenAggregator } from "../../helpers/init-helpers";
import { parseUnits } from "ethers/lib/utils";
import { MARKET_NAME } from "../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  const { OracleQuoteUnit } = poolConfig as ICommonConfiguration;

  const { address: addressesProviderAddress } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  const fallbackOracleAddress = ZERO_ADDRESS;

  const reserveAssets = await getReserveAddresses(poolConfig, network);
  // const chainlinkAggregators = await getChainlinkOracles(poolConfig, network);

  let deployedAggregators;
  if (network === "oraiTestnet") {
    deployedAggregators = {
      WORAI: (await deployments.get(`WORAI-${TESTNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
      USDT: (await deployments.get(`USDT-${TESTNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
    }
  }

  if (network === "sapphireMainnet") {
    deployedAggregators = {
      USDC: (await deployments.get(`USDC-${MAINNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
      WROSE: (await deployments.get(`WROSE-${MAINNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
    }
  }

  if (network === "sapphireTestnet") {
    deployedAggregators = {
      USDC: (await deployments.get(`USDC-${TESTNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
      USDT: (await deployments.get(`USDT-${TESTNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
      WROSE: (await deployments.get(`WROSE-${TESTNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
      stROSE: (await deployments.get(`stROSE-${TESTNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
    }
  }

  if (network === "oraiMainnet") {
    deployedAggregators = {
      OCH: (await deployments.get(`OCH-${MAINNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
      WORAI: (await deployments.get(`WORAI-${MAINNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
      USDC: (await deployments.get(`USDC-${MAINNET_PRICE_AGGR_PREFIX}-${MARKET_NAME}`)).address,
    }
  }

  if (!deployedAggregators) {
    throw new Error("Deployed aggregators are undefined for the current network.");
  }
  const [assets, sources] = getPairsTokenAggregator(
    reserveAssets as { [tokenSymbol: string]: string },
    deployedAggregators //chainlinkAggregators
  );

  // Deploy AaveOracle
  await deploy(ORACLE_ID, {
    from: deployer,
    args: [
      addressesProviderAddress,
      assets,
      sources,
      fallbackOracleAddress,
      ZERO_ADDRESS,
      parseUnits("1", OracleQuoteUnit),
    ],
    ...COMMON_DEPLOY_PARAMS,
    contract: "AaveOracle",
  });

  return true;
};

func.id = `Oracles:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "oracle"];

func.dependencies = ["before-deploy"];

func.skip = async () => checkRequiredEnvironment();

export default func;
