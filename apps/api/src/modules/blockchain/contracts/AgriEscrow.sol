// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AgriEscrow
 * @notice Smart contract for automated escrow payments in ODOP Connect.
 * @dev Deploy to Ethereum Sepolia or Polygon Mumbai testnet.
 *
 * FLOW:
 *   1. Buyer calls createOrder() and sends ETH → held in contract
 *   2. Farmer delivers product and calls confirmDelivery()
 *   3. Buyer calls releasePayment() → funds sent to farmer
 *   OR: Buyer calls raiseDispute() → admin arbitration
 */
contract AgriEscrow {
    enum EscrowStatus { CREATED, DELIVERED, RELEASED, DISPUTED, REFUNDED }

    struct Escrow {
        string  orderId;
        address buyer;
        address payable farmer;
        uint256 amount;
        EscrowStatus status;
        uint256 createdAt;
        uint256 releasedAt;
    }

    mapping(string => Escrow) public escrows;
    address public admin;

    // Events
    event EscrowCreated(string indexed orderId, address buyer, address farmer, uint256 amount);
    event DeliveryConfirmed(string indexed orderId, address farmer);
    event PaymentReleased(string indexed orderId, address farmer, uint256 amount);
    event DisputeRaised(string indexed orderId, address buyer);
    event Refunded(string indexed orderId, address buyer, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Buyer creates an escrow order and deposits funds.
     */
    function createOrder(string calldata orderId, address payable farmer) external payable {
        require(msg.value > 0, "Must send ETH");
        require(escrows[orderId].amount == 0, "Escrow already exists");

        escrows[orderId] = Escrow({
            orderId: orderId,
            buyer: msg.sender,
            farmer: farmer,
            amount: msg.value,
            status: EscrowStatus.CREATED,
            createdAt: block.timestamp,
            releasedAt: 0
        });

        emit EscrowCreated(orderId, msg.sender, farmer, msg.value);
    }

    /**
     * @notice Farmer confirms delivery of goods.
     */
    function confirmDelivery(string calldata orderId) external {
        Escrow storage e = escrows[orderId];
        require(msg.sender == e.farmer, "Only farmer");
        require(e.status == EscrowStatus.CREATED, "Invalid status");

        e.status = EscrowStatus.DELIVERED;
        emit DeliveryConfirmed(orderId, msg.sender);
    }

    /**
     * @notice Buyer confirms receipt and releases payment to farmer.
     */
    function releasePayment(string calldata orderId) external {
        Escrow storage e = escrows[orderId];
        require(msg.sender == e.buyer, "Only buyer");
        require(
            e.status == EscrowStatus.CREATED || e.status == EscrowStatus.DELIVERED,
            "Invalid status"
        );

        e.status = EscrowStatus.RELEASED;
        e.releasedAt = block.timestamp;
        e.farmer.transfer(e.amount);

        emit PaymentReleased(orderId, e.farmer, e.amount);
    }

    /**
     * @notice Buyer raises a dispute — admin will arbitrate.
     */
    function raiseDispute(string calldata orderId) external {
        Escrow storage e = escrows[orderId];
        require(msg.sender == e.buyer, "Only buyer");
        require(e.status == EscrowStatus.CREATED || e.status == EscrowStatus.DELIVERED, "Invalid status");

        e.status = EscrowStatus.DISPUTED;
        emit DisputeRaised(orderId, msg.sender);
    }

    /**
     * @notice Admin refunds buyer in case of valid dispute.
     */
    function refund(string calldata orderId) external onlyAdmin {
        Escrow storage e = escrows[orderId];
        require(e.status == EscrowStatus.DISPUTED, "Not disputed");

        e.status = EscrowStatus.REFUNDED;
        payable(e.buyer).transfer(e.amount);

        emit Refunded(orderId, e.buyer, e.amount);
    }
}
