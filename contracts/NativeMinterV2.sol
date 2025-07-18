// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {AbstractNativeMinter} from "../contracts/abstracts/AbstractNativeMinter.sol";

contract NativeMinterV2 is AbstractNativeMinter {

    constructor(address precompiled, address admin) AbstractNativeMinter(precompiled, admin) {
        _initialPrecompileOwner(address(this));
    }

    function mint(address to, uint256 value) public onlyAdmin {
       uint256 newValue = _calculation1(value); // case 1: 1) calculation1
        _mint(to, newValue);
    }

    function _calculation1(uint256 value) internal  pure returns (uint256){
        return value*2;
    }

}