import { AstNode, CommentProvider, DocumentationProvider, LangiumDocument, MaybePromise } from "langium";
import type { Hover, HoverParams } from "vscode-languageserver";
import { AstNodeHoverProvider, LangiumServices } from "langium/lsp";
import { isExpression, isInstruction } from "./generated/ast.js";
import { CstUtils } from "langium";
import { getInfoNodeForAstNode } from "../opcodes-z80.js";

export class AsmHoverProvider extends AstNodeHoverProvider {
  documentationProvider: DocumentationProvider;
  commentProvider: CommentProvider;

  constructor(services: LangiumServices) {
    super(services);
    this.documentationProvider = services.documentation.DocumentationProvider;
    this.commentProvider = services.documentation.CommentProvider;
  }

  override async getHoverContent(document: LangiumDocument, params: HoverParams): Promise<Hover | undefined> {
    const rootNode = document.parseResult?.value?.$cstNode;
    if (rootNode) {
      const offset = document.textDocument.offsetAt(params.position);
      const cstNode = CstUtils.findLeafNodeBeforeOffset(rootNode, offset);
      console.log("Getting hover for ", cstNode);

      // if (isOperation(cstNode?.astNode)) return this.getAstNodeHoverContent(cstNode.astNode);
      if (isExpression(cstNode?.astNode) && cstNode?.astNode.label) {
        const target = this.references.findDeclarations(cstNode);
        if (target) {
          const comment = this.commentProvider.getComment(target[0]);
          if (comment)
            return {
              contents: {
                kind: "markdown",
                language: "asm",
                value: `${comment}`,
              },
            };
        }
      }

      if (isInstruction(cstNode?.astNode)) {
        return { contents: { kind: "markdown", value: (await this.getAstNodeHoverContent(cstNode?.astNode)) || "?" } };
      }

      // if (cstNode && cstNode.offset + cstNode.length > offset) {
      //   const targetNode = this.references.findDeclarations(cstNode);
      //   if (targetNode) {
      //     return { contents: { kind: "markdown", value: (await this.getAstNodeHoverContent(targetNode[0])) || "?" } };
      //   }
      // }
    }
    return undefined;
  }
  protected getAstNodeHoverContent(node: AstNode): MaybePromise<string | undefined> {
    if (isInstruction(node)) {
      // const docInfo = this.documentationProvider.getDocumentation(node);
      const infoNode = getInfoNodeForAstNode(node);

      if (infoNode) {
        const sig = infoNode.signatures[0];
        if (infoNode.leaf) {
          return [`**${sig.label}**`, "---", sig.documentation, "---", `Bytes: ${infoNode.leaf.bytesTemplate}`].join("  \n");
        } else return [`**${sig.label}**`, "---", sig.documentation].join("  \n");
      }
    }
    return undefined;
  }
}
