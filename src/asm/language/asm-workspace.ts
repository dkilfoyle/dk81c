import { AstNode, DefaultWorkspaceManager, LangiumDocument, LangiumDocumentFactory } from "langium";
import { LangiumSharedServices } from "langium/lsp";
import { WorkspaceFolder } from "vscode-languageserver";
import { URI } from "vscode-uri";
import { assembler } from "../assembler/asm-assembler";

import zx81start from "../assembler/zx81start.asm?raw";
import zx81end from "../assembler/zx81end.asm?raw";

export class AsmWorkspaceManager extends DefaultWorkspaceManager {
  private documentFactory: LangiumDocumentFactory;

  constructor(services: LangiumSharedServices) {
    super(services);
    this.documentFactory = services.workspace.LangiumDocumentFactory;
  }

  protected override async loadAdditionalDocuments(
    folders: WorkspaceFolder[],
    collector: (document: LangiumDocument<AstNode>) => void
  ): Promise<void> {
    await super.loadAdditionalDocuments(folders, collector);
    // Load start and end using the `builtin` URI schema
    const startasm = this.documentFactory.fromString(zx81start, URI.parse("builtin:///zx81start.asm"));
    assembler.startasm = startasm;
    collector(startasm);
    const endasm = this.documentFactory.fromString(zx81end, URI.parse("builtin:///zx81end.asm"));
    assembler.endasm = endasm;
    collector(endasm);
  }
}
