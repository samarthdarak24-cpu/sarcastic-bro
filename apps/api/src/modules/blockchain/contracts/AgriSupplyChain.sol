// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AgriSupplyChain
 * @notice Tracks product lifecycle events on-chain for ODOP Connect.
 * @dev Deploy to Ethereum Sepolia or Polygon Mumbai testnet.
 *      Gas-optimized: stores only hashes and minimal metadata.
 */
contract AgriSupplyChain {
    struct TraceEvent {
        bytes32 dataHash;     // SHA256 of product data
        bytes32 prevHash;     // Hash of previous event (chain linkage)
        address farmer;       // Farmer's wallet address
        uint256 timestamp;    // Block timestamp
        string  eventType;    // SEED | HARVEST | QUALITY | LOGISTICS | DELIVERED
        string  location;     // Lat/Lng or place name
    }

    // productId => array of trace events
    mapping(string => TraceEvent[]) private productTraces;

    // Events
    event TraceAdded(
        string indexed productId,
        bytes32 dataHash,
        string eventType,
        address indexed farmer,
        uint256 timestamp
    );

    /**
     * @notice Add a new trace event to a product's supply chain.
     * @param productId Unique product identifier
     * @param dataHash SHA256 hash of the off-chain product data
     * @param eventType Type of lifecycle event
     * @param location Geographic location of the event
     */
    function addProductTrace(
        string calldata productId,
        bytes32 dataHash,
        string calldata eventType,
        string calldata location
    ) external {
        TraceEvent[] storage traces = productTraces[productId];

        bytes32 prevHash = traces.length > 0
            ? traces[traces.length - 1].dataHash
            : bytes32(0);

        traces.push(TraceEvent({
            dataHash: dataHash,
            prevHash: prevHash,
            farmer: msg.sender,
            timestamp: block.timestamp,
            eventType: eventType,
            location: location
        }));

        emit TraceAdded(productId, dataHash, eventType, msg.sender, block.timestamp);
    }

    /**
     * @notice Get a specific trace event by index.
     */
    function getProductTrace(string calldata productId, uint256 index)
        external
        view
        returns (
            bytes32 dataHash,
            bytes32 prevHash,
            address farmer,
            uint256 timestamp,
            string memory eventType,
            string memory location
        )
    {
        require(index < productTraces[productId].length, "Index out of bounds");
        TraceEvent storage t = productTraces[productId][index];
        return (t.dataHash, t.prevHash, t.farmer, t.timestamp, t.eventType, t.location);
    }

    /**
     * @notice Get the total number of trace events for a product.
     */
    function getTraceCount(string calldata productId) external view returns (uint256) {
        return productTraces[productId].length;
    }
}
