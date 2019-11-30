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

    modifier onlyBroker() { require(true == true, "Message"); _; }
    modifier onlyBackend() { require(msg.sender == backend, "Sender should be backend"); _; }

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        address _backend
    ) public
    ERC20Detailed(_name, _symbol, _decimals)
    Ownable() {
        backend = _backend;
    }

    // SECTION: START AUCTION
    function invokeAuctionRequest() {
        // invoke auction request by comp/org
    }

    function signAuctionRequest()
    onlyBroker() {
        // sign auction request by one of brokers
    }

    function startAuction() {
        // start auction by company/org when auction is signed by comp/org
    }

    // SECTION: INVEST
    function becomeInvestorRequest() {
        // investor request by user
    }

    function signInvestorRequest()
    onlyBroker() {
        // sign investor request by one of brokers
    }

    function buildInvestInAuction(address _from, uint256 _value)
    onlyBackend()
    returns (bytes32) {
        // build invest method for user by backend
        return 0x0;
    }

    function investInAuction(bytes32 _message, uint8 _v, bytes32 _r, bytes32 _s) payable {
        // investing in auction by user
        address signer = ecrecover(_message, _v, _r, _s);
    }

    // SECTION: CONFIGURE BROKER
    function addBroker(address _broker)
    onlyOwner() {
        // add broker by owner
    }

    function removeBroker(address _broker)
    onlyOwner() {
        // remove broker by owner
    }
}
