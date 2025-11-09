call 

;         LD A,1      ; start with 1
; loop:                       ; label used for jump
;         RST $10     ; PRINT
;         INC A       ; increment A
;         CP 36       ; stop at 36
;         JP NZ,loop  ; if not 36, then goto/jump to LOOP
;         RET         ; Return to BASIC
