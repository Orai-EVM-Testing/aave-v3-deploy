import { parseEther, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { makeSuite, TestEnv } from "../utils/make-suite";
import { increaseTime, parseUnitsFromToken, waitForTx } from "../../helpers/utilities/tx";
import { MAX_UINT_AMOUNT } from "../../helpers/constants";
import { ethers, network } from "hardhat";
import { use } from "chai";

const { expect } = require("chai");

makeSuite("Mainnet Check list", (testEnv: TestEnv) => {
  const zero = BigNumber.from("0");

  // it("Check price", async () => {
  //   const { wrose, usdc, oracle } = testEnv;

  //   const priceWrose = await oracle.getAssetPrice(wrose.address);
  //   const priceUsdc = await oracle.getAssetPrice(usdc.address);
  //   console.log("priceWrose", priceWrose.toString());
  //   console.log("priceUsdc", priceUsdc.toString());
  //   expect(priceWrose).to.be.equal(parseUnits("0.041", 18));
  //   expect(priceUsdc).to.be.equal(parseUnits("1", 18));
  // });

  // it("Supply Wrose", async () => {
  //   const { users, wrappedTokenGateway, aWrose, pool} = testEnv;

  //   const user = users[0];

  //   const depositSize = parseEther("1");

  //   // Deposit with native ETH 
  //   await wrappedTokenGateway
  //     .connect(user.signer)
  //     .depositETH(pool.address, user.address, "0", { value: depositSize });

  //   const aTokensBalance = await aWrose.balanceOf(user.address);
  //   expect(aTokensBalance).to.be.equal(depositSize);

  //   console.log("aTokensBalance", aTokensBalance.toString());
  // });

  // it("Supply USDC", async () => {
  //   const { users, usdc, aUsdc, pool, faucetOwnable } = testEnv;

  //   console.log(pool.address);

  //   const user = users[0];
  //   const user2 = users[1];
  //   const depositSize = await parseUnitsFromToken(usdc.address, "10");

  //   //user 1 supply 100 USDC
  //   await waitForTx(
  //     await usdc.connect(user.signer).approve(pool.address, MAX_UINT_AMOUNT)
  //   )
  //   await waitForTx(
  //     await pool.connect(user.signer).supply(usdc.address, depositSize, user.address, "0")
  //   )
    
  //   // user 2 supply 100 USDC
  //   await waitForTx(
  //     await usdc.connect(user2.signer).approve(pool.address, MAX_UINT_AMOUNT)
  //   )
  //   await waitForTx(
  //     await pool.connect(user2.signer).supply(usdc.address, depositSize, user2.address, "0")
  //   )  

  //   const aTokensBalance = await aUsdc.balanceOf(user.address);
  //   // expect(aTokensBalance).to.be.equal(depositSize);

  //   console.log("aTokensBalance", aTokensBalance.toString());
  // });

  // it("disable as collateral", async () => { 
  //   const { users, wrose, pool, uiPoolDataProvider, addressesProvider } = testEnv;

  //   const user = users[1];
  //   let userAccountData = await pool.getUserAccountData(user.address);
  //   const totalCollateralBaseBefore = userAccountData.totalCollateralBase;
  //   await waitForTx(
  //     await pool.connect(user.signer).setUserUseReserveAsCollateral(wrose.address, false)
  //   );

  //   const reservesData = await uiPoolDataProvider.getUserReservesData(addressesProvider.address, user.address);
  //   for(const reserveData of reservesData[0]) {
  //     if(reserveData.underlyingAsset === wrose.address) {
  //       expect(reserveData.usageAsCollateralEnabledOnUser).to.be.equal(false);
  //     }
  //   }

  //   userAccountData = await pool.getUserAccountData(user.address);
  //   const totalCollateralBaseAfter = userAccountData.totalCollateralBase;
  //   expect(totalCollateralBaseAfter).to.be.equal(parseUnits("100", 18));
  //   console.log("totalCollateralBaseBefore", totalCollateralBaseBefore.toString());
  //   console.log("totalCollateralBaseAfter", totalCollateralBaseAfter.toString());
  // });

  // it("enable as collateral", async () => {
  //   const { users, wrose, usdc, pool, uiPoolDataProvider, addressesProvider, configurator } = testEnv;

  //   const user = users[0];
    
  //   // await waitForTx(
  //   //   await configurator.connect(user.signer).setBorrowableInIsolation(usdc.address, false)
  //   // );

    



  //   await waitForTx(
  //     await configurator.connect(user.signer).setDebtCeiling(usdc.address, 0)
  //   );

  //   await waitForTx(
  //     await configurator.connect(user.signer).setDebtCeiling(wrose.address, 0)
  //   );

  //   await waitForTx(
  //     await pool.connect(user.signer).setUserUseReserveAsCollateral(wrose.address, true)
  //   );

  //   await waitForTx(
  //     await pool.connect(user.signer).setUserUseReserveAsCollateral(usdc.address, true)
  //   );

  //   // const reservesData = await uiPoolDataProvider.getUserReservesData(addressesProvider.address, user.address);
  //   // for(const reserveData of reservesData[0]) {
  //   //   if(reserveData.underlyingAsset === wrose.address) {
  //   //     expect(reserveData.usageAsCollateralEnabledOnUser).to.be.equal(true);
  //   //   }
  //   // }
  //   const userAccountData = await pool.getUserAccountData(user.address);
  //   const totalCollateralBase = userAccountData.totalCollateralBase;
  //   console.log("totalCollateralBase", totalCollateralBase.toString());
  // });

  it("Borrow USDC", async () => {
    const { users, wrose, aWrose, usdc, pool, helpersContract, uiPoolDataProvider, addressesProvider, walletBalanceProvider } =
      testEnv;

    // const borrowSize = await parseUnitsFromToken(usdc.address, "10");
    const user = users[0];

    const userAccountData = await pool.getUserAccountData(user.address);
    console.log(pool.address);
    console.log("userAccountData", userAccountData);
    
    const userReservesData = await uiPoolDataProvider.getUserReservesData(addressesProvider.address, user.address);
    console.log("userReservesData", userReservesData);

    const reservesData = await uiPoolDataProvider.getReservesData(addressesProvider.address);
    console.log("reservesData", reservesData);

    const reserveDataOfUSDC = await helpersContract.getReserveData(usdc.address);
    console.log("reserveDataOfUSDC", reserveDataOfUSDC);

    const reserveDataOfWrose = await helpersContract.getReserveData(wrose.address);
    console.log("reserveDataOfWrose", reserveDataOfWrose);

    
    // const reserveDataOfUSDC = await helpersContract.getAllReservesTokens();
    // console.log("reserveDataOfUSDC", reserveDataOfUSDC);

    // const { variableDebtTokenAddress } =
    //   await helpersContract.getReserveTokensAddresses(usdc.address);

    // const varDebtToken = await ethers.getContractAt(
    //   "VariableDebtToken",
    //   variableDebtTokenAddress
    // );
    
    // //user 1 borrow 10 USDC
    // await waitForTx(
    //   await pool
    //     .connect(user.signer)
    //     .borrow(usdc.address, borrowSize, "2", "0", user.address)
    // );

    // const debtBalance = await varDebtToken.balanceOf(user.address);
    // expect(debtBalance).to.be.equal(borrowSize);
    // console.log("debtBalance", debtBalance.toString());
  });

  // it("Repay USDC", async () => {
  //   const { users, usdc, aUsdc, pool, helpersContract, walletBalanceProvider } = testEnv;

  //   const repaySize = await parseUnitsFromToken(usdc.address, "10");
  //   const user = users[1];

  //   const { variableDebtTokenAddress } =
  //     await helpersContract.getReserveTokensAddresses(usdc.address);

  //   const varDebtToken = await ethers.getContractAt(
  //     "VariableDebtToken",
  //     variableDebtTokenAddress
  //   );

  //   await waitForTx(
  //     await pool
  //       .connect(user.signer)
  //       .repay(usdc.address, repaySize, "2", user.address)
  //   );

  //   const debtBalance = await varDebtToken.balanceOf(user.address);
  //   expect(debtBalance).to.be.equal(zero);
  //   console.log("debtBalance", debtBalance.toString());
  // });

  // it("Withdraw ROSE", async () => {
  //   const { users, aWrose, pool, wrappedTokenGateway } = testEnv;

  //   const user = users[1];
  //   const aTokensBalance = await aWrose.balanceOf(user.address);

  //   // Approve the aTokens to Gateway so Gateway can withdraw and convert to Ether
  //   await waitForTx(
  //     await aWrose.connect(user.signer).approve(wrappedTokenGateway.address, MAX_UINT_AMOUNT)
  //   );

  //   await waitForTx(
  //     await wrappedTokenGateway.connect(user.signer).withdrawETH(pool.address, aTokensBalance.div(10), user.address)
  //   );

  //   const aTokensBalanceAfter = await aWrose.balanceOf(user.address);
  //   expect(aTokensBalanceAfter).to.be.equal(aTokensBalance.sub(aTokensBalance.div(10)));
  //   console.log("aTokensBalanceAfter", aTokensBalanceAfter.toString());
  // });

  // it("Withdraw USDC", async () => {
  //   const { users, aUsdc, pool, wrappedTokenGateway, usdc } = testEnv;

  //   const user = users[1];
  //   const aTokensBalance = await aUsdc.balanceOf(user.address);

  //   await waitForTx(
  //     await pool.connect(user.signer).withdraw(usdc.address, aTokensBalance.div(10), user.address)
  //   );

  //   const aTokensBalanceAfter = await aUsdc.balanceOf(user.address);
  //   expect(aTokensBalanceAfter).to.be.equal(aTokensBalance.sub(aTokensBalance.div(10)));
  //   console.log("aTokensBalanceAfter", aTokensBalanceAfter.toString());
  // });

  it("should liquidate non-healthy position", async () => {
    const { users, usdc, wrose, pool, uiPoolDataProvider, faucetOwnable, helpersContract } = testEnv;

    const liquidator = users[2];
    const user = users[1];

    
    const { variableDebtTokenAddress } =
      await helpersContract.getReserveTokensAddresses(usdc.address);

    const varDebtToken = await ethers.getContractAt(
      "VariableDebtToken",
      variableDebtTokenAddress
    );

    let debtBalance = await varDebtToken.balanceOf(user.address);
    console.log("debt balance before borrow", debtBalance);

    let userAccountData = await pool.getUserAccountData(user.address);
    const availableToBorrrow = userAccountData.availableBorrowsBase.div(parseEther("1"));

    console.log("availableToBorrrow", availableToBorrrow.toString());
    
    await waitForTx(
      await pool
        .connect(user.signer)
        .borrow(usdc.address, parseUnitsFromToken(usdc.address, availableToBorrrow.toString()), "2", "0", user.address)
    );

    debtBalance = await varDebtToken.balanceOf(user.address);
    console.log("debt balance after borrow", debtBalance);
    
    userAccountData = await pool.getUserAccountData(user.address);
    const healthFactorBefore = userAccountData.healthFactor;
    console.log("healthFactorBefore", healthFactorBefore.toString());

    await increaseTime(60*60*24*30*5);

    userAccountData = await pool.getUserAccountData(user.address);
    const healthFactorAfter = userAccountData.healthFactor;

    debtBalance = await varDebtToken.balanceOf(user.address);
    console.log("debt balance after borrow 5 month", debtBalance);

    console.log("healthFactorAfter", healthFactorAfter.toString());

    expect(healthFactorAfter).to.be.lt(parseUnits("1", 18));

    const userDebtBefore = userAccountData.totalDebtBase;

    //mint usdc for liquidator
    const mint_amount = await parseUnitsFromToken(usdc.address, "1000");
    await waitForTx(
      await faucetOwnable.connect(liquidator.signer).mint(usdc.address, liquidator.address, mint_amount)
    );

    await waitForTx(
      await usdc.connect(user.signer).approve(pool.address, MAX_UINT_AMOUNT)
    );

    await waitForTx(
      await pool.connect(liquidator.signer).liquidationCall(wrose.address, usdc.address, user.address, debtBalance.div(2), false)
    );

    debtBalance = await varDebtToken.balanceOf(user.address);
    console.log("debt balance after liquidation", debtBalance);

    userAccountData = await pool.getUserAccountData(user.address);
    const userDebtAfter = userAccountData.totalDebtBase;
    expect(userDebtAfter).to.be.lt(userDebtBefore);
    console.log("userDebtBefore", userDebtBefore.toString());
    console.log("userDebtAfter", userDebtAfter.toString());
    const healthAfterLiquidate = userAccountData.healthFactor;
    console.log("healthAfterLiquidate", healthAfterLiquidate.toString());
  });

