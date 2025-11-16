; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
;
; Conway's Game of Life
; Steven Reid (c) 2024
; A large screen version of life for the ZX81.
; v1 12/30/2024 - initial build
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
        db _as,_as,_as,_l_,_i_,_f_,_e_,_as,_as,_as
        db _s_,_l_,_r_,_sl,_2_,_0_,_2_,_4_,_as,_as
        db _as,$76  ; ***LIFE***SLR/2024***


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

main_loop:

        call init_life          ; Initilize Game of Life

        ; run simulation
life_loop:

        call live_or_die        ; run life simulation
        call copy_to_screen     ; copy new life to screen
        call delay_and_test     ; tests for break, key, gen>100

        ; was a key pressed or generations hit 100?
        or a
        jp z,life_loop          ; no, display next generation

        jp main_loop            ; otherwise start again!

;
; end main
;
; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
;
; Routines
;

; +++
; Initilize Life
;
init_life:

        xor a                   ; a=0
        ld (generation),a       ; clear generations

        ; initilize screen
        call cls                ; clear/expand screen
        call clear_buffer

        ; loop through screen, creating random life
        ld hl,(d_file)          ; get screen start
        ld bc,1+33
        add hl,bc               ; skip a row+1

        ; loop through rows
        ld c,22
l_xlp:
        inc hl                  ; skip first char

        ; loop through cols
        ld b,30
l_ylp:
        ld (hl),$80             ; there is life!
        call rnd                ; is there life?
        jr c,l_skip             ; skip on carry
        ld (hl),$00             ; there is life!

l_skip:
        inc hl                  ; skip to next col
        djnz l_ylp              ; next y

        inc hl                  ; skip last char
        inc hl                  ; skip CR
        dec c
        jr nz,l_xlp             ; next x

        ret
; end initilize
; ---

; +++
; Live or die
live_or_die:

        ; increment generation
        ld a,(generation)
        inc a
        ld (generation),a

        ; loop through screen, creating random life
        ld hl,buffer            ; get buffer location
        ld bc,33
        add hl,bc               ; skip a row
        ex de,hl                ; put buffer location into de
        ld hl,(d_file)          ; get screen start
        ld bc,34
        add hl,bc               ; skip a row+1

        ; loop through rows
        ld c,21                 ; 1-22
lod_xlp:
        inc hl                  ; skip first char
        inc de                  ; skip first char

        ; loop through cols (2-31)
        ld b,30
lod_ylp:
        push bc                 ; save vars
        push de
        push hl

        ; count life around location
        ld c,0                  ; reset counter

        dec hl                  ; move to x,y-1
        call count_life
        inc hl
        inc hl                  ; move to x,y+1
        call count_life

        ld de,33+2
        and a                   ; clear carry
        sbc hl,de               ; move to x-1,y-1
        call count_life
        inc hl                  ; move to x-1,y
        call count_life
        inc hl                  ; move to x+1,y
        call count_life

        ld de,33+31
        add hl,de               ; move to x+1,y-1
        call count_life
        inc hl                  ; move to x+1,y
        call count_life
        inc hl                  ; move to x+1,y+1
        call count_life

        pop hl                  ; restore hl & de
        pop de
        ld a,(hl)
        or a                    ; check if cell alive or dead
        ld a,c                  ; move count to a
        jr z,lod_empty          ; is empty, skip ahead

        ; check if dies (c<>2 and c<>3)
        cp 2                    ; check if 2
        jr z,lod_alive          ; is 2, stays alive!
        cp 3                    ; check if 3
        jr z,lod_alive          ; is 3, stays alive!
        xor a                   ; cell dies
        jr lod_skip             ; done

lod_empty:
        ; check if lives
        cp 3                    ; check if 3
        ld a,0                  ; assume empty cell
        jr nz,lod_skip          ; not 3, skip ahead
lod_alive:
        ld a,$80                ; yes, cell is born

lod_skip:
        ld (de),a               ; load new cell in buffer

        pop bc
        inc de                  ; next char
        inc hl                  ; next char
        djnz lod_ylp            ; next y

        inc de                  ; skip last char
        inc de                  ; skip CR
        inc hl                  ; skip last char
        inc hl                  ; skip CR
        dec c
        jr nz,lod_xlp           ; next x

        ret

count_life:
        ld a,(hl)               ; get cell
        or a                    ; is it alive?
        ret z                   ; no, return
        inc c                   ; yes, then increment count
        ret

; end life or die
; ---

; +++
; Copy to screen
copy_to_screen:

        ; copy buffer to screen
        ld hl,(d_file)  ; get display
        inc hl
        ex de,hl        ; put display (to) into de
        ld hl,buffer    ; get buffer location
        ld bc,33*buffer_size
        ldir            ; load buffer on screen!

        ret
; end copy_to_screen
; ---

; +++
; Clear buffer from display
;
clear_buffer:
        ld de,buffer    ; load buffer (to) into de
        ld hl,(d_file)  ; load display (from) into hl
        inc hl          ; skip to first character
        ld bc,33*buffer_size 
        ldir            ; clear buffer from screen
        ret
; end clear buffer
; ---

; +++
;
; Binary Random
;
; out:          a       = a number between 0 and 255
; On return: C = 0, NC = 1
; preserves:    bc,de,hl
; destroys:     af
;

rnd:    ; random routine with refresh
        push hl                 ; preserve hl
rnd_val:
        ld hl,0                 ; seed value
        ld a,r                  ; grab the refresh register
        add a,l                 ; add msb of seed (l)
        ld l,a                  ; and save it as the new value
        ld a,r                  ; grab the refresh register again
        add a,h                 ; add lsb of seed (h)
        and $1f                 ; mask it to stay in ZX81 ROM (lower 8K)
        ld h,a                  ; set pointer back within ROM
        ld (rnd_val+1),hl       ; save current pointer (self modifying code!!!)

        ld a,(hl)		; get value in ROM
        pop hl                  ; restore hl
        cp 33                  ; will set C if > 33
        ret			; back to mainprogram
; end random
;
; ---

; +++
; Get Key
;
; in:           none
; out:          a       = character code of pressed key
; destroys:     af, bc, hl, de
;
get_key:
        ; did the player make a move?
        xor a                   ; clear a
        ld bc,(last_k)          ; get key information
        inc c                   ; Test if NOKEY pressed
        ret z                   ; nope, return

        dec c                   ; restore c
        call findchar           ; yep, grab character pressed
        ld a,(hl)

        ret                     ; return
; end get move
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
; Will end if generation hits 100

delay_count: dw $0000
delay_and_test:
        ld a,(generation)       ; get generation
        cp 100                  ; is it 100?
        ret nc                  ; yes, return

        ld hl,100               ; time to delay
delay:
        ld (delay_count),hl     ; save delay

        call check_break        ; pressed break?
        call get_key            ; pressed a key?
        or a
        ret nz                  ; yes, return early

        ; check if done
        ld hl,(delay_count)     ; grab what to test
        dec hl                  ; subtract 1
        ld a,h                  ; check if done
        or l
        jr nz,delay             ; not zero, keep going!

        ret                     ; pause is done!

; end delay and test
; ---

;
; end routines
;
; * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
;
; Variables
;

; life information
generation:     db _0_
buffer_size:    equ 24
buffer:         defs 33*buffer_size


;
; end variables
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