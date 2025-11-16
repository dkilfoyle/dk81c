        ; start up stuff
        org 16514               ; stored in REM at top (ZX81)
        jr start                ; needed for z80asm

; title
copy:
        db _AS,_D,_K,$76        ; DK

start:
        ld hl,line

pline:
        ld a,(hl)
        cp $ff
        jp z,end2
        call PRINT
        inc hl
        jp pline

end2:
        ret

line: 
        db _H,_E,_L,_L,_O,$00,_W,_O,_R,_L,_D,$ff
        