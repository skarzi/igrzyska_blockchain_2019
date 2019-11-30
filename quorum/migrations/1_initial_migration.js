const fs = require('fs');

const globalConfig = require('./config/global');


module.exports = async (deployer) => {
    console.log('Migrations started!');

    let fileExists = fs.existsSync(globalConfig.deploymentFile);
    let data = {};

    let migrationContract = globalConfig.getMigrationContract(artifacts);
    await deployer.deploy(migrationContract);

    if (fileExists) {
        data['migration'] = migrationContract.address;
    } else {
        data = {
            migration: migrationContract.address,
        }
    }
    fs.writeFileSync(globalConfig.deploymentFile, JSON.stringify(data));
};
