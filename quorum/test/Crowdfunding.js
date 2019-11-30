const Crowdfunding = artifacts.require('Crowdfunding');

contract('Crowdfunding', () => {
    let crowdfunding;

    beforeEach(async () => {
        crowdfunding = await Crowdfunding.new();
    });

    it('Should be deployed successfully', async () => {
        assert(crowdfunding.address);
    });
});
