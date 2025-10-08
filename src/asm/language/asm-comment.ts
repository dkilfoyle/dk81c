import { CommentProvider, GrammarConfig, LangiumCoreServices, AstNode, CstUtils } from "langium";
import { isLabel, isLine } from "./generated/ast";

export class AsmCommentProvider implements CommentProvider {
  protected readonly grammarConfig: () => GrammarConfig;
  constructor(services: LangiumCoreServices) {
    this.grammarConfig = () => services.parser.GrammarConfig;
  }
  getComment(node: AstNode): string | undefined {
    if (isLabel(node) && isLine(node.$container)) {
      if (node.$container.comment) {
        return node.$container.comment;
      } else {
        const prev = CstUtils.getPreviousNode(node.$cstNode!)?.astNode;
        if (prev && isLine(prev) && prev.comment) {
          return prev.comment;
        }
      }
    }
  }
}
