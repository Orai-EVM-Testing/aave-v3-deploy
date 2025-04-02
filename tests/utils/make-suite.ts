import {
  ConfigNames,
  isTestnetMarket,
  loadPoolConfig,
} from "./../../helpers/market-config-helpers";
import { Signer } from "ethers";
import { evmRevert, evmSnapshot } from "../../helpers/utilities/tx";
import { tEthereumAddress } from "../../helpers/types";
import { MintableERC20, Pool, WalletBalanceProvider } from "../../typechain";
import { AaveProtocolDataProvider } from "../../typechain";
import { AToken } from "../../typechain";
import { PoolConfigurator } from "../../typechain";

import chai from "chai";
import { PoolAddressesProvider } from "../../typechain";
import { PoolAddressesProviderRegistry } from "../../typechain";
import {
  AaveOracle,
  IERC20,
  StableDebtToken,
  VariableDebtToken,
  WETH9,
  WrappedTokenGatewayV3,
  Faucet,
  UiPoolDataProviderV3,
} from "../../typechain";
import {
  ORACLE_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_CONFIGURATOR_PROXY_ID,
  POOL_DATA_PROVIDER,
  POOL_PROXY_ID,
} from "../../helpers/deploy-ids";
import {
  getAToken,
  getERC20,
  getFaucet,
  getStableDebtToken,
  getVariableDebtToken,
  getWETH,
} from "../../helpers/contract-getters";

import { ethers, deployments } from "hardhat";
import { getEthersSigners } from "../../helpers/utilities/signer";
import { MARKET_NAME } from "../../helpers/env";
import { ERC20Mintable } from "../../typechain/contracts";

export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}
export interface TestEnv {
  deployer: SignerWithAddress;
  poolAdmin: SignerWithAddress;
  emergencyAdmin: SignerWithAddress;
  riskAdmin: SignerWithAddress;
  users: SignerWithAddress[];
  pool: Pool;
  configurator: PoolConfigurator;
  oracle: AaveOracle;
  helpersContract: AaveProtocolDataProvider;
  // weth: WETH9;
  // aWETH: AToken;
  // dai: IERC20;
  // aDai: AToken;
  // variableDebtDai: VariableDebtToken;
  // stableDebtDai: StableDebtToken;
  // aUsdc: AToken;
  // usdc: IERC20;
  // aave: IERC20;
  wrose: WETH9;
  aWrose: AToken;
  usdc: ERC20Mintable;
  aUsdc: AToken;
  variableDebtUsdc: VariableDebtToken;
  addressesProvider: PoolAddressesProvider;
  registry: PoolAddressesProviderRegistry;
  wrappedTokenGateway: WrappedTokenGatewayV3;
  faucetOwnable: Faucet;
  uiPoolDataProvider: UiPoolDataProviderV3;
  walletBalanceProvider: WalletBalanceProvider;
}

let HardhatSnapshotId: string = "0x1";
const setHardhatSnapshotId = (id: string) => {
  HardhatSnapshotId = id;
};

const testEnv: TestEnv = {
  deployer: {} as SignerWithAddress,
  poolAdmin: {} as SignerWithAddress,
  emergencyAdmin: {} as SignerWithAddress,
  riskAdmin: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
  pool: {} as Pool,
  configurator: {} as PoolConfigurator,
  helpersContract: {} as AaveProtocolDataProvider,
  oracle: {} as AaveOracle,
  // weth: {} as WETH9,
  // aWETH: {} as AToken,
  // dai: {} as IERC20,
  // aDai: {} as AToken,
  // variableDebtDai: {} as VariableDebtToken,
  // stableDebtDai: {} as StableDebtToken,
  // aUsdc: {} as AToken,
  // usdc: {} as IERC20,
  // aave: {} as IERC20,
  wrose: {} as WETH9,
  aWrose: {} as AToken,
  variableDebtUsdc: {} as VariableDebtToken,
  addressesProvider: {} as PoolAddressesProvider,
  registry: {} as PoolAddressesProviderRegistry,
  wrappedTokenGateway: {} as WrappedTokenGatewayV3,
  faucetOwnable: {} as Faucet,
  uiPoolDataProvider: {} as UiPoolDataProviderV3,
  walletBalanceProvider: {} as WalletBalanceProvider,
} as TestEnv;

