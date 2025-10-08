 1 | 16384 | 0x4000 | ERR-NR      | 1 less than report code                   | DEFB 0
 1 | 16385 | 0x4001 | FLAGS       | various flags for basic                   | DEFB 0
 2 | 16386 | 0x4002 | ERR-SP      | Addr 1st item on stack after gsb          | DEFB 0
 2 | 16388 | 0x4004 | RAM-TOP     | Addr 1st byte above basic system          | DEFB 0
 1 | 16390 | 0x4006 | MODE        | K L F or G cursor                         | DEFB 0
 2 | 16391 | 0x4007 | PPC         | Line num current statement                | DEFB 0
 1 | 16393 | 0x4009 | VERSN       | 0 for 8k rom                              | DEFB 0
 2 | 16394 | 0x400a | E_PPC       | Number of current line                    | DEFW 2
 2 | 16396 | 0x400c | D_FILE      | Display file addr                         | DEFW Display
 2 | 16398 | 0x400e | DF_CC       | Addr of Print pos in display file         | DEFW Display+1                  ; First character of display
 2 | 16400 | 0x4010 | VARS        |                                           | DEFW Variables
 2 | 16402 | 0x4012 | DEST        | Addr of variable in assignment            | DEFW 0
 2 | 16404 | 0x4014 | E_LINE      |                                           | DEFW BasicEnd 
 2 | 16406 | 0x4016 | CH_ADD      | Addr of next char to be interpreted       | DEFW BasicEnd+4                 ; Simulate SAVE "X"
 2 | 16408 | 0x4018 | X_PTR       | Addr of char preceding marker             | DEFW 0
 2 | 16410 | 0x401a | STKBOT      |                                           | DEFW BasicEnd+5
 2 | 16412 | 0x401c | STKEND      |                                           | DEFW BasicEnd+5                 ; Empty stack
 1 | 16414 | 0x401e | BREG        |                                           | DEFB 0
 2 | 16415 | 0x401f | MEM         |                                           | DEFW MEMBOT
 1 | 16417 | 0x4021 | UNUSED1     |                                           | DEFB 0
 1 | 16418 | 0x4022 | DF_SZ       |                                           | DEFB 2
 2 | 16419 | 0x4023 | S_TOP       |                                           | DEFW $0002                      ; Top program line number
 2 | 16421 | 0x4025 | LAST_K      |                                           | DEFW $fdbf
 1 | 16423 | 0x4027 | DEBOUN      |                                           | DEFB 15
 1 | 16424 | 0x4028 | MARGIN      |                                           | DEFB 55
 2 | 16425 | 0x4029 | NXTLIN      |                                           | DEFW Line2                      ; Next line address
 2 | 16427 | 0x402b | OLDPPC      |                                           | DEFW 0
 1 | 16429 | 0x402d | FLAGX       |                                           | DEFB 0
 2 | 16430 | 0x402e | STRLEN      |                                           | DEFW 0
 2 | 16432 | 0x4030 | T_ADDR      |                                           | DEFW $0c8d
 2 | 16434 | 0x4032 | SEED        |                                           | DEFW 0
 2 | 16436 | 0x4034 | FRAMES      |                                           | DEFW $f5a3
 1 | 16438 | 0x4036 | COORDS x    |                                           | DEFW 0
 1 | 16439 | 0x4037 | COORDS y    |                                           | DEFW 0
 1 | 16440 | 0x4038 | PR_CC       |                                           | DEFB $bc
 1 | 16441 | 0x4039 | S_POSN col  |                                           | DEFW $1821
 1 | 16442 | 0x403a | S_POSN row  |                                           | DEFW $1821
 1 | 16443 | 0x403b | CDFLAG      |                                           | DEFB $40
33 | 16444 | 0x403c | PRBUFF      |                                           | DEFB 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,$76 ; 32 Spaces + Newline
30 | 16477 | 0x405d | MEMBOT      |                                           | DEFB 0,0,0,0,0,0,0,0,0,0,$84,$20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ; 30 zeros
 2 | 16507 | 0x407b | UNUNSED2    |                                           | DEFW 0

