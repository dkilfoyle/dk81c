import { AstNode, CommentProvider, DocumentationProvider, LangiumDocument } from "langium";
import { Hover, HoverParams } from "vscode-languageclient";
import { AstNodeHoverProvider, LangiumServices } from "langium/lsp";
import { isExpression } from "./generated/ast.js";
import { CstUtils } from "langium";

export class AsmHoverProvider extends AstNodeHoverProvider {
  documentationProvider: DocumentationProvider;
  commentProvider: CommentProvider;

  constructor(services: LangiumServices) {
    super(services);
    this.documentationProvider = services.documentation.DocumentationProvider;
    this.commentProvider = services.documentation.CommentProvider;
  }

  override getHoverContent(document: LangiumDocument, params: HoverParams): Promise<Hover | undefined> {
    const rootNode = document.parseResult?.value?.$cstNode;
    if (rootNode) {
      const offset = document.textDocument.offsetAt(params.position);
      const cstNode = CstUtils.findLeafNodeBeforeOffset(rootNode, offset);

      // if (isOperation(cstNode?.astNode)) return this.getAstNodeHoverContent(cstNode.astNode);
      if (isExpression(cstNode?.astNode) && cstNode?.astNode.label) {
        const target = this.references.findDeclarations(cstNode);
        if (target) {
          const comment = this.commentProvider.getComment(target[0]);
          if (comment)
            return {
              contents: {
                kind: "markdown",
                value: comment,
              },
            };
        }
      }
      if (cstNode && cstNode.offset + cstNode.length > offset) {
        const targetNode = this.references.findDeclarations(cstNode);
        if (targetNode) {
          return this.getAstNodeHoverContent(targetNode[0]);
        }
      }
    }
    return undefined;
  }

  protected getAstNodeHoverContent(node: AstNode): Hover | undefined {
    // if (isOperation(node)) {
    //   const docInfo = this.documentationProvider.getDocumentation(node);
    //   if (docInfo) {
    //     return {
    //       contents: {
    //         kind: "markdown",
    //         value: docInfo,
    //       },
    //     };
    //   }
    // }
    return undefined;
  }
}
