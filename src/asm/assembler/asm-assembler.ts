import { AstNode, LangiumDocument } from "langium";
// import zx81template from "./zx81template.asm?raw";
import { Directive, Instruction, isProgram, isBinaryExpression, Program, Expression, Label } from "../language/generated/ast";
import { getInfoNodeForAstNode } from "../opcodes-z80";

export interface ILabelReference {
  filename: string;
  offset: number; // machinecode location
}

export interface ILabelInfo {
  value?: number;
  expression?: Expression;
}

class Assembler {
  labels: Record<string, ILabelInfo> = {};
  machineCode: number[] = [];
  startOffset: number = 0;
  lineAddressMap: Record<number, { start: number; size: number }> = {};
  curAddr = 0;

  constructor() {}
  reset() {
    this.labels = {};
    this.machineCode = [];
    this.startOffset = 0;
    this.lineAddressMap = {};
  }

  compileAsmToPFile(doc: LangiumDocument<AstNode>) {
    const root = doc.parseResult.value;
    this.reset();
    if (isProgram(root)) {
      this.firstPass(root);
      this.secondPass(root);
    } else throw Error();
    console.log(
      Object.entries(this.labels)
        .sort((a, b) => a[1].value! - b[1].value!)
        .map((x) => `${x[0]}: ${x[1].value}`)
    );

    for (let rowStart = 0; rowStart < this.machineCode.length; rowStart += 16) {
      console.log(
        this.machineCode
          .slice(rowStart, rowStart + 16)
          .map((x) => x.toString(16).padStart(2, "0"))
          .join(" ")
      );
    }

    return {
      labels: Object.entries(this.labels).reduce<Record<string, number>>((accum, cur) => {
        accum[cur[0]] = cur[1].value!;
        return accum;
      }, {}),
      bytes: new Uint8Array(this.machineCode),
    };
  }

  firstPass(root: Program) {
    this.curAddr = 0;
    for (const line of root.lines) {
      if (line.label) {
        if (line.directive?.directive.toUpperCase() == "EQU") this.firstPassDirective(line.directive, line.label);
        else {
          this.labels[line.label.name] = { value: this.curAddr };
        }
      }
      if (line.directive != undefined) this.firstPassDirective(line.directive);
      if (line.instruction != undefined) this.firstPassInstruction(line.instruction);
    }
  }

  firstPassDirective(directive: Directive, label?: Label) {
    switch (directive.directive.toUpperCase()) {
      case "ORG":
        this.curAddr = directive.expressionList.expressions[0].immediate!;
        break;
      case "DB":
      case "DEFB":
        this.curAddr += directive.expressionList.expressions.length;
        break;
      case "DW":
      case "DEFW":
        this.curAddr += directive.expressionList.expressions.length * 2;
        break;
      case "EQU":
        if (label) {
          this.labels[label.name] = { expression: directive.expressionList.expressions[0] };
        }
        break;
    }
  }

  firstPassInstruction(instr: Instruction) {
    const info = getInfoNodeForAstNode(instr);
    if (!info) throw Error("Unable to find info for instr " + instr.$cstNode!.text);
    if (!info.leaf) throw Error("Should be leaf node");
    this.curAddr += info.leaf.bytesTemplate.split(" ").length;
  }

  secondPass(root: Program) {
    this.curAddr = 0;
    for (const line of root.lines) {
      if (line.label != undefined) this.secondPassLabel(line.label);
      if (line.directive != undefined) this.secondPassDirective(line.directive);
      if (line.instruction != undefined) this.secondPassInstruction(line.instruction);
    }
  }

  secondPassLabel(label: Label) {
    const lblInfo = this.labels[label.name];
    if (lblInfo.expression) lblInfo.value = this.evalExpr(lblInfo.expression);
  }

  secondPassDirective(directive: Directive) {
    switch (directive.directive.toUpperCase()) {
      case "ORG":
        this.curAddr = directive.expressionList.expressions[0].immediate!;
        break;
      case "DB":
      case "DEFB":
        directive.expressionList.expressions.forEach((expr) => {
          const exprRes = this.evalExpr(expr);
          this.addByte(exprRes);
        });
        break;
      case "DW":
      case "DEFW":
        directive.expressionList.expressions.forEach((expr) => {
          const exprRes = this.evalExpr(expr);
          if (exprRes > 0xffff || exprRes < 0) throw Error("expr larger than 2 bytes");
          this.addByte(exprRes & 0xff);
          this.addByte((exprRes >> 8) & 0xff);
        });
        break;
    }
  }

  secondPassInstruction(instr: Instruction) {
    const info = getInfoNodeForAstNode(instr);
    const args = instr.expressionList?.expressions.map((expr) => {
      try {
        return this.evalExpr(expr);
      } catch {
        return undefined;
      }
    });
    if (!info) throw Error("Unable to find info for instr " + instr.$cstNode!.text);
    if (!info.leaf) throw Error("Should be leaf node");
    info.leaf.bytesTemplate.split(" ").forEach((b) => {
      switch (b) {
        case "$1":
          if (!args) throw Error("instr info args mismatch");
          this.addByte(args[0]);
          break;
        case "$1l":
          if (!args) throw Error("instr info args mismatch");
          this.addByteLo(args[0]);
          break;
        case "$1h":
          if (!args) throw Error("instr info args mismatch");
          this.addByteHi(args[0]);
          break;
        case "$1s":
          if (!args) throw Error("instr info args mismatch");
          this.addByteSigned(args[0]);
          break;
        case "$2":
          if (!args) throw Error("instr info args mismatch");
          this.addByte(args[1]);
          break;
        case "$2l":
          if (!args) throw Error("instr info args mismatch");
          this.addByteLo(args[1]);
          break;
        case "$2h":
          if (!args) throw Error("instr info args mismatch");
          this.addByteHi(args[1]);
          break;
        case "$2s":
          if (!args) throw Error("instr info args mismatch");
          this.addByteSigned(args[1]);
          break;
        default:
          this.addByte(parseInt(b, 16));
      }
    });
  }

  evalExpr(expr: Expression): number {
    if (isBinaryExpression(expr)) {
      const left = this.evalExpr(expr.left);
      const right = this.evalExpr(expr.right);
      switch (expr.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return left / right;
        default:
          throw Error();
      }
    } else {
      switch (true) {
        case expr.immediate != undefined:
          return expr.immediate!;
        case expr.label != undefined: {
          const lblInfo = this.labels[expr.label.$refText];
          if (lblInfo.value != undefined) return lblInfo.value;
          if (lblInfo.expression != undefined) return this.evalExpr(lblInfo.expression);
          throw Error("Lblinfo has neither localaddress or expression " + expr.label.$refText);
        }
        default:
          throw Error("Unevaluable expression");
      }
    }
  }

  addByteLo(b?: number) {
    if (b == undefined) throw Error("adding undefined byte");
    this.addByte(b & 0xff);
  }

  addByteHi(b?: number) {
    if (b == undefined) throw Error("adding undefined byte");
    this.addByte((b >> 8) & 0xff);
  }

  addByteSigned(b?: number) {
    if (b == undefined) throw Error("adding undefined byte");
    this.addByte(~b + 1);
  }

  addByte(b?: number) {
    if (b == undefined) throw Error("adding undefined byte");
    if (b > 255) throw Error("add byte out of range");
    if (b < 0) throw Error("add byte out of range");
    this.machineCode.push(b & 0xff);
    this.curAddr++;
  }
}

export const assembler = new Assembler();
