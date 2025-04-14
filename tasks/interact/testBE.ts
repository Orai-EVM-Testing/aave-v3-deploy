import { getAaveProtocolDataProvider, getPool, getPoolAddressesProvider, getUiPoolDataProvider } from './../../helpers/contract-getters';
async function testBE(){
    const UiPoolDataProvider = await getUiPoolDataProvider();
    const poolAddressesProvider = await getPoolAddressesProvider();
    const reservesData = (await UiPoolDataProvider.getReservesData(poolAddressesProvider.address))[0];
    // console.log("reservesData:", reservesData);
    const usdc = reservesData[0];
    // const orai = reservesData[1];
    // const och = reservesData[2];
    
    console.log("usdc:", usdc);
    console.log("usdc:", usdc.symbol, Number(usdc.liquidityRate)/1e27 * 100, Number(usdc.variableBorrowRate)/1e27 * 100, usdc.borrowingEnabled);
    // console.log("orai:", orai.symbol, Number(orai.liquidityRate)/1e27 * 100, Number(orai.variableBorrowRate)/1e27 * 100, orai.borrowingEnabled);
    // console.log("och:", och.symbol, Number(och.liquidityRate)/1e27 * 100, Number(och.variableBorrowRate)/1e27 * 100, och.borrowingEnabled);

    const aaveProtocolDataProvider = await getAaveProtocolDataProvider();
    const reserveDataOfUSDC = await aaveProtocolDataProvider.getReserveData(usdc.underlyingAsset);
    // const reserveDataOfORAI = await aaveProtocolDataProvider.getReserveData(orai.underlyingAsset);
    // const reserveDataOfOCH = await aaveProtocolDataProvider.getReserveData(och.underlyingAsset);
    console.log("reserveDataOfUSDC:", reserveDataOfUSDC);
    // console.log("reserveDataOfORAI:", reserveDataOfORAI);
    // console.log("reserveDataOfOCH:", reserveDataOfOCH);

    /*
    const user = "0xC04a3786d42f71724Ba2b7B5Ab97f58ed58815a3";
    const pool = await getPool();

    console.log("UserAccountData:", await pool.getUserAccountData(user));
    console.log("UserReserveData:", await UiPoolDataProvider.getUserReservesData(poolAddressesProvider.address, user));
    */
}

testBE().then(() => {
    console.log("testBE completed successfully");
}
).catch((error) => {
    console.error("Error in testBE:", error);
});