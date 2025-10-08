import { DefaultValueConverter, type CstNode, type ValueType } from "langium";
import { GrammarAST } from "langium";

export class ZxbasicValueConverter extends DefaultValueConverter {
  constructor() {
    super();
  }

  protected runConverter(rule: GrammarAST.AbstractRule, input: string, cstNode: CstNode): ValueType {
    if (rule.name == "RAWSTRING") {
      return input.slice(1, -1);
    } else return super.runConverter(rule, input, cstNode);
  }
}
