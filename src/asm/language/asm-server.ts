import { AstNode, DocumentState, EmptyFileSystem, LangiumDocument } from "langium";
import { startLanguageServer } from "langium/lsp";
import { BrowserMessageReader, BrowserMessageWriter, createConnection, NotificationType } from "vscode-languageserver/browser.js";
import { createAsmServices, labelMap } from "./asm-module.js";
import { assembler } from "../assembler/asm-assembler.js";
// import { assembler } from "../assembler/asm-assembler.js";
// import { assembler } from "../../assembler/asm-assembler.js";
// import type { ILinkerInfo } from "../../assembler/asm-linker.js";
// import { userPreferences } from "../asm-userpreferences.js";
// import { compiledFolds } from "../asm-fold.js";

declare const self: DedicatedWorkerGlobalScope;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const { shared, Asm } = createAsmServices({ connection, ...EmptyFileSystem });

console.log("asm-server: starting language server");
startLanguageServer(shared);

// connection.onDidChangeConfiguration((params: DidChangeConfigurationParams) => {
//   userPreferences.format.indentTabs = params.settings.asm.format.indentTabs ?? userPreferences.format.indentTabs;
//   userPreferences.format.commentTabs = params.settings.asm.format.commentTabs ?? userPreferences.format.commentTabs;
//   userPreferences.syntax.maxLabelSize = params.settings.asm.syntax.maxLabelSize ?? userPreferences.syntax.maxLabelSize;
// });

// connection.onNotification("statusChange", (n) => {
//   if (n.isDebugging != undefined) status.isDebugging = n.isDebugging;
// });

// connection.onNotification("asmFolds", (params: { folds: FoldingRange[]; uri: string }) => {
//   compiledFolds[params.uri] = params.folds;
// });

// connection.onNotification("newCompiledAsm", (params: { text: string; uri: string }) => {
//   shared.workspace.LangiumDocumentFactory.fromString(params.text, URI.file(params.uri));
// });

export type AsmDocumentChange = {
  uri: string;
  ast: string;
  bytes: Uint8Array;
  labels: Record<string, number>;
};

// // const debounce = (fn: Function, ms = 300) => {
// //   let timeoutId: ReturnType<typeof setTimeout>;
// //   return function (this: any, ...args: any[]) {
// //     clearTimeout(timeoutId);
// //     timeoutId = setTimeout(() => fn.apply(this, args), ms);
// //   };
// // };

const debounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
  let timeoutTimer: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeoutTimer);

    timeoutTimer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const sendAsmDocumentChange = (document: LangiumDocument<AstNode>) => {
  const { labels, bytes } = assembler.compileAsmToPFile(document);
  labelMap.clear();
  Object.entries(labels).forEach((l) => labelMap.set(l[0], l[1]));

  const json = Asm.serializer.JsonSerializer.serialize(document.parseResult.value, {
    sourceText: false,
    textRegions: true,
    refText: true,
  });
  const documentChangeNotification = new NotificationType<AsmDocumentChange>("server/AsmDocumentChange");
  connection.sendNotification(documentChangeNotification, {
    uri: document.uri.toString(),
    ast: json,
    bytes,
    labels,
  });
};

const debouncedSendAsmDocumentChange = debounce(sendAsmDocumentChange, 1000);

shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, (documents) => {
  for (const document of documents) {
    console.log("On build phase", document);
    if (document.diagnostics?.length != 0) console.log("HAS ERRORS");
    if (document.diagnostics?.length == 0) {
      // assembler.compileAsmToPFile(document);
      debouncedSendAsmDocumentChange(document);
      // sendAsmDocumentChange(document);
    }
  }
});
