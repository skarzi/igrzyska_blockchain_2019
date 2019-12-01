const fs = require('fs');

const globalConfig = require('./config/global');

module.exports = async (deployer) => {
    console.log('Init contracts!');

    let content = fs.readFileSync(globalConfig.deploymentFile);
    let data = JSON.parse(content);

    let orgTokenAddress = data.orgToken;
    let orgTokenContract = globalConfig.getOrgTokenContract(artifacts);
    let orgToken = await orgTokenContract.at(orgTokenAddress);

    await orgToken.addBroker(globalConfig.broker);

    console.log('Migrations deployed!');
};
