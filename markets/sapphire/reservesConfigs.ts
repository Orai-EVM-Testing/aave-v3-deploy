import { eContractid, IReserveParams } from "../../helpers/types";

import {
  rateStrategyVolatileOne,
  rateStrategyStableOne,
  rateStrategyStableTwo,
} from "./rateStrategies";

export const strategyUSDC: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: "8000",
  liquidationThreshold: "8500",
  liquidationBonus: "10500",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: false,
  reserveDecimals: "6",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "2000000000",
  borrowCap: "500000000",
  debtCeiling: "0",
  borrowableIsolation: true,
};

export const strategyUSDT: IReserveParams = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: "8000",
  liquidationThreshold: "8500",
  liquidationBonus: "10500",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: false,
  reserveDecimals: "6",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "2000000000",
  borrowCap: "500000000",
  debtCeiling: "0",
  borrowableIsolation: true,
};

export const strategyWROSE = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: "8000",
  liquidationThreshold: "8250",
  liquidationBonus: "10500",
  liquidationProtocolFee: "1000",
  borrowingEnabled: false,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: false,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "2000000000",
  borrowCap: "500000000",
  debtCeiling: "0",
  borrowableIsolation: false,
};

export const strategystROSE = {
  strategy: rateStrategyVolatileOne,
  baseLTVAsCollateral: "8000",
  liquidationThreshold: "8250",
  liquidationBonus: "10500",
  liquidationProtocolFee: "1000",
  borrowingEnabled: false,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: false,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "2000000000",
  borrowCap: "500000000",
  debtCeiling: "0",
  borrowableIsolation: false,
};
