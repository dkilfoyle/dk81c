## DK81

Zx81 emulator with simple IDE to develop and run code in ZXBasic, Z80ASM or (eventually) SmallC

## Acknowledgements

https://github.com/lkesteloot/trs80 - z80 test code
https://github.com/floooh/chips - decoder dsl
https://weggetjes.nl/jszeddy/jszeddy.html - screen syncing code
https://github.com/maziac/zx81-bastop - convert basic to p file
https://www.ticalc.org/archives/files/fileinfo/17/1702.html - zcc 0.96
https://github.com/tomwhite/zx81-not-only-30-programs - not only 30 programs source
https://perfectlynormalsite.com/zx81qstart.html - template for assembling z80 asm to p file
https://langium.org/
https://github.com/TypeFox/typir

## TODO

- Basic
  - [x] Graphic characters
  - [ ] Labels instead of line nummbers
  - [x] Typir type checking
  - [x] P-file compiler
- ASM
  - [x] Langium parser
  - [ ] Language server
    - [ ] Validation
    - [ ] Completion
    - [ ] Documentation
  - [ ] Compiler
  - [ ] Linker
  - [ ] Std lib
- C - Implement ZCC
  - [ ] Langium parser
  - [ ] Compiler
  - [ ] Std lib (https://sam.speccy.cz/asm/z80_asm_subroutines.pdf)
  - [ ] Optimiser
- Reimplement as monaco ide
  - [ ] C and ASM Debugger
