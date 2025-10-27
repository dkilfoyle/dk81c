import type { ValidationAcceptor, ValidationChecks } from "langium";
import { type AsmAstType, Expression, Instruction, isBinaryExpression, Label } from "./generated/ast.js";
import type { AsmServices } from "./asm-module.js";
import { userPreferences } from "./asm-userpreferences.js";
import { IOpcodesNode, opcodesLookup } from "../opcodes-z80.js";

console.log(opcodesLookup);

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: AsmServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.AsmValidator;
  const checks: ValidationChecks<AsmAstType> = {
    Label: validator.checkLabelSize,
    Instruction: validator.checkInstructionArgs,
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class AsmValidator {
  checkLabelSize(label: Label, accept: ValidationAcceptor): void {
    if (label.name.length > userPreferences.syntax.maxLabelSize)
      accept("warning", `Label longer than recommended length (${userPreferences.syntax.maxLabelSize})`, { node: label, property: "name" });
  }
  checkInstructionArgs(instruction: Instruction, accept: ValidationAcceptor) {
    const instrName = instruction.opcode.toUpperCase();
    const args = (instruction.expressionList?.expressions || []).map((expr) => {
      const toArgTemplate = (expr: Expression): string => {
        if (isBinaryExpression(expr)) {
          const left = expr.left.$cstNode!.text;
          if (left == "IX" || left == "IY") return left + "+DD";
          return "$NN";
        }
        if (expr.immediate != undefined) return "$IMM";
        if (expr.label) return ["JR", "DJNZ"].includes(instrName) ? "$E" : "$NN";
        if (expr.paren) return "(" + toArgTemplate(expr.paren) + ")";
        return expr.$cstNode!.text.toUpperCase();
      };
      return toArgTemplate(expr);
    });

    let curNode = opcodesLookup.get(instrName);
    if (!curNode) throw Error("AsmValidator: unknown instr: " + instrName);

    for (let i = 0; i <= args.length; i++) {
      if (i == args.length) {
        if (curNode.codes.length == 0)
          // check for not enough arms
          accept("error", "Missing argument " + Array.from(curNode.args.keys()).join(","), { node: instruction, property: "opcode" });
      } else {
        const expr = instruction.expressionList!.expressions[i];
        const nextNode: IOpcodesNode | undefined =
          args[i] == "$IMM"
            ? curNode.args.get("$N") || curNode.args.get("$NN") || curNode.args.get("$E") || curNode.args.get("$D")
            : curNode.args.get(args[i]);
        if (!nextNode) {
          // either too many args
          if (curNode.args.size == 0)
            accept("error", "Unexpected argument", {
              node: expr,
            });
          else
            // or invalid argument type (ast != template)
            accept("error", "Invalid argument, expecting " + Array.from(curNode.args.keys()).join(","), {
              node: expr,
            });
          return;
        } else {
          // check for out of range
          if (args[i] == "$IMM") {
            if (curNode.args.get("$N"))
              if (expr.immediate! < 0 || expr.immediate! > 255) accept("error", "Immediate value out of range 0-255", { node: expr });
            if (curNode.args.get("$NN"))
              if (expr.immediate! < 0 || expr.immediate! > 65535) accept("error", "Immediate value out of range 0-65535", { node: expr });
            if (curNode.args.get("$E"))
              if (expr.immediate! < -126 || expr.immediate! > 129) accept("error", "Immediate value out of range -126-129", { node: expr });
          }
          if (args[i] == "(IX+DD" || args[i] == "(IY+DD)")
            if (isBinaryExpression(expr.paren) && expr.paren.right.immediate != undefined) {
              if (expr.paren.right.immediate < -128 || expr.immediate! > 128)
                accept("error", "Immediate value out of range -128-127", { node: expr });
            }
        }
        curNode = nextNode!;
      }
    }
  }
}
