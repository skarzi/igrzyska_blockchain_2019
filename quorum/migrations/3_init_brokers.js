const fs = require('fs');

const globalConfig = require('./config/global');

module.exports = async (deployer) => {
    console.log('Init contracts!');

    let content = fs.readFileSync(globalConfig.deploymentFile);
    let data = JSON.parse(content);

    let crowdfundingAddress = data.crowdfunding;
    let crowdfundingContract = globalConfig.getCrowdfundingContract(artifacts);
    let crowdfunding = await crowdfundingContract.at(crowdfundingAddress);

    await crowdfunding.addBroker(globalConfig.broker);
    await crowdfunding.addOrgToWhitelist(globalConfig.organization);
    await crowdfunding.addUserToWhitelist(globalConfig.user);

    console.log('Migrations deployed!');
};
