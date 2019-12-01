const fs = require('fs');

const globalConfig = require('./config/global');


module.exports = async (deployer) => {
    console.log('Deploying crowdfunding!');

    let content = fs.readFileSync(globalConfig.deploymentFile);

    let crowdfundingContract = globalConfig.getCrowdfundingContract(artifacts);
    await deployer.deploy(crowdfundingContract);

    fs.writeFileSync(globalConfig.deploymentFile, JSON.stringify({
        crowdfunding: crowdfundingContract.address,
    }));
};
