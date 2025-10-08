grammar Asm

entry Program:
    (lines+=Line (EOL+ | EOF))*;

Line:
    label=Label? (instruction=Instruction | directive=Directive) comment=COMMENT? |
    label=Label comment=COMMENT? |
    comment=COMMENT;

Label:
    name=ID ":";

Instruction:
    opcode=OPCODE expressionList=ExpressionList?;

Directive:
    name=ID? directive=ASSEMBLER_DIRECTIVE expressionList=ExpressionList;

ExpressionList:
    expressions+=Expression ("," expressions+=Expression)*;

Expression:
    BinaryExpression;

infix BinaryExpression on Argument:
    '*' | '/'
    > '+' | '-';

Argument infers Expression:
    immediate=NUMBER |
    register=REGISTER |
    label=[Label:ID] |
    dollar="$" |
    string=STRING |
    "(" paren=Expression ")";

terminal ID: /[_a-zA-Z$][a-zA-Z0-9._]*/;

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
    | 'DEFW'
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
    | 'CPI'
    | 'CPIR'
    | 'CPL'
    | 'DAA'
    | 'DEC'
    | 'DI'
    | 'DJNZ'
    | 'EI'
    | 'EX'
    | 'EXX'
    | 'IM'
    | 'IN'
    | 'INC'
    | 'IND'
    | 'INDR'
    | 'INI'
    | 'INIR'
    | 'JP'
    | 'JR'
    | 'LD'
    | 'LDD'
    | 'LDDR'
    | 'LDI'
    | 'LDIR'
    | 'NEG'
    | 'NOP'
    | 'OR'
    | 'OTDR'
    | 'OTIR'
    | 'OUT'
    | 'OUTD'
    | 'OUTI'
    | 'POP'
    | 'PUSH'
    | 'RES'
    | 'RET'
    | 'RETI'
    | 'RETN'
    | 'RL'
    | 'RLA'
    | 'RLC'
    | 'RLCA'
    | 'RLD'
    | 'RR'
    | 'RRA'
    | 'RRC'
    | 'RRCA'
    | 'RRD'
    | 'RST'
    | 'SBC'
    | 'SCF'
    | 'SLA'
    | 'SLL'
    | 'SL1'
    | 'SRA'
    | 'SRL'
    | 'SUB'
    | 'XOR'
;

terminal EOL: /[\r\n]+/;
terminal COMMENT: /;[^\n\r]*/;
terminal NUMBER returns number: /[\\-]?[0-9][0-9a-fA-F]*[h]?/;
terminal CHARACTER: /'[ -~]'/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
hidden terminal WS: /[ \t]/;