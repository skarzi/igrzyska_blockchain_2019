/*
 * Copyright 2016-2019 NXP
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * o Redistributions of source code must retain the above copyright notice, this list
 *   of conditions and the following disclaimer.
 *
 * o Redistributions in binary form must reproduce the above copyright notice, this
 *   list of conditions and the following disclaimer in the documentation and/or
 *   other materials provided with the distribution.
 *
 * o Neither the name of NXP Semiconductor, Inc. nor the names of its
 *   contributors may be used to endorse or promote products derived from this
 *   software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
/**
 * @file    ED25519.c
 * @brief   Application entry point.
 */
#include <stdio.h>
#include "board.h"
#include "peripherals.h"
#include "pin_mux.h"
#include "clock_config.h"
#include "fsl_eeprom.h"
#include "LPC8N04.h"
/* TODO: insert other include files here. */
#include "fsl_nfc.h"
#include "uECC.h"

/* TODO: insert other definitions and declarations here. */

/*
 * @brief   Application entry point.
 */

#define printf(...) (void)0

static uint8_t buffer[256] = {0xFD, 0x02, 0x00, 0x00, 0xFE, 0x00, 0x00, 0x00};
static uint8_t read_buffer[256];

static uint8_t owner[32];
static uint8_t private_key[32];
static uint8_t public_key[32];
static uint8_t signature[64];
const struct uECC_Curve_t * curve;


static const uint32_t version = 0x11111115; // if version stored in EPPROM is different it will reset device (generate new keys)

static const eeprom_config_t eeprom_config = {
    .autoProgram     = kEEPROM_AutoProgramDisable,
    .writeWaitPhase1 = 0x5U,
    .writeWaitPhase2 = 0x9U,
    .writeWaitPhase3 = 0x3U,
    .readWaitPhase1  = 0xFU,
    .readWaitPhase2  = 0x8U,
    .lockTimingParam = false,
};

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

void write(const uint8_t* data, int len)
{
	if(!data) len = 0;

	buffer[0] = 0xFD;
	buffer[1] = 0x02;
	buffer[2] = 0x00;
	buffer[3] = 0x00;

	buffer[4] = 0x03;
	buffer[5] = 32 + 5 + 32 + 5 + (data ? len + 5 : 0);

	// owner, password for device, in the future will be hidden, not visible for test purposes
	buffer[6] = 0x91;
	buffer[7] = 0x01;
	buffer[8] = 32 + 1;
	buffer[9] = 'U';
	buffer[10] = 0x00; // uri type none
	for(int i = 0; i < 32; ++i) {
		buffer[11 + i] = owner[i];
	}

	// public key
	buffer[43] = data ? 0x11 : 0x51;
	buffer[44] = 0x01;
	buffer[45] = 32 + 1;
	buffer[46] = 'U';
	buffer[47] = 0x00; // uri type none
	for(int i = 0; i < 32; ++i) {
		buffer[48 + i] = public_key[i];
	}

	if(data) {
		// signature
		buffer[80] = 0x51;
		buffer[81] = 0x01;
		buffer[82] = len + 1;
		buffer[83] = 'U';
		buffer[84] = 0x00; // uri type none
		for(int i = 0; i < len; ++i) {
			buffer[85 + i] = data[i];
		}
	}

	int pos = (data ? 85 + len : 80);

	buffer[pos] = 0xFE;
	buffer[pos + 1] = 0;
	buffer[pos + 2] = 0;
	buffer[pos + 3] = 0;

	NFC_WritePage(RFIDNFC, 0, (const uint32_t *)buffer, sizeof(buffer) / 4);
}

void process(uint8_t* data, int len)
{
	uint8_t hash[32];
	data[len] = 0;
    hex2bin(data, (char*)hash);

    if(!uECC_sign(private_key, hash, 32, signature, curve)) {
    	BOARD_LedMatrixShowNumber(8, 2000, 0);
    }

	write(signature, 64);
}

// password for device, in the future will be hidden
void setOwner(uint8_t* data, int len)
{
	if(len != 32) return;
    for(int i = 0; i < 32; ++i) {
    	owner[i] = data[i];
    }
    uint32_t sourceClock_Hz = CLOCK_GetFreq(kCLOCK_SysClk);
    EEPROM_Init(EEPROM, &eeprom_config, sourceClock_Hz);
    EEPROM_Write(EEPROM, 4, owner, 32);
    EEPROM_Deinit(EEPROM);
    write(NULL, 0);
}

