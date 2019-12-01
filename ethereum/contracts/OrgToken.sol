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
    address public organization;
    uint256 public requiredSigns;
    bool public auctionStartedInfo;

    address[] public brokers;
    mapping (address => uint256) public brokersWhitelist;
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


    enum State {
        NotStarted,
        Verification,
        Started
    }
    State public currentState;

    modifier onlyBroker() { require(brokersWhitelist[msg.sender] > 0, "Sender should be broker"); _; }
    modifier onlyBackend() { require(msg.sender == backend, "Sender should be backend"); _; }
    modifier onlyOrganization() { require(msg.sender == organization, "Sender should be organization"); _; }
    modifier auctionStarted() { require(auctionStartedInfo == true, "Auction has to be started"); _; }
    modifier onlyInState(State _state) {
        require(currentState == _state, "State of Event Token is invalid");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        address _backend,
        address _organization,
        uint256 _requiredSigns
    )
    ERC20Detailed(_name, _symbol, _decimals)
    Ownable()
    public {
        backend = _backend;
        organization = _organization;
        auctionStartedInfo = false;
        requiredSigns = _requiredSigns;
    }

    // SECTION: START AUCTION
    function invokeAuctionRequest()
    onlyOrganization()
    onlyInState(State.NotStarted)
    public {
        currentState = State.Verification;
    }

    function signAuctionRequest()
    onlyBroker()
    onlyInState(State.Verification)
    public {
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
    onlyInState(State.Verification)
    public {
        if (auctionStartedInfo == false && requiredSigns == 0) {
            currentState = State.Started;
        } else {
            revert('Auction already started or requires more signatures');
        }
    }

    // SECTION: INVEST
    function addInvestorByBroker(address userAddress)
    auctionStarted()
    onlyBroker()
    public {
        if (investorsWhitelist[userAddress] == 0) {
            investorsWhitelist[userAddress] = investors.length + 1;
            investors.push(userAddress);
        } else {
            revert('Already an investor');
        }
    }

    function buildInvestInAuction(address _auctionAddress, address _from, uint256 _value)
    onlyInState(State.Started)
    onlyBackend()
    public
    returns (bytes32) {
        // build invest method for user by backend
        return 0x0;
    }

    function investInAuction(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) payable
    onlyInState(State.Started)
    public {
        address signer = ecrecover(_message, _v, _r, _s);
    }

    // SECTION: CONFIGURE BROKER
    function addBroker(address _broker)
    onlyOwner()
    public {
        if (brokersWhitelist[_broker] == 0) {
            brokersWhitelist[_broker] = brokers.length + 1;
            brokers.push(_broker);
        } else {
            revert('Already a broker');
        }
    }

    function removeBroker(address _broker)
    onlyOwner()
    public {
        if (brokersWhitelist[_broker] != 0) {
            delete brokers[brokersWhitelist[_broker] - 1];
            brokers.length--;
            brokersWhitelist[_broker] = 0;
        } else {
            revert('Not a broker');
        }
    }
}
