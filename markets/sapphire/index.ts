import {
  rateStrategyStableOne,
  rateStrategyStableTwo,
  rateStrategyVolatileOne,
} from "./rateStrategies";
import { ZERO_ADDRESS } from "../../helpers";
import {
  IAaveConfiguration,
  eOasisNetwork,
} from "../../helpers/types";

import { CommonsConfig } from "./commons";
import {
  strategystROSE,
  strategyUSDC,
  strategyUSDT,
  strategyWROSE,
} from "./reservesConfigs";

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const SapphireMarket: IAaveConfiguration = {
  ...CommonsConfig,
  MarketId: "Sapphire Market",
  TestnetMarket: false,
  ProviderId: 23295,
  ReservesConfig: {
    USDC: strategyUSDC,
    USDT: strategyUSDT,
    WROSE: strategyWROSE,
    stROSE: strategystROSE,
  },
  ReserveAssets: {
    [eOasisNetwork.sapphireTestnet]: {
      USDC: "0x01D969e5de0534624C11D0452eB07a20596A54E2",
      USDT: "0x47f65a2Bc9C23587102aB3Ba65772e5481406237",
      WROSE: "0xB759a0fbc1dA517aF257D5Cf039aB4D86dFB3b94",
      stROSE: "0xf001eb69fd0b4060db7397d70ec2edcd5d89cb27",
    },
  },
};

export default SapphireMarket;