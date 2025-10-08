import type { ValidationAcceptor, ValidationChecks } from "langium";
import { type ZxbasicAstType, type StringLiteral } from "./generated/ast.js";
import type { ZxbasicServices } from "./zxbasic-module.js";
import { tokenCodes } from "../compiler/tokens.js";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ZxbasicServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.ZxbasicValidator;
  const checks: ValidationChecks<ZxbasicAstType> = {
    StringLiteral: validator.checkValidStringTokens,
    // Model: validator.checkValidJumpDest
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ZxbasicValidator {
  checkValidStringTokens(strlit: StringLiteral, accept: ValidationAcceptor): void {
    const str = strlit.value;
    let i = 0;
    while (i < str.length) {
      let c = str[i];
      if (c == "\\") {
        if (str[i + 1] == '"') {
          i += 2;
        } else {
          c = "g" + str.slice(i + 1, i + 3); // graphics char
          i += 3;
        }
      } else i++;
      if (c != "%" && c != "\\" && tokenCodes[c] == undefined)
        accept("warning", `Unrecognized string token '${c}'`, { node: strlit, property: "value" });
    }
  }

  //   checkValidJumpDest(model:Model, accept:ValidationAcceptor) {
  //     const linenums = model.lines.map(l => l.name)
  //     model.lines.forEach(line => {
  //         if (isStatementJump(line.statement)
  //         )
  //     })
  //     if (isNumericLiteral(jmp.dest)) {
  //         const model =
  //     }
  //   }
}
