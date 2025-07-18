// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title Interface Native Minter Precompile Contract
 * @author Kiwari Labs
 */

interface INativeMinter {
    /**
     * @notice Mints a specified amount of native tokens to a given address.
     * @dev This function creates native tokens and transfers them to the `to` address.
     * @param to The address that will receive the minted tokens.
     * @param value The amount of native tokens to mint.
     * @return True if the minting operation was successful, otherwise false.
     */
    function mint(address to, uint256 value) external returns (bool);
}
