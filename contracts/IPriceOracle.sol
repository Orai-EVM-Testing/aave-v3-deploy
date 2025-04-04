// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPriceOracle {
    function getPrice(address token) external view returns (uint256);
}

interface IOldPriceOracle {
    function getPrice(address token) external view returns (uint256, uint256);
}