import {
  BinaryExpression,
  Expression,
  isBinaryExpression,
  isExpression,
  isNumericLiteral,
  isNumericVariable,
  isParenExpression,
  isPrintAt,
  isPrintTab,
  isStatementDim,
  isStatementFor,
  isStatementIf,
  isStatementInput,
  isStatementJump,
  isStatementLet,
  isStatementNext,
  isStatementPrint,
  isStatementRem,
  isStatementSimple,
  isStringLiteral,
  isStringVariable,
  isSysFunctionCall,
  isUnaryExpression,
  Line,
  Model,
  NumericLiteral,
  NumericVariable,
  ParenExpression,
  PrintItem,
  StatementAny,
  StatementDim,
  StatementFor,
  StatementIf,
  StatementInput,
  StatementJump,
  StatementLet,
  StatementNext,
  StatementPrint,
  StatementRem,
  StatementSimple,
  StringLiteral,
  StringVariable,
  SysFunctionCall,
  UnaryExpression,
} from "../ls/generated/ast";
import { tokenCodes } from "./tokens";

// basic line
// 2 byte line number lo hi
// 2 byte length of text including NL hi lo (exclude line number and length)
// text as basic tokens
// NL

// numeric constant
// number tokens (?) FP or INT 5 byte number

// basic vars
// first byte = bits 5-7 type, bits 1-4 first char

// numeric variabl
// 1 byte: variable name

// number 5 bytes
// integral
// 1 byte: 0
// 1 byte: 0 if positive, 0xff if negative
// 2 bytes: little-endian unsigned integer from 0 to 65535. x-65536 if negative
// 1 byte: 0
// floating-point:
// 1 byte: exponent + 128
// r bytes big-endian mantissa
// MSB of mantissa must be 1, then over-writen for 0 pos, 1 neg

export class Basic {
  values: number[] = [];
  bytes: Uint8Array;
  constructor() {
    this.bytes = new Uint8Array();
  }
  // compileIntegerLiteral(x: IntegerLiteral, sign = "positive") {
  //   // integer is 0..65535 +/-
  //   return [0, sign == "positive" ? 0 : 0xff, x >> 8, x && 0xff, 0];
  // }
  encodeNumber(x: number) {
    if (x == 0) return [0, 0, 0, 0, 0];
    const exponent = Math.floor(Math.log(x) / Math.log(2));
    if (exponent < -129 || exponent > 126) throw "Can't convert to a ZX81 (float) number.";

    const m1 = (x / Math.pow(2, exponent) - 1) * 0x80000000;
    const mantissa = Math.floor(m1 + 0.5);

    return [
      exponent + 129, // Must be positive
      (mantissa >> 24) & 0x7f,
      (mantissa >> 16) & 0xff,
      (mantissa >> 8) & 0xff,
      mantissa & 0xff,
    ];
  }

  encodeText(x: string) {
    let i = 0;
    const codes: number[] = [];
    let inverse = false;
    while (i < x.length) {
      const c = x[i];
      if (c == "%") {
        inverse = true;
        i++;
      } else if (c == "\\") {
        const cn = x[i + 1];
        if (cn == '"') {
          codes.push(11 + (inverse ? 0x80 : 0));
          inverse = false;
          i += 2;
        } else {
          codes.push(tokenCodes[`g${x.slice(i + 1, i + 3)}`]);
          i += 3;
        }
      } else {
        codes.push(tokenCodes[c] + (inverse ? 0x80 : 0));
        inverse = false;
        i++;
      }
    }
    return codes;
  }

  encodeNumericLiteral(x: number) {
    return [...this.encodeText(x.toString(10)), 0x7e, ...this.encodeNumber(x)];
  }

  compileVarTableNumeric(name: string, value: number) {
    if (name.length == 1) {
      return [(0b011 << 5) | (name.charCodeAt(0) & 0x1f), ...this.encodeNumber(value)];
    }

    // multichar name
    const nameBytes = [
      (0b101 << 5) | (tokenCodes[name.charAt(0)] & 0x1f), // todo should actually be ascii
      ...this.encodeText(name.slice(1)),
    ];
    nameBytes[nameBytes.length - 1] = nameBytes[nameBytes.length - 1] | 0x80;
    return [...nameBytes, ...this.encodeNumber(value)];
  }

