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

d_file:
