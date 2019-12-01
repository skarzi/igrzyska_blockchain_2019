const Crowdfunding = artifacts.require('Crowdfunding');

contract('Crowdfunding', (accounts) => {
    let crowdfunding;

    beforeEach(async () => {
        crowdfunding = await Crowdfunding.new();
    });

    it('Should be deployed successfully', async () => {
        assert(crowdfunding.address);
    });

    it('Test brokers', async () => {
        let broker = accounts[1];

        let brokersCount = await crowdfunding.getBrokersCount();

        assert(
            brokersCount.toNumber() === 0,
            'Brokers count is not zero.',
        );

        await crowdfunding.addBroker(broker);

        brokersCount = await crowdfunding.getBrokersCount();
        assert(
            brokersCount.toNumber() > 0,
            'Brokers count is not greater than zero.',
        );

        await crowdfunding.removeBroker(broker);

        brokersCount = await crowdfunding.getBrokersCount();
        assert(
            brokersCount.toNumber() === 0,
            'Brokers count is not zero.',
        );
    });

    it('Test orgs', async () => {
        let org = accounts[1];

        let organizationsCount = await crowdfunding.getOrganizationsCount();

        assert(
            organizationsCount.toNumber() === 0,
            'Organizations count is not zero.',
        );

        await crowdfunding.addOrgToWhitelist(org);

        organizationsCount = await crowdfunding.getOrganizationsCount();
        assert(
            organizationsCount.toNumber() > 0,
            'Organizations count is not greater than zero.',
        );

        await crowdfunding.removeOrgFromWhitelist(org);

        organizationsCount = await crowdfunding.getOrganizationsCount();
        assert(
            organizationsCount.toNumber() === 0,
            'Organizations count is not zero.',
        );
    });

    it('Test users', async () => {
        let user = accounts[1];

        let usersCount = await crowdfunding.getUsersCount();

        assert(
            usersCount.toNumber() === 0,
            'Users count is not zero.',
        );

        await crowdfunding.addUserToWhitelist(user);

        usersCount = await crowdfunding.getUsersCount();
        assert(
            usersCount.toNumber() > 0,
            'Users count is not greater than zero.',
        );

        await crowdfunding.removeUserFromWhitelist(user);

        usersCount = await crowdfunding.getUsersCount();
        assert(
            usersCount.toNumber() === 0,
            'Users count is not zero.',
        );
    });
});