  compileVarTableString(name: string, value: string) {
    return [(0b010 << 5) | (tokenCodes[name.charAt(0)] & 0x1f), value.length & 0xff, value.length >> 8, ...this.encodeText(value)];
  }

  compileModel(model: Model) {
    this.values = [];
    model.lines.forEach((line) => this.compileLine(line));
    this.bytes = new Uint8Array(this.values);
  }

  compileLine(line: Line) {
    // 2 byte big endian line number
    this.values.push((line.name >> 8) & 0xff);
    this.values.push(line.name & 0xff);

    // little endian 2 byte line length including NL
    const lengthPos = this.values.length;
    this.values.push(0);
    this.values.push(0);

    this.compileStatement(line.statement);

    const length = this.values.length - (lengthPos + 1);
    this.values[lengthPos] = length & 0xff;
    this.values[lengthPos + 1] = (length >> 8) & 0xff;

    this.values.push(0x76); // NL

    // console.log(`Compiled line: ${line.$cstNode?.text}`);
    // console.log(
    //   this.values
    //     .slice(lengthPos - 2)
    //     .map((x) => x.toString(16).padStart(2, "0"))
    //     .join(" ")
    // );
  }

  // 110 LET D$="SUNMONTUEWEDTHUFRISAT"
  // 00 6E 1C 00 F1 29 0D 14 0B 38 3A 33 32 34 33 39

  compileStatement(statement: StatementAny) {
    switch (true) {
      case isStatementSimple(statement):
        this.compileSimple(statement);
        break;
      case isStatementJump(statement):
        this.compileJump(statement);
        break;
      case isStatementLet(statement):
        this.compileLet(statement);
        break;
      case isStatementDim(statement):
        this.compileDim(statement);
        break;
      case isStatementInput(statement):
        this.compileInput(statement);
        break;
      case isStatementFor(statement):
        this.compileFor(statement);
        break;
      case isStatementNext(statement):
        this.compileNext(statement);
        break;
      case isStatementIf(statement):
        this.compileIf(statement);
        break;
      case isStatementPrint(statement):
        this.compilePrint(statement);
        break;
      case isStatementRem(statement):
        this.compileRem(statement);
        break;
      default:
        // console.log(`Compiler unknown statement ${statement.$type}`);
        throw Error(`Compiler unknown statement`);
    }
  }

  compileRem(statement: StatementRem) {
    this.values.push(tokenCodes["REM"]);
    this.values.push(...this.encodeText(statement.command.slice(4)));
  }

  compileExpressionList(args: Expression[], brackets = false) {
    if (brackets) this.values.push(tokenCodes["("]);
    for (let i = 0; i < args.length; i++) {
      this.compileExpression(args[i]);
      if (i < args.length - 1) this.values.push(tokenCodes[","]);
    }
    if (brackets) this.values.push(tokenCodes[")"]);
  }

  compileSimple(statement: StatementSimple) {
    this.values.push(tokenCodes[statement.command]);
    this.compileExpressionList(statement.args, false);
  }

  compileJump(statement: StatementJump) {
    this.values.push(tokenCodes[statement.command]);
    if (statement.destLine) this.values.push(...this.encodeNumericLiteral(parseInt(statement.destLine.$refText)));
    else if (statement.destExpr) this.compileExpression(statement.destExpr);
  }

  compileIf(statement: StatementIf) {
    this.values.push(tokenCodes[statement.command]);
    this.compileExpression(statement.test);
    this.values.push(tokenCodes["THEN"]);
    this.compileStatement(statement.thenStatement);
  }

  compileFor(statement: StatementFor) {
    this.values.push(tokenCodes[statement.command]);
    this.values.push(...this.encodeText(statement.name));
    this.values.push(tokenCodes["="]);
    this.compileExpression(statement.from);
    this.values.push(tokenCodes["TO"]);
    this.compileExpression(statement.to);
    if (statement.step) {
      this.values.push(tokenCodes["STEP"]);
      this.compileExpression(statement.step);
    }
  }

  compileNext(statement: StatementNext) {
    this.values.push(tokenCodes[statement.command]);
    this.values.push(...this.encodeText(statement.varname.$refText));
  }

  compileDim(statement: StatementDim) {
    this.values.push(tokenCodes[statement.command]);
    this.values.push(...this.encodeText(statement.name));
    this.compileExpressionList(statement.dims, true);
  }

