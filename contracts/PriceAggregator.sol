// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./AggregatorInterface.sol";
import "./IPriceOracle.sol";

contract PriceAggregator is AggregatorInterface {
    IPriceOracle private priceOracle;
    address private token;

    constructor (address _priceOracle, address _token) {
        priceOracle = IPriceOracle(_priceOracle);
        token = _token;
    }
    function latestAnswer() external view returns (int256) {
        uint256 price = priceOracle.getPrice(token);
        return int256(price); // decimals = 8
    }

    function decimals() external pure returns (uint256) {
        return 8;
    }
}