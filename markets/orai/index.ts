import {
    rateStrategyStableOne,
    rateStrategyStableTwo,
    rateStrategyVolatileOne,
  } from "./rateStrategies";
  import { ZERO_ADDRESS } from "../../helpers";
  import {
    IAaveConfiguration,
    eOraiNetwork,
  } from "../../helpers/types";
  
  import { CommonsConfig } from "./commons";
  import {
    strategyUSDC,
    strategyWORAI,
    strategyOCH,
  } from "./reservesConfigs";
  
  // ----------------
  // POOL--SPECIFIC PARAMS
  // ----------------
  
  export const OraiMarket: IAaveConfiguration = {
    ...CommonsConfig,
    MarketId: "Orai Market",
    ProviderId: 23295,
    // TestnetMarket: false,
    ReservesConfig: {
      USDC: strategyUSDC,
      WORAI: strategyWORAI,
      OCH: strategyOCH,
    },
    ReserveAssets: {
      [eOraiNetwork.oraiMainnet]: {
        USDC: "0x1947b853aD7bFc987D91DDB26fddEABC100C5070",
        WORAI: "0xAa6d857CD1b0f4A03d589a81F645AB0ac8cFe96e",
        OCH: "0x61f7D076c96cE02A2f4CE62bF190963Dc56C8F3a",
      },
    },
  };
  
  export default OraiMarket;
  