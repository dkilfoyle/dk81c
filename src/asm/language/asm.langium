grammar Asm

entry Program:
    EOL* (lines+=Line (EOL|EOF))*;

Line:
    (label=Label? (instruction=Instruction | directive=Directive) comment=COMMENT?)|
    (label=Label comment=COMMENT?) |
    (comment=COMMENT);


Instruction:
    opcode=OPCODE expressionList=ExpressionList?;

Label:
    name=ID ":"?;

Directive:
    directive=ASSEMBLER_DIRECTIVE expressionList=ExpressionList;

ExpressionList:
    expressions+=Expression ("," expressions+=Expression)*;

Expression:
    BinaryExpression;

infix BinaryExpression on Argument:
    '*' | '/'
    > '+' | '-';

Argument infers Expression:
    condition=JUMPCONDITION |
    immediate=NUMBER |
    register=REGISTER |
    label=[Label:ID] |
    dollar="$" |
    string=STRING |
    "(" paren=Expression ")";



JUMPCONDITION returns string:
    'NC'|
    'NZ'|
    'Z'|
    'M'| 
    'PE'| 
    'PO'|
    'P';

REGISTER returns string:
    'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'H'
    | 'L'
    | 'I'
    | 'R'
    | 'IXH'
    | 'IXL'
    | 'IYH'
    | 'IYL'
    | 'AF'
    | 'BC'
    | 'DE'
    | 'HL'
    | 'PC'
    | 'SP'
    | 'IX'
    | 'IY'
;

ASSEMBLER_DIRECTIVE returns string:
    'ORG'
    | 'END'
    | 'EQU'
    | 'DEFB'
    | 'DB'
    | 'DEFW'
    | 'DW'
    | 'DEFS'
    | 'DS'
    | 'IF'
    | 'ENDIF'
    | 'SET'
;

OPCODE returns string:
    'ADC'
    | 'ADD'
    | 'AND'
    | 'BIT'
    | 'CALL'
    | 'CCF'
    | 'CP'
    | 'CPD'
    | 'CPDR'
    | 'CPIR'
    | 'CPI'
    | 'CPL'
    | 'DAA'
    | 'DEC'
    | 'DI'
    | 'DJNZ'
    | 'EXX'
    | 'EX'
    | 'EI'
    | 'IM'
    | 'IN'
    | 'INC'
    | 'INDR'
    | 'IND'
    | 'INIR'
    | 'INI'
    | 'JP'
    | 'JR'
    | 'LDDR'
    | 'LDD'
    | 'LD'
    | 'LDIR'
    | 'LDI'
    | 'NEG'
    | 'NOP'
    | 'OR'
    | 'OTDR'
    | 'OTIR'
    | 'OUTD'
    | 'OUTI'
    | 'OUT'
    | 'POP'
    | 'PUSH'
    | 'RES'
    | 'RETI'
    | 'RETN'
    | 'RET'
    | 'RLCA'
    | 'RLA'
    | 'RLC'
    | 'RLD'
    | 'RL'
    | 'RRCA'
    | 'RRA'
    | 'RRC'
    | 'RR'
    | 'RRD'
    | 'RST'
    | 'SBC'
    | 'SCF'
    | 'SLA'
    | 'SLL'
    | 'SRA'
    | 'SRL'
    | 'SUB'
    | 'XOR'
;

terminal ID: /[_a-zA-Z][a-zA-Z0-9._]*/;

terminal EOL: /[\r\n]+/;
terminal COMMENT: /;[^\n\r]*/;
terminal NUMBER returns number: /[\\$]?[0-9A-Fa-f]+[Hh]?/;

terminal CHARACTER: /'[ -~]'/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
hidden terminal WS: /[ \t]/;