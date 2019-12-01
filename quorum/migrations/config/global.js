const DotEnv = require('dotenv');
DotEnv.config();


class GlobalConfig {
    constructor() {
        this.keepDeployedFile = process.env.KEEP_DEPLOYED;
        this.broker = '0xF7DE62B65768a169279be74b12FaA65a22FB38D3';
        this.organization = '0xF7DE62B65768a169279be74b12FaA65a22FB38D3';
        this.user = '0xF7DE62B65768a169279be74b12FaA65a22FB38D3';
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

    getCrowdfundingContract(artifacts) {
        return this.getContract(artifacts, 'Crowdfunding');
    }
}

module.exports = new GlobalConfig();