  compileLet(statement: StatementLet) {
    this.values.push(tokenCodes[statement.command]);
    this.values.push(...this.encodeText(statement.name));
    if (statement.indices.length > 0) this.compileExpressionList(statement.indices, true);
    this.values.push(tokenCodes["="]);
    if (isExpression(statement.value)) this.compileExpression(statement.value);
  }

  compileInput(statement: StatementInput) {
    this.values.push(tokenCodes[statement.command]);
    this.values.push(...this.encodeText(statement.name));
    if (statement.indices.length > 0) this.compileExpressionList(statement.indices, true);
  }

  compilePrint(statement: StatementPrint) {
    this.values.push(tokenCodes[statement.command]);
    statement.args.forEach((arg) => this.compilePrintItem(arg));
  }

  compilePrintItem(item: PrintItem | ";" | ",") {
    switch (true) {
      case item == ";":
      case item == ",":
        this.values.push(tokenCodes[item]);
        return;
      case isExpression(item):
        this.compileExpression(item);
        return;
      case isPrintAt(item):
      case isPrintTab(item): {
        this.values.push(tokenCodes[item.command]);
        this.compileExpressionList(item.args, false);
        return;
      }
    }
  }

  compileExpression(arg: Expression) {
    switch (true) {
      case isBinaryExpression(arg):
        this.compileBinaryExpression(arg);
        break;
      case isParenExpression(arg):
        this.compileParenExpression(arg);
        break;
      case isNumericLiteral(arg):
        this.compileNumericLiteral(arg);
        break;
      case isUnaryExpression(arg):
        this.compileUnaryExpression(arg);
        break;
      case isSysFunctionCall(arg):
        this.compileSysFunctionCall(arg);
        break;
      case isNumericVariable(arg):
        this.compileNumericVariable(arg);
        break;
      case isStringLiteral(arg):
        this.compileStringLiteral(arg);
        break;
      case isStringVariable(arg):
        this.compileStringVariable(arg);
        break;
      default:
        throw Error(`Compiler: unknown expression`);
    }
  }

  compileBinaryExpression(arg: BinaryExpression) {
    this.compileExpression(arg.left);
    this.values.push(tokenCodes[arg.operator]);
    this.compileExpression(arg.right);
  }

  compileUnaryExpression(arg: UnaryExpression) {
    this.values.push(tokenCodes[arg.op]);
    this.compileExpression(arg.operand);
  }

  compileParenExpression(arg: ParenExpression) {
    this.values.push(tokenCodes["("]);
    this.compileExpression(arg.operand);
    this.values.push(tokenCodes[")"]);
  }

  compileNumericVariable(arg: NumericVariable) {
    this.values.push(...this.encodeText(arg.varname.$refText));
    if (arg.indices.length > 0) {
      this.values.push(tokenCodes["("]);
      for (let i = 0; i < arg.indices.length; i++) {
        this.compileExpression(arg.indices[i]);
        if (i != arg.indices.length - 1) this.values.push(tokenCodes[","]);
      }
      this.values.push(tokenCodes[")"]);
    }
  }

  compileNumericLiteral(arg: NumericLiteral) {
    this.values.push(...this.encodeNumericLiteral(arg.value));
  }

  compileSysFunctionCall(arg: SysFunctionCall) {
    this.values.push(tokenCodes[arg.command]);
  }

  compileStringLiteral(arg: StringLiteral) {
    this.values.push(tokenCodes['"']);
    this.values.push(...this.encodeText(arg.value));
    this.values.push(tokenCodes['"']);
  }

  compileStringVariable(arg: StringVariable) {
    this.values.push(...this.encodeText(arg.varname.$refText));
    if (arg.indices.length) {
      this.values.push(tokenCodes["("]);
      for (let i = 0; i < arg.indices.length; i++) {
        this.compileExpression(arg.indices[i]);
        if (i < arg.indices.length - 1) this.values.push(tokenCodes[","]);
      }
      this.values.push(tokenCodes[")"]);
    }
    if (arg.slicer) {
      this.values.push(tokenCodes["("]);
      if (arg.slicer.from) this.compileExpression(arg.slicer.from);
      this.values.push(tokenCodes["TO"]);
      if (arg.slicer.to) this.compileExpression(arg.slicer.to);
      this.values.push(tokenCodes[")"]);
    }
  }
}
