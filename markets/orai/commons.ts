import {
  eOraiNetwork,
} from "../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers/constants";
import {
  ICommonConfiguration,
} from "../../helpers/types";
import {
  rateStrategyStableOne,
  rateStrategyStableTwo,
  rateStrategyVolatileOne,
} from "./rateStrategies";
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: "Orai Market",
  ATokenNamePrefix: "Orai",
  StableDebtTokenNamePrefix: "Orai",
  VariableDebtTokenNamePrefix: "Orai",
  SymbolPrefix: "orai",
  ProviderId: 1,
  OracleQuoteCurrencyAddress: ZERO_ADDRESS,
  OracleQuoteCurrency: "USD",
  OracleQuoteUnit: "18",
  WrappedNativeTokenSymbol: "WORAI",
  ChainlinkAggregator: {
    [eOraiNetwork.oraiMainnet]: {
    }
  },
  ReserveFactorTreasuryAddress: {
    [eOraiNetwork.oraiMainnet]: ZERO_ADDRESS,
  },
  ReservesConfig: {},
  IncentivesConfig: {
    enabled: {
      [eOraiNetwork.oraiMainnet]: false,
    },
    rewards: {
    },
    rewardsOracle: {
    },
    incentivesInput: {
    },
  },
  EModes: {
    StableEMode: {
      id: "1",
      ltv: "9700",
      liquidationThreshold: "9750",
      liquidationBonus: "10100",
      label: "Stablecoins",
      assets: ["USDT"],
    },
  },
  ParaswapRegistry: {
    [eOraiNetwork.oraiMainnet]: ZERO_ADDRESS,
  },
  FlashLoanPremiums: {
    total: 0.0005e4,
    protocol: 0.0004e4,
  },
  RateStrategies: {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
  },
};
