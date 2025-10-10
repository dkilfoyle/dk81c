import type { ValidationAcceptor, ValidationChecks } from "langium";
import { type AsmAstType, Expression, Instruction, Label } from "./generated/ast.js";
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
      const toArgTemplate = (expr: Expression) => {
        if (expr.immediate) return "$IMM";
        if (expr.label) return instrName == "JR" ? "$N" : "$NN";
        if (expr.paren) return toArgTemplate(expr.paren);
        return expr.$cstNode!.text.toUpperCase();
      };
      return toArgTemplate(expr);
    });

    let curNode = opcodesLookup.get(instrName);
    if (!curNode) throw Error("AsmValidator: unknown instr: " + instrName);

    for (let i = 0; i <= args.length; i++) {
      if (i == args.length) {
        if (curNode.codes.length == 0)
          accept("error", "Missing argument " + Array.from(curNode.args.keys()).join(","), { node: instruction, property: "opcode" });
      } else {
        const nextNode: IOpcodesNode | undefined =
          args[i] == "$IMM" ? curNode.args.get("$N") || curNode.args.get("$NN") || curNode.args.get("$DD") : curNode.args.get(args[i]);
        if (!nextNode) {
          if (curNode.args.size == 0)
            accept("error", "Unexpected argument", {
              node: instruction.expressionList!.expressions[i],
            });
          else
            accept("error", "Invalid argument, expecting " + Array.from(curNode.args.keys()).join(","), {
              node: instruction.expressionList!.expressions[i],
            });
          return;
        }
        curNode = nextNode!;
      }
    }
    // const options = opcodesLookup.get(instruction.opcode.toUpperCase());
    // if (!options) throw Error();
    // const numArgs = instruction.expressionList ? instruction.expressionList.expressions.length : 0;
    // const [minArgs, maxArgs] = options!.reduce(
    //   (accum, cur) => {
    //     if (cur.args.length < accum[0]) accum[0] = cur.args.length;
    //     if (cur.args.length > accum[1]) accum[1] = cur.args.length;
    //     return accum;
    //   },
    //   [5, 0]
    // );
    // if (numArgs < minArgs || numArgs > maxArgs) {
    //   if (minArgs != maxArgs) accept("error", `Expected ${minArgs}-${maxArgs} arguments`, { node: instruction, property: "opcode" });
    //   else accept("error", `Expected ${minArgs} arguments`, { node: instruction, property: "opcode" });
    // }
    // // match arg0
    // const arg0 = instruction.expressionList?.expressions[0];
    // if (arg0) {
    //   const validArg0s = options.map((opt) => opt.args[0]).filter((x) => x).;
    //   // find arg options starting with arg0
    //   const arg0Matches = options.filter((opt) => {
    //     if (arg0.register && opt.args[0] == arg0.register) return true;
    //     if (arg0.immediate && opt.args[0].startsWith("$N")) return true;
    //     return false;
    //   });
    //   console.log("arg0 matches", arg0Matches);
    //   if (!arg0Matches.length)
    //     accept("error", "Invalid argument, expecting 1 of " + validArg0s.join(","), { node: instruction.expressionList!.expressions[0] });
    // }
  }
}
