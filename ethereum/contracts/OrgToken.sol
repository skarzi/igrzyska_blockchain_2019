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
    bool public organization;
    uint256 public requiredSigns;

    address[] public brokers;
    mapping (address => bool) public brokersWhitelist;
    function getBrokersCount() public view returns (uint256) {
        return brokers.length;
    }

    address[] public investors;
    mapping (address => uint256) public investorsWhitelist;
    function getInvestorsCount() public view returns (uint256) {
        return investors.length;
    }

    address[] public signedByBroker;
    mapping (address => uint256) public signByBrokerList;
    function getSignedBrokerCount() public view returns (uint256) {
        return signedByBroker.length;
    }

    address[] public investorsWhitelist;
    mapping (address => uint256) public investorsWhitelistWhitelist;
    function getInvestorsSignsCount() public view returns (uint256) {
        return investorsWhitelist.length;
    }

    struct HashData {
        address from;
        uint256 value;
        bytes32 data;
    }
    mapping (address => HashData) public hashesBitches;

    enum State {
        NotStarted,
        Verification,
        Started
    }
    State public currentState;

    modifier onlyInState(State _state) {
        require(currentState == _state, "State of Event Token is invalid");
        _;
    }

    modifier onlyBroker() { require(brokers[msg.sender] == true, "Sender should be broker"); _; }
    modifier onlyBackend() { require(msg.sender == backend, "Sender should be backend"); _; }
    modifier onlyOrganization() { require(msg.sender == organization, "Sender should be organization"); _; }
    modifier auctionStarted() { require(auctionStarted == true, "Auction has to be started"); _; }

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _tokensTotal,
        address _backend,
        address _organization,
        uint256 _requiredSigns
    ) public
    ERC20Detailed(_name, _symbol, _decimals)
    Ownable() {
        backend = _backend;
        organization = _organization;
        requiredSigns = _requiredSigns;

        _mint(address(this), _tokensTotal);
        currentState = State.NotStarted;
    }

    // SECTION: START AUCTION
    function invokeAuctionRequest()
    onlyOrganization()
    onlyInState(State.NotStarted) {
        currentState = State.Verification;
    }

    function signAuctionRequest()
    onlyBroker()
    onlyInState(State.Verification) {
        if (signByBrokerList[msg.sender] == 0) {
            signByBrokerList[msg.sender] = signedByBroker.length + 1;
            signedByBroker.push(msg.sender);
            requiredSigns--;
        } else {
            revert('Already signed by sender or no requires more signatures');
        }
    }

    function startAuction()
    onlyOrganization()
    onlyInState(State.Verification) {
        if (auctionStarted == false && requiredSigns == 0) {
            currentState = State.Started;
        } else {
            revert('Auction already started or requires more signatures');
        }
    }

    // SECTION: INVEST
    function addInvestorByBroker(address userAddress)
    onlyBroker() {
        if (investorsWhitelist[userAddress] == 0) {
            investorsWhitelist[userAddress] = investors.length + 1;
            investors.push(userAddress);
        } else {
            revert('Already an investor');
        }
    }

    function buildInvestInAuction(address _from, uint256 _value)
    onlyBackend()
    onlyInState(State.Started)
    returns (HashData) {
        // Compute hash using _from and _value
        bytes32 _hashData = HashData(
            from=_from,
            value=_value,
            data=0x0
        );
        hashesBitches[_from] = _hashData;
        return _hashData;
    }

    function investInAuction(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) payable
    onlyInState(State.Started) {
        HashData _hashData = hashesBitches[msg.sender];
        if (_hashData.data != _message) {
            revert('Not a proper hash bitch');
        }

        address signer = ecrecover(_message, _v, _r, _s);
        if (_hashData.from != signer) {
            revert('Signer is not ok bitch');
        }

        if (_hashData.value != msg.value) {
            revert('Give me my money bitch');
        }

        // For now 1:100 ratio (1 ETH => 100 Tokens)
        transfer(_hashData.from, _hashData.value * 100);
    }

    // SECTION: CONFIGURE BROKER
    function addBroker(address _broker)
    onlyOwner() {
        if (brokersWhitelist[_broker] == 0) {
            brokersWhitelist[_broker] == brokers.length + 1;
            brokers.push(_broker);
        } else {
            revert('Already a broker');
        }
    }

    function removeBroker(address _broker)
    onlyOwner() {
        if (brokersWhitelist[_broker] != 0) {
            delete brokers[brokersWhitelist[_broker] - 1];
            brokers.length--;
            brokersWhitelist[_broker] = 0;
        } else {
            revert('Not a broker');
        }
    }
}
