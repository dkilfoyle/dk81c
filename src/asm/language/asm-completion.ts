import { AstNode, LangiumDocument, LangiumDocuments, ReferenceInfo } from "langium";
import { DefaultCompletionProvider, LangiumServices } from "langium/lsp";
import { CstUtils, AstUtils } from "langium";
import { Expression, ExpressionList, isExpression, isExpressionList, isInstruction, isProgram } from "./generated/ast";
import { CompletionItem, CompletionItemKind, CompletionList, CompletionParams, Position } from "vscode-languageserver-protocol";
import { IOpcodesNode, opcodesLookup } from "../opcodes-z80";
import { userPreferences } from "./asm-userpreferences";
import { opcodes } from "@/z80/decode";

export class AsmCompletionProvider extends DefaultCompletionProvider {
  protected readonly documents: LangiumDocuments;
  completionLibrary = {
    opcodes: Array.from(opcodesLookup.keys()).map((opcode) => ({
      label: this.toCase(opcode),
      kind: CompletionItemKind.Field,
      documentation: opcodes.get(opcodesLookup.get(opcode)!.codes[0])?.doc,
    })),
  };

  constructor(services: LangiumServices) {
    super(services);
    this.documents = services.shared.workspace.LangiumDocuments;
  }

  toCase(x: string) {
    // TODO: use configurationProvider service
    return userPreferences.syntax.case == "lower" ? x.toLowerCase() : x.toUpperCase();
  }

  getContext(document: LangiumDocument, position: Position) {
    const textDocument = document.textDocument;
    let offset = textDocument.offsetAt(position);
    const cst = document.parseResult.value.$cstNode;
    if (!cst) {
      throw Error();
    }

    const charBefore = textDocument.getText({ start: { character: position.character - 1, line: position.line }, end: position });
    if (charBefore == " ") offset -= 1; // eg call ^

    const leafBeforeOffset = CstUtils.findLeafNodeBeforeOffset(cst, offset)?.astNode;
    const leafAtOffset = CstUtils.findLeafNodeAtOffset(cst, offset)?.astNode;
    const declAtOffset = CstUtils.findDeclarationNodeAtOffset(cst, offset)?.astNode;
    console.log({ offset, leafAtOffset, leafBeforeOffset, declAtOffset, charBefore });

    return { declAtOffset, leafBeforeOffset, spaceBefore: charBefore == " " };
  }

  async getCompletion(document: LangiumDocument, params: CompletionParams): Promise<CompletionList | undefined> {
    const items: CompletionItem[] = [];

    const { declAtOffset, leafBeforeOffset, spaceBefore } = this.getContext(document, params.position);
    // console.log(node);

    switch (true) {
      case leafBeforeOffset == undefined:
      case isExpression(declAtOffset):
        {
          // ld x^
          // lx a, x^
          // ld (^)
          const node = declAtOffset as Expression;
          if (isInstruction(node.$container?.$container)) {
            const args: string[] = [];
            if (node.$containerIndex == 1 && isExpressionList(node.$container)) args.push(node.$container.expressions[0].$cstNode!.text);
            items.push(...this.getArgs(node, node.$container!.$container.opcode, args, node.paren != undefined));
          }
        }
        break;
      case isExpressionList(leafBeforeOffset):
        {
          // ld a, ^
          const node = leafBeforeOffset as ExpressionList;
          if (isInstruction(node.$container)) {
            items.push(...this.getArgs(node, node.$container.opcode, [node.expressions[0].$cstNode!.text]));
          }
        }
        break;
      case isProgram(leafBeforeOffset):
        // ^
        items.push(...this.completionLibrary.opcodes);
        break;
      case isInstruction(leafBeforeOffset) && spaceBefore:
        // ld ^
        items.push(...this.getArgs(leafBeforeOffset, leafBeforeOffset.opcode, [], false));
        break;
    }

    return CompletionList.create(this.deduplicateItems(items), true);
  }

  getArgs(node: AstNode, opcode: string, astargs: string[], brackets = false) {
    const emptyNode: IOpcodesNode = { args: new Map().set("Error", {}), codes: [], signatures: [], name: opcode };
    let compargs = opcodesLookup.get(opcode.toUpperCase()) || emptyNode;
    if (astargs.length == 1) compargs = compargs.args.get(astargs[0].toUpperCase()) || emptyNode;
    if (astargs.length == 2) compargs = compargs.args.get(astargs[1].toUpperCase()) || emptyNode;
    console.log("getting args for ", opcode, astargs, compargs);

    const result: CompletionItem[] = [];
    for (const argName of compargs.args.keys()) {
      if (!brackets || argName.startsWith("(") == brackets) {
        if (argName == "$N") continue;
        if (argName == "$NN" || argName == "$E") {
          for (const lbl of this.getLabels(node)) {
            result.push({ label: this.toCase(lbl.name), kind: CompletionItemKind.Reference });
          }
        } else result.push({ label: this.toCase(brackets ? argName.slice(1, -1) : argName), kind: CompletionItemKind.Variable });
      }
    }
    return result;
  }

  getLabels(node: AstNode) {
    const refnode = { $type: "Expression", $container: node, $containerProperty: "label" };
    AstUtils.assignMandatoryProperties(this.astReflection, refnode);
    const refInfo: ReferenceInfo = {
      reference: {
        $refText: "",
        ref: undefined,
      },
      container: refnode,
      property: "label",
    };
    const refs = this.scopeProvider.getScope(refInfo).getAllElements();
    return refs;
  }
}
