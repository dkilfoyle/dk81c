import { AstNode, LangiumDocument } from "langium";
// import zx81template from "./zx81template.asm?raw";
import { Directive, Instruction, isProgram, isBinaryExpression, Program, Expression } from "../language/generated/ast";
import { getInfoNodeForAstNode } from "../opcodes-z80";

export interface ILabelReference {
  filename: string;
  offset: number; // machinecode location
}

export interface ILabelInfo {
  name: string;
  localAddress: number;
  references: ILabelReference[];
}

export class Assembler {
  labels: Record<string, ILabelInfo> = {};
  constants: Record<string, number> = {};
  machineCode: number[] = [];
  startOffset: number = 0;
  lineAddressMap: Record<number, { start: number; size: number }> = {};
  curAddr = 0;

  constructor() {}
  reset() {
    this.labels = {};
    this.constants = {};
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
  }

  firstPass(root: Program) {
    this.curAddr = 0;
    for (const line of root.lines) {
      switch (true) {
        case line.label != undefined:
          this.labels[line.label.name] = {
            name: line.label.name,
            localAddress: this.curAddr,
            references: [],
          };
          break;
        case line.directive != undefined:
          this.firstPassDirective(line.directive);
          break;
        case line.instruction != undefined:
          this.firstPassInstruction(line.instruction);
          break;
      }
    }
  }

  firstPassDirective(directive: Directive) {
    switch (directive.directive.toUpperCase()) {
      case "ORG":
        this.curAddr = directive.expressionList.expressions[0].immediate!;
        break;
      case "DB":
      case "DEFB":
        this.curAddr++;
        break;
      case "DW":
      case "DEFW":
        this.curAddr += 2;
        break;
    }
  }

  firstPassInstruction(instr: Instruction) {
    const info = getInfoNodeForAstNode(instr);
    if (!info) throw Error("Unable to find info for instr " + instr.$cstNode!.text);
    if (!info.leaf) throw Error("Should be leaf node");
    return info.leaf.bytesTemplate.split(" ");
  }

  secondPass(root: Program) {
    this.curAddr = 0;
    for (const line of root.lines) {
      if (line.directive != undefined) this.secondPassDirective(line.directive);
      if (line.instruction != undefined) this.secondPassInstruction(line.instruction);
    }
    console.log(this);
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
    if (!info) throw Error("Unable to find info for instr " + instr.$cstNode!.text);
    if (!info.leaf) throw Error("Should be leaf node");
    info.leaf.bytesTemplate.split(" ").forEach((b) => {
      // switch (b) {
      //   case ""
      // }
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
        case expr.label != undefined:
          return this.labels[expr.label.$refText].localAddress;
        case expr.constant != undefined:
          return this.constants[expr.constant.$refText];
        default:
          throw Error("Expression type not supported yet");
      }
    }
  }

  addByte(b: number) {
    if (b > 255) throw Error("add byte out of range");
    if (b < 0) throw Error("add byte out of range");
    this.machineCode.push(b & 0xff);
    this.curAddr++;
  }
}
