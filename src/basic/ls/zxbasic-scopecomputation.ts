import { DefaultScopeComputation, MultiMap, type AstNode, type AstNodeDescription, type LangiumDocument } from "langium";
import { isStatementDecl } from "./generated/ast";

export class ZxbasicScopeComputation extends DefaultScopeComputation {
  protected override addLocalSymbol(node: AstNode, document: LangiumDocument, symbols: MultiMap<AstNode, AstNodeDescription>): void {
    // Lift declarations from line scope to file scope
    const container = isStatementDecl(node) ? node.$container?.$container : node.$container;
    if (container) {
      const name = this.nameProvider.getName(node);
      if (name) {
        symbols.add(container, this.descriptions.createDescription(node, name, document));
      }
    }
  }
}
