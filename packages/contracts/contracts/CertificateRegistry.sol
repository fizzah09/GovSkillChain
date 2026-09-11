// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CertificateNFT.sol";

/// @title CertificateRegistry
/// @notice Core business logic for GovSkill Chain. Verifies a government-signed
///         "score attestation" (EIP-712) before minting a soulbound certificate.
///         Anyone can call `verifyCertificate` to check validity — the whole
///         point of putting this on-chain.
contract CertificateRegistry is AccessControl, EIP712, Pausable, ReentrancyGuard {
    using ECDSA for bytes32;

    bytes32 public constant ISSUER_ROLE  = keccak256("ISSUER_ROLE");
    bytes32 public constant REVOKER_ROLE = keccak256("REVOKER_ROLE");
    bytes32 public constant ATTESTOR_ROLE = keccak256("ATTESTOR_ROLE");

    // EIP-712 typehash for the score attestation signed off-chain by the
    // government's attestation service (private key held in KMS/HSM).
    bytes32 private constant ATTESTATION_TYPEHASH = keccak256(
        "ScoreAttestation(address holder,bytes32 citizenIdHash,bytes32 testIdHash,uint16 score,uint16 passingScore,uint64 issuedAt,uint64 expiresAt,string metadataURI,uint256 nonce)"
    );

    struct Certificate {
        address holder;
        bytes32 citizenIdHash;   // hash of national ID -> privacy preserving
        bytes32 testIdHash;      // which skill/test this certifies
        uint16  score;           // 0-1000 scale
        uint16  passingScore;
        uint64  issuedAt;
        uint64  expiresAt;       // 0 = never expires
        address issuer;
        bool    revoked;
        string  revokedReason;
        string  metadataURI;     // ipfs://... full certificate JSON
    }

    CertificateNFT public immutable certificateNFT;

    mapping(uint256 => Certificate) public certificates;
    mapping(uint256 => bool) public usedNonces; // prevents attestation replay

    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed holder,
        bytes32 indexed testIdHash,
        uint16 score,
        uint64 issuedAt
    );
    event CertificateRevoked(uint256 indexed tokenId, address indexed revoker, string reason);
    event AttestorUpdated(address indexed oldAttestor, address indexed newAttestor);

    error InvalidAttestationSignature();
    error ScoreBelowPassingThreshold();
    error NonceAlreadyUsed();
    error AttestationExpired();
    error CertificateAlreadyRevoked();
    error CertificateDoesNotExist();

    constructor(address admin, address attestor, CertificateNFT _certificateNFT)
        EIP712("GovSkillCertificateRegistry", "1")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ATTESTOR_ROLE, attestor);
        certificateNFT = _certificateNFT;
    }

    struct IssueParams {
        address holder;
        bytes32 citizenIdHash;
        bytes32 testIdHash;
        uint16 score;
        uint16 passingScore;
        uint64 issuedAt;
        uint64 expiresAt;
        string metadataURI;
        uint256 nonce;
        bytes signature; // EIP-712 signature from the ATTESTOR
    }

    /// @notice Issues (mints) a certificate after verifying the government's signed score attestation.
    /// @dev Only accounts with ISSUER_ROLE (the backend service, using a role-restricted wallet)
    ///      may submit this transaction — but the actual trust anchor is the ATTESTOR signature,
    ///      which is checked independently below. This gives two layers of authorization.
    function issueCertificate(IssueParams calldata p)
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
        nonReentrant
        returns (uint256 tokenId)
    {
        if (block.timestamp > p.expiresAt && p.expiresAt != 0) revert AttestationExpired();
        if (usedNonces[p.nonce]) revert NonceAlreadyUsed();
        if (p.score < p.passingScore) revert ScoreBelowPassingThreshold();

        bytes32 structHash = keccak256(
            abi.encode(
                ATTESTATION_TYPEHASH,
                p.holder,
                p.citizenIdHash,
                p.testIdHash,
                p.score,
                p.passingScore,
                p.issuedAt,
                p.expiresAt,
                keccak256(bytes(p.metadataURI)),
                p.nonce
            )
        );
        bytes32 digest = _hashTypedDataV4(structHash);
        address recovered = digest.recover(p.signature);

        if (!hasRole(ATTESTOR_ROLE, recovered)) revert InvalidAttestationSignature();

        usedNonces[p.nonce] = true;

        tokenId = certificateNFT.safeMint(p.holder);

        certificates[tokenId] = Certificate({
            holder: p.holder,
            citizenIdHash: p.citizenIdHash,
            testIdHash: p.testIdHash,
            score: p.score,
            passingScore: p.passingScore,
            issuedAt: p.issuedAt,
            expiresAt: p.expiresAt,
            issuer: msg.sender,
            revoked: false,
            revokedReason: "",
            metadataURI: p.metadataURI
        });

        emit CertificateIssued(tokenId, p.holder, p.testIdHash, p.score, p.issuedAt);
    }

    /// @notice Revokes a previously issued certificate (e.g., fraud discovered later).
    ///         Record is kept on-chain (not deleted) for a transparent audit trail.
    function revokeCertificate(uint256 tokenId, string calldata reason)
        external
        onlyRole(REVOKER_ROLE)
    {
        Certificate storage cert = certificates[tokenId];
        if (cert.holder == address(0)) revert CertificateDoesNotExist();
        if (cert.revoked) revert CertificateAlreadyRevoked();

        cert.revoked = true;
        cert.revokedReason = reason;

        emit CertificateRevoked(tokenId, msg.sender, reason);
    }

    /// @notice PUBLIC, read-only verification — the core value proposition.
    ///         Anyone (an employer, another agency) can call this with no login/API key.
    function verifyCertificate(uint256 tokenId)
        external
        view
        returns (
            bool isValid,
            Certificate memory cert
        )
    {
        cert = certificates[tokenId];
        if (cert.holder == address(0)) {
            return (false, cert);
        }
        bool notExpired = (cert.expiresAt == 0 || cert.expiresAt > block.timestamp);
        isValid = !cert.revoked && notExpired;
    }

    /// @notice Rotates the attestor key (e.g., annual key rotation policy). Admin (multi-sig) only.
    function updateAttestor(address oldAttestor, address newAttestor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ATTESTOR_ROLE, oldAttestor);
        _grantRole(ATTESTOR_ROLE, newAttestor);
        emit AttestorUpdated(oldAttestor, newAttestor);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
}
