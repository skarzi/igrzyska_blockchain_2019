pragma solidity ^0.5.2;

// Remix
// import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/v1.12.0/contracts/ownership/Ownable.sol";
// import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/v1.12.0/contracts/token/ERC20/DetailedERC20.sol";
// import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/v1.12.0/contracts/token/ERC20/StandardToken.sol";

// Truffle
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract OrgToken is ERC20Detailed, ERC20, Ownable {
    address public backend;
    bool public auctionStarted;
    bool public organization;
    byte16 requiredSigns;
    mapping (address => bool) public brokers;
    mapping (address => bool) public investors;
    mapping (address => bool) public signs;

    modifier onlyBroker() { require(brokers[msg.sender] == true, "Sender should be broker"); _; }
    modifier onlyBackend() { require(msg.sender == backend, "Sender should be backend"); _; }
    modifier onlyOrganization() { require(msg.sender == organization, "Sender should be organization"); _; }
    modifier auctionStarted() { require(auction_started == true, "Auction has to be started"); _; }

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        address _backend,
        address _organization,
        byte16 _minSigns
    ) public
    ERC20Detailed(_name, _symbol, _decimals)
    Ownable() {
        backend = _backend;
        organization = _organization;
        auctionStarted = false;
        requiredSigns = _minSigns;
    }

    // SECTION: START AUCTION
    function invokeAuctionRequest()
    onlyBroker() {
        // empty??
    }

    function signAuctionRequest()
    onlyOrganization() {
        if (signs[msg.sender] == false && requiredSigns > 0) {
            signs[msg.sender] = true;
            requiredSigns--;
        } else {
            revert('Already signed by sender or no requires more signatures');
        }
    }

    function startAuction()
    onlyOrganization() {
        if (auctionStarted == false && requiredSigns == 0) {
            auctionStarted = true;
        } else {
            revert('Auction already started or requires more signatures');
        }
    }

    // SECTION: INVEST
    function addInvestorByBroker(bytes32 userAddress)
    onlyBroker() {
        if (investors[userAddress] == false) {
            investors[userAddress] = true;
        } else {
            revert('Already an investor');
        }
    }

    function buildInvestInAuction(address _auctionAddress, address _from, uint256 _value)
    onlyBackend()
    returns (bytes32) {
        // build invest method for user by backend
        return 0x0;
    }

    function investInAuction(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) payable {
        address signer = ecrecover(_message, _v, _r, _s);
    }

    // SECTION: CONFIGURE BROKER
    function addBroker(address _broker)
    onlyOwner() {
        if (brokers[_broker] == false) {
            brokers[_broker] = true;
        } else {
            revert('Already a broker');
        }
    }

    function removeBroker(address _broker)
    onlyOwner() {
        if (brokers[_broker] == true) {
            brokers[_broker] = false;
        } else {
            revert('Not a broker');
        }
    }
}
