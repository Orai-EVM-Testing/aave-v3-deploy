import {
  eOasisNetwork,
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
  MarketId: "Sapphire Market",
  ATokenNamePrefix: "Sapphire",
  StableDebtTokenNamePrefix: "Sapphire",
  VariableDebtTokenNamePrefix: "Sapphire",
  SymbolPrefix: "sapphire",
  ProviderId: 1,
  OracleQuoteCurrencyAddress: ZERO_ADDRESS,
  OracleQuoteCurrency: "USD",
  OracleQuoteUnit: "18",
  WrappedNativeTokenSymbol: "WROSE",
  ChainlinkAggregator: {
    [eOasisNetwork.sapphireTestnet]: {
      
    }
  },
  ReserveFactorTreasuryAddress: {
    [eOasisNetwork.sapphireTestnet]: ZERO_ADDRESS,
  },
  ReservesConfig: {},
  IncentivesConfig: {
    enabled: {
      [eOasisNetwork.sapphireTestnet]: false,
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
      assets: ["USDC"],
    },
  },
  ParaswapRegistry: {
    [eOasisNetwork.sapphireTestnet]: ZERO_ADDRESS,
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
