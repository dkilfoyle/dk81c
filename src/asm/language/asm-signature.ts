import { AbstractSignatureHelpProvider } from "langium/lsp";
import type { AsmServices } from "./asm-module.js";
import { type AstNode, type MaybePromise, type DocumentationProvider, type CommentProvider, CstUtils, LangiumDocument } from "langium";
import { SignatureHelpParams, SignatureInformation, type SignatureHelp, type SignatureHelpOptions } from "vscode-languageserver";
import { isExpression, isExpressionList, isInstruction } from "./generated/ast.js";
import { opcodesLookup } from "../opcodes-z80.js";

export class AsmSignatureHelpProvider extends AbstractSignatureHelpProvider {
  documentationProvider: DocumentationProvider;
  commentProvider: CommentProvider;
  // currentSignature: SignatureHelp | undefined;

  constructor(services: AsmServices) {
    super();
    this.documentationProvider = services.documentation.DocumentationProvider;
    this.commentProvider = services.documentation.CommentProvider;
  }

  override provideSignatureHelp(document: LangiumDocument, params: SignatureHelpParams): MaybePromise<SignatureHelp | undefined> {
    const cst = document.parseResult.value.$cstNode;
    if (cst) {
      const curOffset = document.textDocument.offsetAt(params.position);
      const sourceCstNode = CstUtils.findLeafNodeBeforeOffset(cst, curOffset);
      if (sourceCstNode) return this.getSignatureFromElement(sourceCstNode.astNode);
    }
    return undefined;
  }

  findMatchingSignatures(instrName: string, arg0?: string, arg1?: string): SignatureInformation[] {
    const instrNode = opcodesLookup.get(instrName);
    if (!instrNode) return [];
    if (arg0 == undefined) return instrNode.signatures;
    if (arg1 == undefined) {
      //ld hl
      return instrNode.signatures.filter((sig) => sig.label.startsWith(instrName + " " + arg0));
    } else {
      // ld hl, b?
      const sigs: SignatureInformation[] = [];
      const arg0Node = instrNode.args.get(arg0);
      if (arg0Node) {
        for (const [sigArg1Name, sigArg1Nodes] of arg0Node.args) {
          if (sigArg1Name.startsWith(arg1)) sigs.push(...sigArg1Nodes.signatures);
        }
      }
      return sigs;
    }
  }

  protected override getSignatureFromElement(element: AstNode): MaybePromise<SignatureHelp | undefined> {
    if (isInstruction(element)) {
      // ld ^
      return { signatures: this.findMatchingSignatures(element.opcode), activeParameter: 0, activeSignature: 0 };
    }
    if (isExpression(element) && isExpressionList(element.$container) && isInstruction(element.$container.$container)) {
      // ld a^
      // ld a,^b
      const instrNode = element.$container?.$container;
      const listNode = element.$container;
      if (element.$containerIndex == 0)
        return { signatures: this.findMatchingSignatures(instrNode.opcode, element.$cstNode!.text), activeParameter: 0, activeSignature: 0 };
      if (element.$containerIndex == 1)
        return {
          signatures: this.findMatchingSignatures(instrNode.opcode, listNode.expressions[0].$cstNode!.text, element.$cstNode!.text),
          activeParameter: 1,
          activeSignature: 0,
        };
    }
    if (isExpressionList(element) && isInstruction(element.$container)) {
      const instrNode = element.$container;
      return {
        signatures: this.findMatchingSignatures(instrNode.opcode, element.expressions[0].$cstNode!.text),
        activeParameter: 1,
        activeSignature: 0,
      };
    }
    return undefined;
  }

  override get signatureHelpOptions(): SignatureHelpOptions {
    return {
      triggerCharacters: [" "],
      retriggerCharacters: [","],
    };
  }
}
