const fs = require('fs');

const globalConfig = require('./config/global');


module.exports = async (deployer) => {
    console.log('Deploying org token!');

    let content = fs.readFileSync(globalConfig.deploymentFile);

    let orgTokenContract = globalConfig.getOrgTokenContract(artifacts);
    await deployer.deploy(
        orgTokenContract,
        globalConfig.tokenName,
        globalConfig.tokenSymbol,
        18,
        globalConfig.supply,
        globalConfig.backend,
        globalConfig.organization,
        1,
        globalConfig.ratio,
    );

    fs.writeFileSync(globalConfig.deploymentFile, JSON.stringify({
        orgToken: orgTokenContract.address,
    }));
};
