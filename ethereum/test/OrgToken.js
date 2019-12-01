const OrgToken = artifacts.require('OrgToken');

contract('OrgToken', (accounts) => {
    let broker = accounts[7];
    let organization = accounts[8];
    let backend = accounts[9];
    let orgToken;

    beforeEach(async () => {
        orgToken = await OrgToken.new(
            "TokenName",
            "SYM",
            18,
            1 * 10**6,
            backend,
            organization,
            1,
            100,
        );
    });

    it('Should be deployed successfully', async () => {
        assert(orgToken.address);
    });

    it('Test brokers', async () => {
        let brokersCount = await orgToken.getBrokersCount();

        assert(
            brokersCount.toNumber() === 0,
            'Brokers count is not zero.',
        );

        await orgToken.addBroker(broker);

        brokersCount = await orgToken.getBrokersCount();
        assert(
            brokersCount.toNumber() > 0,
            'Brokers count is not greater than zero.',
        );

        await orgToken.removeBroker(broker);

        brokersCount = await orgToken.getBrokersCount();
        assert(
            brokersCount.toNumber() === 0,
            'Brokers count is not zero.',
        );
    });

    it('Test auctions', async () => {
        await orgToken.addBroker(broker);

        let state = await orgToken.currentState.call();
        assert(
            state.toNumber() === 0,
            'State should be started.',
        );

        await orgToken.invokeAuctionRequest({
            from: organization,
        });

        state = await orgToken.currentState.call();
        assert(
            state.toNumber() === 1,
            'State should be in verification.',
        );

        await orgToken.signAuctionRequest({
           from: broker,
        });

        await orgToken.startAuction({
           from: organization,
        });

        state = await orgToken.currentState.call();
        assert(
            state.toNumber() === 2,
            'State should be started.',
        );
    });
});
