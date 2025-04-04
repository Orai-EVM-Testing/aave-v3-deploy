import { chainlinkAggregatorProxy } from './../../helpers/constants';
import { getChainlinkOracles } from "../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { V3_CORE_VERSION, ZERO_ADDRESS } from "../../helpers/constants";
import {
  FALLBACK_ORACLE_ID,
  ORACLE_ID,
  POOL_ADDRESSES_PROVIDER_ID,
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

  // const { address: USDTPriceAggregator} = await deployments.get("USDT-TestnetPriceAggregator-Sapphire");
  // const { address: USDCPriceAggregator} = await deployments.get("USDC-TestnetPriceAggregator-Sapphire");
  // const { address: WROSEPriceAggregator} = await deployments.get("WROSE-TestnetPriceAggregator-Sapphire");
  // const { address: stROSEPriceAggregator} = await deployments.get("stROSE-TestnetPriceAggregator-Sapphire");
  const { address: OCHPriceAggregator} = await deployments.get("OCH-TestnetPriceAggregator-Orai");
  const { address: WORAIPriceAggregator} = await deployments.get("WORAI-TestnetPriceAggregator-Orai");
  const { address: USDCPriceAggregator} = await deployments.get("USDC-TestnetPriceAggregator-Orai");

  const chainlinkAggregators = {
    OCH: OCHPriceAggregator,
    WORAI: WORAIPriceAggregator,
    USDC: USDCPriceAggregator,
    // USDT: USDTPriceAggregator,
    // USDC: USDCPriceAggregator,
    // WROSE: WROSEPriceAggregator,
    // stROSE: stROSEPriceAggregator,
  }
  const [assets, sources] = getPairsTokenAggregator(
    reserveAssets as { [tokenSymbol: string]: string },
    chainlinkAggregators
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
