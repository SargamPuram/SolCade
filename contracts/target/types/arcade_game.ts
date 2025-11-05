/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/arcade_game.json`.
 */
export type ArcadeGame = {
  "address": "AktQJxVTkzBKGSH7p74bhfYRdv1o1MrK3LEccLtpJn5W",
  "metadata": {
    "name": "arcadeGame",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "checkPotStatus",
      "discriminator": [
        89,
        40,
        146,
        137,
        27,
        242,
        185,
        248
      ],
      "accounts": [
        {
          "name": "potAccount"
        }
      ],
      "args": [],
      "returns": "u64"
    },
    {
      "name": "closePot",
      "discriminator": [
        214,
        103,
        62,
        202,
        132,
        229,
        27,
        86
      ],
      "accounts": [
        {
          "name": "potAccount",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "distributeWinners",
      "discriminator": [
        113,
        5,
        211,
        130,
        183,
        247,
        68,
        77
      ],
      "accounts": [
        {
          "name": "potAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pot_account.game_id",
                "account": "gamePot"
              },
              {
                "kind": "account",
                "path": "pot_account.pot_number",
                "account": "gamePot"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "winners",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "initializePot",
      "discriminator": [
        142,
        71,
        252,
        186,
        244,
        59,
        203,
        118
      ],
      "accounts": [
        {
          "name": "potAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "gameId"
              },
              {
                "kind": "arg",
                "path": "potNumber"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "string"
        },
        {
          "name": "potNumber",
          "type": "u64"
        }
      ]
    },
    {
      "name": "payEntryFee",
      "discriminator": [
        18,
        88,
        91,
        123,
        150,
        239,
        147,
        161
      ],
      "accounts": [
        {
          "name": "potAccount",
          "writable": true
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "gamePot",
      "discriminator": [
        218,
        87,
        244,
        122,
        249,
        131,
        38,
        179
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "potNotActive",
      "msg": "The pot is not active."
    },
    {
      "code": 6001,
      "name": "invalidWinnerList",
      "msg": "Invalid winner list: must contain exactly 5 addresses."
    },
    {
      "code": 6002,
      "name": "winnerPubkeyMismatch",
      "msg": "Winner public key does not match the expected order."
    },
    {
      "code": 6003,
      "name": "mathError",
      "msg": "Overflow or underflow error during lamport math."
    }
  ],
  "types": [
    {
      "name": "gamePot",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "potNumber",
            "type": "u64"
          },
          {
            "name": "totalLamports",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "potStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "potStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "ended"
          }
        ]
      }
    }
  ]
};
