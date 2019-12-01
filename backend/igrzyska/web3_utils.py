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
        address='',
        abi=get_public_abi(),
    )


def complete_funding_entry(funding_entry, signed_token):
    contract = public_w3.eth.contract(
        address='0x000000000000000000000000000000000000dEaD',
        abi=get_public_abi(),
    )
