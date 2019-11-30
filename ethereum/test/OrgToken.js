const OrgToken = artifacts.require('OrgToken');

contract('OrgToken', () => {
    let orgToken;

    beforeEach(async () => {
        orgToken = await OrgToken.new();
    });

    it('Should be deployed successfully', async () => {
        assert(orgToken.address);
    });
});
