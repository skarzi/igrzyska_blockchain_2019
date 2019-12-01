const DotEnv = require('dotenv');
DotEnv.config();


class GlobalConfig {
    constructor() {
        this.keepDeployedFile = process.env.KEEP_DEPLOYED;
        this.backend = '0x3D4A893c5f26E9b3200AffA75aDfd1492932B5d8';
        this.broker = '0xe625Ea79101f0f05C55f4134cEc71628016717b8';
        this.organization = '0x235bFCb8B953538d70b806CF475851a520b980ca';
        this.user = '0x9B2daa270735ccf956e7112952C2C5ABf423f4aE';
        this.tokenName = 'TestAuction';
        this.tokenSymbol = 'TA';
        this.supply = 1 * 10**6;
        this.ratio = 100;
    }

    get deploymentFile() {
        if (this.keepDeployedFile) {
            return './.deployed';
        } else {
            return '/tmp/.deployed';
        }
    }

    delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    async retryUntilSuc(callback) {
        let stop = 3;
        while (stop > 0) {
            try {
                await callback();
                return;
            } catch (e) {
                console.log('Failed, retrying...');
                await this.delay(5000);
                stop--;
            }
        }
    }

    etherInWei(ether) {
        return (ether * 10**18).toString();
    }

    tokenInDecimals(token) {
        // TODO: To be adjusted to external configurable decimals if needed
        return (token * 10**18).toString();
    }

    getContract(artifacts, contractName) {
        return artifacts.require(`./${contractName}.sol`);
    }

    getMigrationContract(artifacts) {
        return this.getContract(artifacts, 'Migrations');
    }

    getOrgTokenContract(artifacts) {
        return this.getContract(artifacts, 'OrgToken');
    }
}

module.exports = new GlobalConfig();
