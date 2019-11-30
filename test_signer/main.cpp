#include <iostream>
#include <string>
#include <memory.h>
#include "RLP.h"

#include "keccak.h"
#include "ecdsa.h"
#include "bignum256.h"

int main() 
{
    const char privKeyHex[] = "7c67889e52f7ff44148673ce5c03e57c76dad62ceb5d5e04f835feb9ce965caf";
    const char hashHex[] = "5d2d2e5bdc25b4cda6342f161df823b88a559c1bc5f143d4329e5be8dfca2abf";
    uint8_t privKey[32];
    uint8_t hash[32];
    uint8_t r[32];
    uint8_t s[64];
    RLP rlp;    
    
    rlp.hex2bin(privKeyHex, (char*)privKey);
    rlp.hex2bin(hashHex, (char*)hash);
    for(int i = 0; i < 32; ++i) {
        std::cout << (uint16_t)privKey[i] << " ";
    }
    std::cout << std::endl;
    for(int i = 0; i < 32; ++i) {
        std::cout << (uint16_t)hash[i] << " ";                
    }
    std::cout << std::endl;
    ecdsaSign((BigNum256)r, (BigNum256)s, (BigNum256)hash, (BigNum256)privKey);
    std::cout << "0x" << rlp.bytesToHex(std::string((const char*)r,32)) << std::endl;
    std::cout << "0x" << rlp.bytesToHex(std::string((const char*)s,32)) << std::endl;
    swapEndian256(r); // little-endian -> big-endian
    swapEndian256(s); // little-endian -> big-endian    
    std::cout << "0x" << rlp.bytesToHex(std::string((const char*)r,32)) << std::endl;
    std::cout << "0x" << rlp.bytesToHex(std::string((const char*)s,32)) << std::endl;
    
    return 0;
}
