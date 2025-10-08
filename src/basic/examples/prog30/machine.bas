100 REM 1111111111111
# (13 times '1')
110 LET S = 16514
120 FOR I = 0 TO 12
130 SCROLL
140 GOSUB 500
150 PRINT I ; "=" ; A$ ; ". -) .";
160 INPUT A$
170 IF A$ = "" THEN GOTO 200
180 LET V = 16 * CODE A$ + CODE A$ (2) - 476
190 POKE S+I, V
200 GOSUB 500
210 PRINT A$
220 NEXT I
230 STOP
500 LET V = PEEK (S+I)
510 LET H = INT(V / 16)
520 LET L = V - 16 * H
530 LET A$ = CHR$ (H + 28) + CHR$ (L + 28)
540 RETURN

# Memory left
# B7, ED , 5B, 1C, 40, ED, 62, 39, ED, 52, E5, c1, C9
# then: PRINT USR 16514

# B7            OR A
# ED 5B 1C 40   LD DE, (16412)
# ED 62         SBC HL, HL
# 39            ADD HL, SP
# ED 52         SBC HL, DE
# E5            PUSH HL
# Cl            POP BC
# C9            RET
