const OrgToken = artifacts.require('OrgToken');

contract('OrgToken', () => {
    let orgToken;

    beforeEach(async () => {
        orgToken = await OrgToken.new(
            "TokenName",
            "SYM",
            18,
            0x0,
        );
    });

    it('Should be deployed successfully', async () => {
        assert(orgToken.address);
    });

    it('Test brokers', async () => {
        let broker = accounts[1];

        let brokersCount = await orgToken.getBrokersCount();

        assert(
            brokersCount.toNumber() === 0,
            'Brokers count is not zero.',
        );

        await orgToken.addBroker(broker);

        brokersCount = await crowdfunding.getBrokersCount();
        assert(
            brokersCount.toNumber() > 0,
            'Brokers count is not greater than zero.',
        );

        await orgToken.removeBroker(broker);

        brokersCount = await crowdfunding.getBrokersCount();
        assert(
            brokersCount.toNumber() === 0,
            'Brokers count is not zero.',
        );
    });
});
