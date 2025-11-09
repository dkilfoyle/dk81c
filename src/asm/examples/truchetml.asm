; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
;
; Truchet Tiles ML
; Steven Reid (c) 2025
; An ML version of my truchet tiles demo.
; v1 07/17/2025 - initial build
;
; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
;
; Header and startup
;

        ; start up stuff
        org 16514               ; stored in REM at top (ZX81)
        jr start                ; needed for z80asm

; title and copyright (will show when LISTed)
copy:
        db _as,_t_,_r_,_u_,_c_,_h_,_e_,_t_,_mi,_m_
        db _l_,_as,_s_,_l_,_r_,_sl,_2_,_0_,_2_,_5_
        db _as,$76  ; **AAAAAAA**SLR/2025**


; starting routines (if any)
start:

;        call slow               ; SLOW is required.
;        call cls                ; clear/expand screen

;
; end header and startup
;
; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
;
; Main program
;

mainloop:

ld de,(d_file)          ; grab display file
inc de                  ; add one

ld b,12                 ; height x 2
y_loop:

ld c,16                 ; width x 2
x_loop:

push bc                 ; save loop
call print_a_tile
pop bc                  ; restore loop

call delay

; done with x?
dec c
jp nz,x_loop

push bc
ld bc,34                ; jump ahead
ex de,hl
add hl,bc               ; to next row
ex de,hl
pop bc
; de at start of next row

; done with y?
djnz y_loop

        jp mainloop             ; start again!

;
; end main
;
; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
;
; Routines
;

; +++
; Print a tile
print_a_tile:

; get tile
ld hl,tile_1            ; set to 1st tile data
call rnd                ; get which tile
cp 127                  ; compare to 50%
jp m, print_tile        ; print first tile
ld hl,tile_2            ; set to 2nd tile data

print_tile:
        ; de = points to display file
        ; hl = points to tile pattern
        ld bc,33        ; next row

        ; print 1st row
        ldi             ; print 1st char
        ldi             ; print 2nd char

        push de         ; save display location
        ex de,hl
        add hl,bc       ; to print tile
        ex de,hl

        ; print 2nd row
        ldi             ; print 1st char
        ldi             ; print 2nd char

        pop de          ; restore location
        ret
; end print tile
; ---

; +++
; Break
;
; preserves state, but will exit if SPACE is pushed

check_break:
        exx                     ; save register states

        ; did the player press break key (space)?
        call $0f46              ; was break pressed? (break-1 ROM routine)
        jr nc,break             ; no, then return

        exx                     ; restore registers
        ret                     ; and return

        ; yes, exit the program as normal
break:
        rst $0008               ; call ERROR-1 reset
        db $ff                  ; with error code 0 (normal exit)

; end break
; ---

; +++
; Delay and test
;
; Will break out of program if SPACE is pressed
; Will end early if a key is pressed
; vars: d = delay
; uses: ac,hl
; keeps: hl,de,bc
; returns: none

delay_count: dw $0000
delay:
        push hl
        ld hl,100               ; time to delay
delay_loop:
        ld (delay_count),hl     ; save delay

        call check_break        ; pressed break?

        ; check if done
        ld hl,(delay_count)     ; grab what to test
        dec hl                  ; subtract 1
        ld a,h                  ; check if done
        or l
        jr nz,delay_loop        ; not zero, keep going!

        pop hl
        ret                     ; pause is done!

; end delay and test
; ---

; +++
; Random number
;
; vars: none
; uses: a
; keeps: hl,de,bc
; returns: a

rnd:    ; random routine with refresh
        push hl                 ; save hl
seed:
        ld hl,0                 ; seed value
        ld a,r                  ; grab the refresh register
        add a,l                 ; add msb of seed (l)
        ld l,a                  ; and save it as the new value
        ld a,r                  ; grab the refresh register again
        add a,h                 ; add lsb of seed (h)
        and $1f                 ; mask it to stay in ZX81 ROM (lower 8K)
        ld h,a                  ; set pointer back within ROM
        ld (seed+1),hl          ; save current pointer (self modifying code!!!)
        ld a,(hl)		; get value in ROM

        pop hl                  ; restore hl
        ret			; back to mainprogram

; end rnd
; ---

;
; end routines
;
; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
;
; Data
;

; Truchet tiles patterns
tile_1: db $06,$00,$00,$06
tile_2: db $00,$86,$86,$00

;
; end data
;
; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
;
; Defines
;

; ZX81 system vars
d_file:         equ $400c
df_cc:          equ 16398
last_k:         equ 16421
margin:         equ 16424
s_posn:         equ 16441
frames:         equ 16436

; ZX81 ROM functions
kscan:          equ $02bb
findchar:       equ $07bd
stop:           equ $0cdc
slow:           equ $0f2b
fast:           equ $02e7
save:           equ $02f9
printat:        equ $08f5
pause:          equ $0f35
cls:            equ $0a2a

; ZX81 Characters (not ASCII)
_sp:            equ $00
_qu:            equ $0b
_lb:            equ $0c
_dl:            equ $0d
_cl:            equ $0e
_lp:            equ $10
_rp:            equ $11
_gt:            equ $12
_lt:            equ $13
_eq:            equ $14
_pl:            equ $15
_mi:            equ $16
_as:            equ $17
_sl:            equ $18
_sc:            equ $19
_cm:            equ $1a
_pr:            equ $1b
_0_:            equ $1c
_1_:            equ $1d
_2_:            equ $1e
_3_:            equ $1f
_4_:            equ $20
_5_:            equ $21
_6_:            equ $22
_7_:            equ $23
_8_:            equ $24
_9_:            equ $25
_a_:            equ $26
_b_:            equ $27
_c_:            equ $28
_d_:            equ $29
_e_:            equ $2a
_f_:            equ $2b
_g_:            equ $2c
_h_:            equ $2d
_i_:            equ $2e
_j_:            equ $2f
_k_:            equ $30
_l_:            equ $31
_m_:            equ $32
_n_:            equ $33
_o_:            equ $34
_p_:            equ $35
_q_:            equ $36
_r_:            equ $37
_s_:            equ $38
_t_:            equ $39
_u_:            equ $3a
_v_:            equ $3b
_w_:            equ $3c
_x_:            equ $3d
_y_:            equ $3e
_z_:            equ $3f

;
; end defines
;
; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *