const assert = require('assert');
const { Blockchain, Block, BlockchainManager } = require('./blockchain/blockchain');

// Test for Blockchain class
function testBlockchain() {
    console.log("Running Blockchain tests...");

    // Test 1: Genesis block creation
    const shushrutaChain = new Blockchain();
    assert.strictEqual(shushrutaChain.chain.length, 1, "Test 1 Failed: Genesis block should be created.");
    assert.strictEqual(shushrutaChain.chain[0].data, 'Genesis Block', "Test 1 Failed: Genesis block data is incorrect.");
    console.log("Test 1 Passed: Genesis block created correctly.");

    // Test 2: Adding a new block
    const data1 = { sender: "Alice", receiver: "Bob", amount: 10 };
    const newBlock1 = new Block(shushrutaChain.chain.length, new Date().toISOString(), data1);
    shushrutaChain.addBlock(newBlock1);
    assert.strictEqual(shushrutaChain.chain.length, 2, "Test 2 Failed: New block should be added.");
    assert.deepStrictEqual(shushrutaChain.chain[1].data, data1, "Test 2 Failed: New block data is incorrect.");
    console.log("Test 2 Passed: New block added correctly.");

    // Test 3: Chain validity
    assert.strictEqual(shushrutaChain.isChainValid(), true, "Test 3 Failed: Chain should be valid.");
    console.log("Test 3 Passed: Chain is valid.");

    // Test 4: Tampering with the chain (should become invalid)
    shushrutaChain.chain[1].data = { sender: "Alice", receiver: "Charlie", amount: 5 };
    assert.strictEqual(shushrutaChain.isChainValid(), false, "Test 4 Failed: Tampered chain should be invalid.");
    console.log("Test 4 Passed: Tampered chain detected as invalid.");

    console.log("All Blockchain tests completed.");
}

// Test for BlockchainManager class
function testBlockchainManager() {
    console.log("\nRunning BlockchainManager tests...");

    const manager = new BlockchainManager();

    // Test 1: Get a chain for a new category
    const chain1 = manager.getChain("Kidney");
    assert.ok(chain1 instanceof Blockchain, "Test 1 Failed: Should return a Blockchain instance.");
    assert.strictEqual(chain1.chain.length, 1, "Test 1 Failed: New chain should have a genesis block.");
    console.log("Test 1 Passed: New chain created for category.");

    // Test 2: Get the same chain for an existing category
    const chain1Again = manager.getChain("Kidney");
    assert.strictEqual(chain1, chain1Again, "Test 2 Failed: Should return the same chain instance for existing category.");
    console.log("Test 2 Passed: Returns existing chain for category.");

    // Test 3: Add block to a category
    const data2 = { orderId: "123", organ: "Kidney" };
    manager.addBlockToCategory("Kidney", data2);
    assert.strictEqual(manager.getChain("Kidney").chain.length, 2, "Test 3 Failed: Block not added to Kidney chain.");
    assert.deepStrictEqual(manager.getChain("Kidney").chain[1].data, data2, "Test 3 Failed: Block data is incorrect.");
    console.log("Test 3 Passed: Block added to category chain.");

    // Test 4: Add block to a different category (should create a new chain)
    const data3 = { orderId: "456", organ: "Heart" };
    manager.addBlockToCategory("Heart", data3);
    assert.strictEqual(manager.getChain("Heart").chain.length, 2, "Test 4 Failed: Block not added to Heart chain.");
    assert.deepStrictEqual(manager.getChain("Heart").chain[1].data, data3, "Test 4 Failed: Block data is incorrect.");
    assert.strictEqual(manager.getChain("Kidney").chain.length, 2, "Test 4 Failed: Kidney chain length changed unexpectedly.");
    console.log("Test 4 Passed: Block added to new category chain.");

    // Test 5: Check category chain validity
    assert.strictEqual(manager.isCategoryChainValid("Kidney"), true, "Test 5 Failed: Kidney chain should be valid.");
    assert.strictEqual(manager.isCategoryChainValid("Heart"), true, "Test 5 Failed: Heart chain should be valid.");
    console.log("Test 5 Passed: Category chains are valid.");

    // Test 6: Tamper with a category chain
    manager.getChain("Kidney").chain[1].data = { orderId: "123", organ: "Liver" };
    assert.strictEqual(manager.isCategoryChainValid("Kidney"), false, "Test 6 Failed: Tampered Kidney chain should be invalid.");
    console.log("Test 6 Passed: Tampered category chain detected as invalid.");

    console.log("All BlockchainManager tests completed.");
}

// Run all tests
try {
    testBlockchain();
    testBlockchainManager();
    console.log("\nAll tests passed successfully!");
} catch (error) {
    console.error("\nTests failed:", error.message);
}