import type { AstNode, AstNodeDescription, LangiumDocument, Scope } from "langium";
import { DefaultScopeComputation, DefaultScopeProvider, MultiMap } from "langium";
import { AsmServices } from "./asm-module.js";

export class AsmScopeProvider extends DefaultScopeProvider {
  override createScope(elements: Iterable<AstNodeDescription>, outerScope?: Scope): Scope {
    return super.createScope(elements, outerScope, { caseInsensitive: true });
  }
}

export class AsmScopeComputation extends DefaultScopeComputation {
  constructor(services: AsmServices) {
    super(services);
  }

  protected override addLocalSymbol(node: AstNode, document: LangiumDocument, symbols: MultiMap<AstNode, AstNodeDescription>): void {
    const container = node.$container?.$container;
    if (container) {
      const name = this.nameProvider.getName(node);
      if (name) {
        symbols.add(container, this.descriptions.createDescription(node, name, document));
      }
    }
  }

  /**
   * Process a single node during scopes computation. The default implementation makes the node visible
   * in the subtree of its container (if the node has a name). Override this method to change this,
   * e.g. by increasing the visibility to a higher level in the AST.
   */
  // protected override processNode(node: AstNode, document: LangiumDocument, scopes: LocalSymbols): void {
  //   // boost non-global labels out of line scope to program scope
  //   const container = (isLabel(node) && !node.glob) || isLinkageDirective(node) ? node.$container.$container : node.$container;
  //   if (container) {
  //     const name = this.nameProvider.getName(node);
  //     if (name) {
  //       scopes.add(container, this.descriptions.createDescription(node, name, document));
  //     }
  //   }
  // }

  // async computeExports(document: LangiumDocument): Promise<AstNodeDescription[]> {
  //   const model = document.parseResult.value as Program;
  //   const exports: AstNodeDescription[] = [];

  //   // export all global labels ("::") to file scope
  //   model.lines
  //     .filter((l) => l.label && l.label.glob)
  //     .forEach((ll) => exports.push(this.descriptions.createDescription(ll.label!, ll.label!.name)));

  //   // export all EQU names to file scope
  //   model.lines
  //     .filter((l) => isSymbolDirective(l.dir))
  //     .forEach((l) => {
  //       const dir = l.dir as SymbolDirective;
  //       exports.push(this.descriptions.createDescription(dir, dir.name));
  //     });

  //   return exports;
  // }
}
