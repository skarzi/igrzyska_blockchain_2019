/* Copyright 2014, Kenneth MacKay. Licensed under the BSD 2-clause license. */

#include "uECC.h"

#include <stdio.h>
#include <string.h>
#include <stdint.h>

int char2int(char input)
{
  if(input >= '0' && input <= '9')
    return input - '0';
  if(input >= 'A' && input <= 'F')
    return input - 'A' + 10;
  if(input >= 'a' && input <= 'f')
    return input - 'a' + 10;
}

void hex2bin(const char* src, char* target)
{
  while(*src && src[1])
  {
    *(target++) = char2int(*src)*16 + char2int(src[1]);
    src += 2;
  }
}

int main() {
    const char* privKeyHex = "7c67889e52f7ff44148673ce5c03e57c76dad62ceb5d5e04f835feb9ce965caf";
    const char* hashHex = "0a34a384bc33ea048bd01efd255736ee814abd8a97f1416a1ad054f0fb970e30";

    int i, c;
    uint8_t privateKey[32] = {0};
    uint8_t hash[32] = {0};
    uint8_t sig[64] = {0};

    hex2bin(privKeyHex, (char*)privateKey);
    hex2bin(hashHex, (char*)hash);

    const struct uECC_Curve_t * curve = uECC_secp256k1();
    int num_curves = 0;
    
    for(int i = 0; i < 32; ++i) {
        printf("%i ", (int)privateKey[i]);
    }
    printf("\n");
    for(int i = 0; i < 32; ++i) {
        printf("%i ", (int)hash[i]);
    }
    printf("\n");
    
    if (!uECC_sign(privateKey, hash, sizeof(hash), sig, curve)) {
        printf("uECC_sign() failed\n");
        return 1;
    }
    
    printf("0x");
    for(int i = 0; i < 64; ++i) {
        if(i == 32) {
            printf("\n0x");
        }
        printf("%02hhX", sig[i]);
    }
    printf("\n");
    return 0;
}
