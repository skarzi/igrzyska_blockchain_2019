module.exports = {
    compileCommand: 'truffle compile',
    testCommand: 'truffle test --network coverage',
    skipFiles: ['Migrations.sol'],
    copyPackages: ['openzeppelin-solidity']
};
