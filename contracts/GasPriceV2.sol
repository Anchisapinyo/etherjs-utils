// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {AbstractGasPrice} from "../contracts/abstracts/AbstractGasPrice.sol";

contract GasPriceV2 is AbstractGasPrice {
    uint256 private _scr;
    uint256 private _operationFees;

    constructor(address precompiled, address admin) AbstractGasPrice(precompiled, admin) {
        _initialPrecompileOwner(address(this));
    }

    function enable() public onlyAdmin whenDisable returns (bool) {
        _setStatus(true);
        return true;
    }

    function disable() public onlyAdmin whenEnabled returns (bool) {
        _setStatus(false);
        return true;
    }

    function setOperationFees(uint256 _newOperationFees) public onlyAdmin returns (bool) {
        _operationFees = _newOperationFees;
        uint256 newGasPrice = (1+_scr)*_newOperationFees;
        _setGasPrice(newGasPrice);
        return true;
    }

    function setSCR(uint256 _newSCR) public onlyAdmin returns(bool) {
        _scr = _newSCR;
        return true;
    }


}
