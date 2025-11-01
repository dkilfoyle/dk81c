import { AstNode, CommentProvider, DocumentationProvider, IndexManager, LangiumCoreServices } from "langium";
import { isInstruction } from "./generated/ast.js";
import { getInfoNodeForAstNode } from "../opcodes-z80.js";

export class AsmDocumentationProvider implements DocumentationProvider {
  protected readonly indexManager: IndexManager;
  protected readonly commentProvider: CommentProvider;

  constructor(services: LangiumCoreServices) {
    this.indexManager = services.shared.workspace.IndexManager;
    this.commentProvider = services.documentation.CommentProvider;
  }

  getDocumentation(node: AstNode) {
    if (isInstruction(node)) {
      const infoNode = getInfoNodeForAstNode(node);
      if (!infoNode) return `Unable to find documentation for node "${node.$cstNode!.text}"`;
      return (infoNode.signatures[0].documentation as string) || `No signature for "${node.$cstNode!.text}"`;
    }
  }
}
