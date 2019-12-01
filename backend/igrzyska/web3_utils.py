import json

from django.conf import settings

from web3 import Web3

public_w3 = Web3(Web3.HTTPProvider("http://eth:8546"))
private_w3 = Web3(Web3.HTTPProvider("http://quorum:8547"))


def get_abi(abi_path):
    with open(abi_path) as f:
        return json.load(f)


def get_private_abi():
    return get_abi(str(settings.APPS_DIR.path('abi/quorum.json')))


def get_public_abi():
    return get_abi(str(settings.APPS_DIR.path('abi/eth.json')))


def create_funding(funding):
    contract = public_w3.eth.contract(
        address='0x000000000000000000000000000000000000dEaD',
        abi=get_public_abi(),
    )


def create_funding_entry(funding_entry):
    contract = public_w3.eth.contract(
        address='0x7Da2dfAa2E1FCD41dD00F0a0219Cd9915f0bfa9E',
        abi=get_public_abi(),
    )
    tx_hash = contract.functions.buildInvestInAuction(
        funding_entry.user.public_key,
        2, # funding_entry.tokens_amount * funding_entry.token_price,
    ).transact()
    tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    return tx_receipt



def complete_funding_entry(funding_entry, signed_data):
    contract = public_w3.eth.contract(
        address='0x7Da2dfAa2E1FCD41dD00F0a0219Cd9915f0bfa9E',
        abi=get_public_abi(),
    )
    tx_hash = contract.functions.investInAuction(
        *signed_data,
        from=funding_entry.user.private_key,
    ).transact()
    tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    return tx_receipt
