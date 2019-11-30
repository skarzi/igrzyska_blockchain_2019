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
        0x0,
    );

    fs.writeFileSync(globalConfig.deploymentFile, JSON.stringify({
        orgToken: orgTokenContract.address,
    }));
};
