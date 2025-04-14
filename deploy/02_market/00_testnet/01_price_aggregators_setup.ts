import { TESTNET_REWARD_TOKEN_PREFIX } from "./../../../helpers/deploy-ids";
import {
  getSymbolsByPrefix,
  isIncentivesEnabled,
} from "./../../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../../helpers/env";
import {
  checkRequiredEnvironment,
  ConfigNames,
  getReserveAddresses,
  isProductionMarket,
  loadPoolConfig,
} from "../../../helpers/market-config-helpers";
import { eNetwork } from "../../../helpers/types";
import { TESTNET_PRICE_AGGR_PREFIX, MAINNET_PRICE_AGGR_PREFIX } from "../../../helpers/deploy-ids";
import {
  MOCK_CHAINLINK_AGGREGATORS_PRICES,
  V3_CORE_VERSION,
} from "../../../helpers/constants";
import Bluebird from "bluebird";
import { MARKET_NAME } from "../../../helpers/env";

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

  // if (isProductionMarket(poolConfig)) {
  //   console.log("[NOTICE] Skipping deployment of testnet price aggregators");
  //   return;
  // }

  let priceOracleAddress;
  let contractToDeploy;
  let prefix;

  const reserves = await getReserveAddresses(poolConfig, network);
  const priceOracleAddress_sapphireTestnet = "0x2300221C0719748D6322F24444e938C8873eb200";
  const priceOracleAddress_sapphireMainnet = "0x26eEaD16064cF7F24c90Cceb4bFEB23E8e7ad4e4";
  const priceOracleAddress_oraiMainnet = "0xb0DfcC0Ee3a024dEB7753F49f1Cb0b0681489fda";
  const priceOracleAddress_oraiTestnet = "0x1947b853aD7bFc987D91DDB26fddEABC100C5070";

  switch (network) {
    case "oraiMainnet":
      priceOracleAddress = priceOracleAddress_oraiMainnet;
      contractToDeploy = "OraiPriceAggregator";
      prefix = MAINNET_PRICE_AGGR_PREFIX;
      break;
    case "sapphireTestnet":
      priceOracleAddress = priceOracleAddress_sapphireTestnet;
      contractToDeploy = "PriceAggregator";
      prefix = TESTNET_PRICE_AGGR_PREFIX;
      break;
    case "sapphireMainnet":
      priceOracleAddress = priceOracleAddress_sapphireMainnet;
      contractToDeploy = "PriceAggregator";
      prefix = MAINNET_PRICE_AGGR_PREFIX;
      break;
    case "oraiTestnet":
      priceOracleAddress = priceOracleAddress_oraiTestnet;
      contractToDeploy = "OraiPriceAggregator";
      prefix = TESTNET_PRICE_AGGR_PREFIX;
      break;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }

  let symbols = reserves ? Object.keys(reserves) : [];

  if (isIncentivesEnabled(poolConfig)) {
    const rewards = await getSymbolsByPrefix(TESTNET_REWARD_TOKEN_PREFIX);
    symbols = [...symbols, ...rewards];
  }

  // Iterate each token symbol and deploy a mock aggregator
  await Bluebird.each(symbols, async (symbol) => {
    // const price =
    //   symbol === "StkAave"
    //     ? MOCK_CHAINLINK_AGGREGATORS_PRICES["AAVE"]
    //     : MOCK_CHAINLINK_AGGREGATORS_PRICES[symbol];
    // if (!price) {
    //   throw `[ERROR] Missing mock price for asset ${symbol} at MOCK_CHAINLINK_AGGREGATORS_PRICES constant located at src/constants.ts`;
    // }
    if (reserves && reserves[symbol]) {
      await deploy(`${symbol}${prefix}`, {
        args: [priceOracleAddress, reserves[symbol]],
        from: deployer,
        ...COMMON_DEPLOY_PARAMS,
        contract: contractToDeploy,
      });
    }
  });

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `MockPriceAggregators:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "init-testnet", "price-aggregators-setup"];

func.dependencies = ["before-deploy", "tokens-setup", "periphery-pre"];

func.skip = async () => checkRequiredEnvironment();

export default func;
