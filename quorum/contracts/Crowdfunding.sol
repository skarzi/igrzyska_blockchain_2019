pragma solidity ^0.5.2;

// Remix
// import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/v1.12.0/contracts/ownership/Ownable.sol";

// Truffle
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract Crowdfunding is Ownable {
    address[] public brokers;
    mapping(address => uint256) public brokerMap;
    function getBrokersCount() public view returns (uint256) {
        return brokers.length;
    }

    address[] public organizations;
    mapping(address => uint256) public organizationWhitelist;
    function getOrganizationsCount() public view returns (uint256) {
        return organizations.length;
    }

    address[] public users;
    mapping(address => uint256) public userWhitelist;
    function getUsersCount() public view returns (uint256) {
        return users.length;
    }

    constructor() public
    Ownable() {}

    function addBroker(address _broker)
    onlyOwner() public {
        if (brokerMap[_broker] == 0) {
            brokerMap[_broker] = brokers.length + 1;
            brokers.push(_broker);
        } else {
            revert('Already a broker');
        }
    }

    function removeBroker(address _broker)
    onlyOwner() public {
        if (brokerMap[_broker] != 0) {
            delete brokers[brokerMap[_broker] - 1];
            brokers.length--;
            brokerMap[_broker] = 0;
        } else {
            revert('Not a broker');
        }
    }

    function addOrgToWhitelist(address _org) public {
        if (organizationWhitelist[_org] == 0) {
            organizationWhitelist[_org] = organizations.length + 1;
            organizations.push(_org);
        } else {
            revert('Already on whitelist');
        }
    }

    function removeOrgFromWhitelist(address _org) public {
        if (organizationWhitelist[_org] != 0) {
            delete organizations[organizationWhitelist[_org] - 1];
            organizations.length--;
            organizationWhitelist[_org] = 0;
        } else {
            revert('Not on whitelist');
        }
    }

    function addUserToWhitelist(address _user) public {
        if (userWhitelist[_user] == 0) {
            userWhitelist[_user] = users.length + 1;
            users.push(_user);
        } else {
            revert('Already on whitelist');
        }
    }

    function removeUserFromWhitelist(address _user) public {
        if (userWhitelist[_user] != 0) {
            delete users[userWhitelist[_user] - 1];
            users.length--;
            userWhitelist[_user] = 0;
        } else {
            revert('Not on whitelist');
        }
    }
}
