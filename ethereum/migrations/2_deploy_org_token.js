const fs = require('fs');

const globalConfig = require('./config/global');


module.exports = async (deployer) => {
    console.log('Deploying org token!');

    let content = fs.readFileSync(globalConfig.deploymentFile);
    let data = JSON.parse(content);

    let orgTokenContract = globalConfig.getOrgTokenContract(artifacts);
    await deployer.deploy(orgTokenContract);

    fs.writeFileSync(globalConfig.deploymentFile, JSON.stringify({
        orgToken: orgTokenContract.address,
    }));
};
