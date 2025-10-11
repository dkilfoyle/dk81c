import { CstNode, DefaultValueConverter, GrammarAST, ValueType } from "langium";

export class AsmValueConverter extends DefaultValueConverter {
  override runConverter(rule: GrammarAST.AbstractRule, input: string, cstNode: CstNode): ValueType {
    if (rule.name == "NUMBER") {
      if (input.startsWith("$")) return parseInt(input.slice(1), 16);
      if (input.endsWith("H")) return parseInt(input.slice(0, -1), 16);
      return parseInt(input);
    } else if (rule.name == "CHARACTER") {
      return input.slice(1, -1);
    } else if (rule.name == "COMMENT") {
      return input.slice(1).trimStart();
    } else {
      return super.runConverter(rule, input, cstNode);
    }
  }
}
