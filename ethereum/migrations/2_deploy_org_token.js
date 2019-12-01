const fs = require('fs');

const globalConfig = require('./config/global');


module.exports = async (deployer) => {
    console.log('Deploying org token!');

    let content = fs.readFileSync(globalConfig.deploymentFile);

    let orgTokenContract = globalConfig.getOrgTokenContract(artifacts);
    await deployer.deploy(
        orgTokenContract,
        "TokenName",
        "SYM",
        18,
        1 * 10**6,
        "0xF7DE62B65768a169279be74b12FaA65a22FB38D3",
        "0xF7DE62B65768a169279be74b12FaA65a22FB38D3",
        1,
        100,
    );

    fs.writeFileSync(globalConfig.deploymentFile, JSON.stringify({
        orgToken: orgTokenContract.address,
    }));

    await orgTokenContract.addBroker("0xF7DE62B65768a169279be74b12FaA65a22FB38D3");
};
