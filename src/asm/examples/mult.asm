; multiplicand in HL
; multiplier in de

start:
        ld hl,2
        ld de,64
        call mul16
        ld a,l
        call hprint
        ret

mul16:
        ld c,l          ; copy hl (multiplicand) to bc
        ld b,h
        ld hl,0         ; set partial product to 0
        ld a,15         ; bit count

        ; shift and add algorithm
        ; if msb of multiplier is 1:
        ; - add multiplicand to partial
        ; - shift partial product and multiplier to left
mlp:
        sla e           ; shift multiplier left
        rl d
        jr nc,mlp1      ; jr if msb of multiplier = 0 
        add hl,bc       ; add multiplicand to partial product

mlp1:
        add hl,hl       ; shift partial product left
        dec a
        jr nz,mlp       ; continue until count = 0

        ; add multiplicand one last time if msb of multiplier is 1

        or d            ; sign flag = msb of multiplier
        ret p           ; exit if msb of multiplier is 0
        add hl,bc       ; add multiplicand to product
        ret

hprint:
        push af
        and $f0         ; isolate first digit
        rra
        rra
        rra
        rra
        add a,$1c       ; add 28 to character code
        call PRINT
        pop af
        and $0f         ; isolate second digit
        add a,$1C
        call PRINT
        ld a,$00
        call PRINT
        ret
