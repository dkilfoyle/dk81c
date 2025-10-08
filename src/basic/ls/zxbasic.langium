grammar Zxbasic

entry Model:
    (lines+=Line (EOL+ | EOF))*;

Line:
    name=LineNum statement=StatementAny;

LineNum returns string: INTEGER;

StatementAny:
    StatementRem |
    StatementSimple |
    StatementJump |
    StatementPrint |
    StatementIf |
    StatementNext | 
    StatementDecl;

StatementSimple:
    Statement0 | Statement01 | Statement1 | Statement2;

StatementRem:
    command=REM;

Statement0 infers StatementSimple: // Statements with zero args
    command=("CLEAR"|"CLS"|"CONT"|"COPY"|"FAST"|"RETURN"|"SCROLL"|"SLOW"|"STOP");

Statement01 infers StatementSimple: // Statmenets with zero or 1 args
    command=("RAND"|"RUN") args+=Expression?;

Statement1 infers StatementSimple: // Statements with exactly 1 arg
    command="PAUSE" args+=Expression;

Statement2 infers StatementSimple: // Statements with exactly 2 args
    command=("POKE"|"PLOT"|"UNPLOT") args+=Expression "," args+=Expression;

StatementJump:
    command=("GOSUB"|"GOTO") (destLine=[Line] | destExpr=Expression);

// declarations

StatementDecl:
    StatementDim |
    StatementLet |
    StatementInput |
    StatementFor;

StatementDim:
    command="DIM" name=(NUMID|STRID) ArraySize?;

StatementLet:
    command="LET" name=(NUMID|STRID) ArrayIndexing? "=" value=Expression;

StatementInput:
    command="INPUT" name=(NUMID|STRID) ArrayIndexing?;

StatementFor:
    command="FOR" name=NUMID "=" from=Expression "TO" to=Expression ("STEP" step=Expression)?;

fragment ArraySize:
    "(" dims+=Expression ("," dims+=Expression)* ")";

// control flow

StatementNext:
    command="NEXT" varname=[StatementFor:NUMID];

StatementIf:
    command="IF" test=Expression "THEN" thenStatement=StatementAny;

// print

StatementPrint: // Console statements
    command=("LPRINT"|"PRINT") (args+=PrintItem (args+=(","|";")* args+=PrintItem)*)* args+=(";"|",")*;

PrintItem:
    Expression | PrintAt | PrintTab;

PrintAt:
    command=("AT") args+=Expression "," args+=Expression;

PrintTab:
    command="TAB" args+=Expression;

// Expressions

StringSlicer:
    "(" from=Expression? "TO" to=Expression? ")";

fragment ArrayIndexing:
    ("(" indices+=Expression ("," indices+=Expression)* ")")+;

StringVariable:
    varname=[StatementDecl:STRID] ArrayIndexing? slicer=StringSlicer?;

NumericVariable:
    varname=[StatementDecl:NUMID] ArrayIndexing?;

NumericLiteral:
    value=(INTEGER|FLOAT);

StringLiteral:
    value=RAWSTRING;

Expression:
    BinaryExpression;

infix BinaryExpression on Unary:
    '**'
    > '*' | '/'
    > '+' | '-'
    > ">="|"<="|"<>"|"<"|">"|"="
    > "AND"|"OR";

// Binary infers Expression:
    // Unary ({infer BinaryExpression.left=current} op=("="|"+"|"-"|">="|"<="|"<>"|"**"|"*"|"/"|"<"|">"|"OR"|"AND") right=Unary)*;

Unary infers Expression:
    {infer UnaryExpression}  op=("+"|"-"|"ABS"|"ACS"|"ASN"|"ATN"|"CHR$"|"COS"|"EXP"|"INT"|"LN"|"NOT"|"PEEK"|"SGN"|"SIN"|"SQR"|"STR$"|"TAN"|"USR"|"CODE"|"LEN"|"VAL") operand=Primary
    | Primary;

Primary infers Expression:
    ParenExpression |
    NumericLiteral |
    StringLiteral |
    SysFunctionCall |
    NumericVariable |
    StringVariable;

ParenExpression:
    "(" operand=Expression ")";

SysFunctionCall:
    command=("RND"|"PI"|"INKEY$");

terminal EOL: /[\r\n]+/;
hidden terminal WS: /[ \t]+/;
// terminal FORID: /[A-Z]\b/; do semantic checking for FOR that NUMID is single A-Z
// terminal REM: /REM .+?(?=\n)/;
terminal REM: /REM [^\n\r]*/;
hidden terminal COMMENT: /#[^\n\r]*/;
terminal STRID: /[A-Z]\$/;
terminal NUMID: /[A-Z][A-Z0-9]*/;
terminal LABELID: /[a-z][a-z0-9]*/;
terminal FLOAT returns number: /[0-9]+\.[0-9]+/;
terminal INTEGER returns number: /[0-9]+(?!\.)/;
terminal RAWSTRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
// terminal RAWSTRING: '"' -> '"';

// hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
// terminal SL_COMMENT: /\#[^\n\r]*/;