export async function initializeMakeSuite() {
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const accounts = await ethers.getSigners();
  const deployer: SignerWithAddress = {
    address: await accounts[0].getAddress(),
    signer: accounts[0],
  };

  for (const signer of accounts) {
    testEnv.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }
  const wrappedTokenGatewayArtifact = await deployments.get(
    "WrappedTokenGatewayV3"
  );
  const poolArtifact = await deployments.get(POOL_PROXY_ID);
  const configuratorArtifact = await deployments.get(
    POOL_CONFIGURATOR_PROXY_ID
  );
  const addressesProviderArtifact = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );
  const addressesProviderRegistryArtifact = await deployments.get(
    "PoolAddressesProviderRegistry"
  );
  const priceOracleArtifact = await deployments.get(ORACLE_ID);
  const dataProviderArtifact = await deployments.get(POOL_DATA_PROVIDER);
  const uiPoolDataProviderArtifact = await deployments.get("UiPoolDataProviderV3");
  const walletBalanceProviderArtifact = await deployments.get("WalletBalanceProvider");

  testEnv.deployer = deployer;
  testEnv.poolAdmin = deployer;
  testEnv.emergencyAdmin = testEnv.users[1];
  testEnv.riskAdmin = testEnv.users[2];
  testEnv.wrappedTokenGateway = (await ethers.getContractAt(
    "WrappedTokenGatewayV3",
    wrappedTokenGatewayArtifact.address
  )) as WrappedTokenGatewayV3;
  testEnv.pool = (await ethers.getContractAt(
    "Pool",
    poolArtifact.address
  )) as Pool;
  testEnv.configurator = (await ethers.getContractAt(
    "PoolConfigurator",
    configuratorArtifact.address
  )) as PoolConfigurator;

  testEnv.addressesProvider = (await ethers.getContractAt(
    "PoolAddressesProvider",
    addressesProviderArtifact.address
  )) as PoolAddressesProvider;
  testEnv.registry = (await ethers.getContractAt(
    "PoolAddressesProviderRegistry",
    addressesProviderRegistryArtifact.address
  )) as PoolAddressesProviderRegistry;
  testEnv.oracle = (await ethers.getContractAt(
    "AaveOracle",
    priceOracleArtifact.address
  )) as AaveOracle;
  testEnv.helpersContract = (await ethers.getContractAt(
    dataProviderArtifact.abi,
    dataProviderArtifact.address
  )) as AaveProtocolDataProvider;

  testEnv.uiPoolDataProvider = (await ethers.getContractAt(
    "UiPoolDataProviderV3",
    uiPoolDataProviderArtifact.address
  )) as UiPoolDataProviderV3;

  testEnv.walletBalanceProvider = (await ethers.getContractAt(
    "WalletBalanceProvider",
    walletBalanceProviderArtifact.address
  )) as WalletBalanceProvider;

  const allTokens = await testEnv.helpersContract.getAllATokens();
  console.log(allTokens);
  // const aDaiAddress = allTokens.find(
  //   (aToken) => aToken.symbol === "aEthDAI"
  // )?.tokenAddress;
  // const aUsdcAddress = allTokens.find(
  //   (aToken) => aToken.symbol === "aEthUSDC"
  // )?.tokenAddress;

  // const aWEthAddress = allTokens.find(
  //   (aToken) => aToken.symbol === "aEthWETH"
  // )?.tokenAddress;
  const reservesTokens = await testEnv.helpersContract.getAllReservesTokens();
  console.log(reservesTokens);

  // const daiAddress = reservesTokens.find(
  //   (token) => token.symbol === "DAI"
  // )?.tokenAddress;
  // const {
  //   variableDebtTokenAddress: variableDebtDaiAddress,
  //   stableDebtTokenAddress: stableDebtDaiAddress,
  // } = await testEnv.helpersContract.getReserveTokensAddresses(daiAddress || "");
  // const usdcAddress = reservesTokens.find(
  //   (token) => token.symbol === "USDC"
  // )?.tokenAddress;
  // const aaveAddress = reservesTokens.find(
  //   (token) => token.symbol === "AAVE"
  // )?.tokenAddress;
  // const wethAddress = reservesTokens.find(
  //   (token) => token.symbol === "WETH"
  // )?.tokenAddress;

  // if (!aDaiAddress || !aWEthAddress || !aUsdcAddress) {
  //   process.exit(1);
  // }
  // if (!daiAddress || !usdcAddress || !aaveAddress || !wethAddress) {
  //   process.exit(1);
  // }


  const aUsdcAddress = allTokens.find(
    (aToken) => aToken.symbol === "asapphireUSDC"
  )?.tokenAddress;

  const aWroseAddress = allTokens.find(
    (aToken) => aToken.symbol === "asapphireWROSE"
  )?.tokenAddress;
  
  const usdcAddress = reservesTokens.find(
    (token) => token.symbol === "USDC"
  )?.tokenAddress;

  const wroseAddress = reservesTokens.find(
    (token) => token.symbol === "wROSE"
  )?.tokenAddress;
  const {
    variableDebtTokenAddress: variableDebtUsdcAddress,
  } = await testEnv.helpersContract.getReserveTokensAddresses(usdcAddress || "");
  
  if (!aUsdcAddress || !aWroseAddress) {
    process.exit(1);
  }

  if (!usdcAddress || !wroseAddress) {
    process.exit(1);
  }
  console.log(1);
  // testEnv.aDai = await getAToken(aDaiAddress);
  // testEnv.variableDebtDai = await getVariableDebtToken(variableDebtDaiAddress);
  // testEnv.stableDebtDai = await getStableDebtToken(stableDebtDaiAddress);
  // testEnv.aUsdc = await getAToken(aUsdcAddress);
  // testEnv.aWETH = await getAToken(aWEthAddress);

  // testEnv.dai = await getERC20(daiAddress);
  // testEnv.usdc = await getERC20(usdcAddress);
  // testEnv.aave = await getERC20(aaveAddress);
  // testEnv.weth = await getWETH(wethAddress);

  testEnv.aUsdc = await getAToken(aUsdcAddress);
  testEnv.aWrose = await getAToken(aWroseAddress);
  testEnv.variableDebtUsdc = await getVariableDebtToken(variableDebtUsdcAddress);

  // testEnv.usdc = await getERC20(usdcAddress);
  testEnv.usdc = (await ethers.getContractAt(
    "ERC20Mintable",
    usdcAddress
  )) as ERC20Mintable;
  testEnv.wrose = await getWETH(wroseAddress);


  if (isTestnetMarket(poolConfig)) {
    testEnv.faucetOwnable = await getFaucet();
  }
}
const setSnapshot = async () => {
  setHardhatSnapshotId(await evmSnapshot());
};

const revertHead = async () => {
  await evmRevert(HardhatSnapshotId);
};

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    // before(async () => {
    //   await setSnapshot();
    // });
    tests(testEnv);
    // after(async () => {
    //   await revertHead();
    // });
  });
}

