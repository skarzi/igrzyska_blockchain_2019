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
        globalConfig.backend,
        globalConfig.organization,
        1,
        100,
    );

    fs.writeFileSync(globalConfig.deploymentFile, JSON.stringify({
        orgToken: orgTokenContract.address,
    }));
};
