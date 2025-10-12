import { LangiumDocuments, MaybePromise } from "langium";
import { CompletionAcceptor, CompletionContext, DefaultCompletionProvider, LangiumServices, NextFeature } from "langium/lsp";
import { CompletionItemKind } from "vscode-languageserver";
import { GrammarAST } from "langium";

export class AsmCompletionProvider extends DefaultCompletionProvider {
  protected readonly documents: LangiumDocuments;
  constructor(services: LangiumServices) {
    super(services);
    this.documents = services.shared.workspace.LangiumDocuments;
  }
  protected override completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor): MaybePromise<void> {
    console.log(next.feature);
    if (GrammarAST.isKeyword(next.feature)) {
      return this.completionForKeyword(context, next.feature, acceptor);
    } else if (GrammarAST.isCrossReference(next.feature) && context.node) {
      return this.completionForCrossReference(context, next as NextFeature<GrammarAST.CrossReference>, acceptor);
    }
    // else console.log(context, next);
    // if (GrammarAST.isKeyword(next.feature) && next.type == "") {
    //   // const doc = this.documentationProvider.getDocumentation({
    //   //   $type: "Instr",
    //   //   op: { opname: next.feature.value },
    //   // } as Instr);
    //   return acceptor(context, {
    //     kind: CompletionItemKind.Field,
    //     label: next.feature.value,
    //     insertText: next.feature.value,
    //     documentation: "doc",
    //   });
    // } else return super.completionFor(context, next, acceptor);
  }
}
