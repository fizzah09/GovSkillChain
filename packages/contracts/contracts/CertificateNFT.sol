// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title CertificateNFT
/// @notice Non-transferable (soulbound) ERC-721 representing a government-issued
///         skill certificate. Only the CertificateRegistry contract (MINTER_ROLE)
///         may mint or burn tokens. Tokens can never be transferred between wallets.
contract CertificateNFT is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    error CertificateNonTransferable();

    uint256 private _nextTokenId = 1;

    constructor(address admin) ERC721("GovSkill Certificate", "GSKC") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Mints a new certificate token to `to`. Only callable by the Registry contract.
    function safeMint(address to) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    /// @notice Burns a certificate (used only in exceptional admin corrections, not normal revocation).
    function burn(uint256 tokenId) external onlyRole(MINTER_ROLE) {
        _burn(tokenId);
    }

    /// @dev Blocks all transfers except mint (from == address(0)) and burn (to == address(0)).
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert CertificateNonTransferable();
        }
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