int main(void) {
  	/* Init board hardware. */
    BOARD_InitBootPins();
    BOARD_InitBootClocks();
    BOARD_InitBootPeripherals();
    BOARD_InitLedMatrix();

    POWER_SelectPowerSource(3);
    POWER_EnableAutoPowerSwitch(true);
    POWER_EnableAutoBatterySwitch(true);

    curve = uECC_secp256k1();

    int mstatus = 0;
	CLOCK_SetSysClkDiv(kCLOCK_SysClkFreq8MHZ);
    SystemCoreClockUpdate();

    NFC_Init(RFIDNFC);
    NFC_WritePage(RFIDNFC, 0, (const uint32_t *)buffer, sizeof(buffer) / sizeof(uint32_t));

    uint32_t sourceClock_Hz = CLOCK_GetFreq(kCLOCK_SysClk);
    EEPROM_Init(EEPROM, &eeprom_config, sourceClock_Hz);

    // read 100 bytes of eeprom into buffer
    for (int i = 0; i < sizeof(buffer); i++)
    {
        buffer[i] = (*(((uint8_t *)FSL_FEATURE_EEPROM_BASE_ADDRESS + i)));
    }

    if(*(uint32_t*)buffer != version)
    {
    	BOARD_LedMatrixShowNumber(5, 2000, 0);

    	*(uint32_t*)buffer = version;
    	for(int i = 0; i < 32; ++i) { // owner
    		buffer[i + 4] = 0;
    	}
        if (!uECC_make_key(buffer + 4 + 32 + 32, buffer + 4 + 32, curve)) {
        	while(1) { // error
            	BOARD_LedMatrixShowNumber(8, 2000, 0);
        	}
        }

    	EEPROM_Write(EEPROM, 0, buffer, 100);
    	BOARD_LedMatrixShowNumber(6, 2000, 0);
    }

    for(int i = 0; i < 32; ++i)
    {
    	owner[i] = buffer[i + 4];
    	private_key[i] = buffer[i + 32 + 4];
    	public_key[i] = buffer[i + 32 + 32 + 4];
    }

    EEPROM_Deinit(EEPROM);

    write(NULL, 0);

    while(1)
    {
		BOARD_LedMatrixShowNumber(mstatus, 1, 0);

    	uint32_t status = NFC_GetInterruptStatus(RFIDNFC);

		if(status == 0) continue;
		NFC_ClearInterruptStatus(RFIDNFC, status);

		if((status & kNFC_MemWriteInterrupt)) { // after nfc write
			printf("MemMemWriteInterrupt\n");
			NFC_ReadPage(RFIDNFC, 0, (uint32_t*)read_buffer, sizeof(read_buffer) / 4);
			printf("MemMemWriteInterrupt end\n");
			for(int i = 0; i < sizeof(read_buffer); )
			{
				uint8_t type = read_buffer[i++];
				if(type == 0xFE) // terminator, eof
					break;
				uint8_t length = read_buffer[i++];
				if(length == 0)
					continue;

				int section_end = i + length;
				if(section_end >= 79) break;
				if(section_end >= sizeof(read_buffer)) break;
				if(type != 0x03 && type != 0x01) {
					i = section_end;
					continue;
				}

				while(i < section_end) {
					uint8_t flags = read_buffer[i++];
					uint8_t type_length = read_buffer[i++];
					uint8_t payload_length = read_buffer[i++];
					if(i + payload_length > section_end) break;

					uint8_t record_type = read_buffer[i++];

					if(record_type == 'T') {
						uint8_t lang_code_length = read_buffer[i++];
						if(i + lang_code_length >= section_end) break;
						i += lang_code_length;
						payload_length -= 1 + lang_code_length;
					} else if(record_type == 'U') {
						read_buffer[i++]; // URI Indentifier
						payload_length -= 1;
					} else {
						i = section_end;
						continue;
					}

					if(payload_length == 32) { // set owner, used as password, but not implemented yet
						setOwner(read_buffer + i, payload_length);
					}
					if(payload_length == 64) { // sign
						process(read_buffer + i, payload_length);
					}

					i += payload_length;

					i = sizeof(read_buffer); // just break
				}
			}
		}
    }

    return 0 ;
}
