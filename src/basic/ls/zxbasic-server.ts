import { DocumentState, EmptyFileSystem, URI } from "langium";
import { startLanguageServer } from "langium/lsp";
import { BrowserMessageReader, BrowserMessageWriter, createConnection } from "vscode-languageserver/browser.js";
import { createZxbasicServices } from "./zxbasic-module.js";
import type { Model } from "./generated/ast.js";
import { PFile } from "../compiler/pfile.js";

export interface CompilerResult {
  ast: string;
  pfile: Uint8Array;
}

declare const self: DedicatedWorkerGlobalScope;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const { shared, Zxbasic } = createZxbasicServices({ connection, ...EmptyFileSystem });

console.log("Starting Basic LSP");
startLanguageServer(shared);

shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, (documents) => {
  // perform this for every validated document in this build phase batch
  for (const document of documents) {
    // if (document.diagnostics == undefined) {
    const model = document.parseResult.value as Model;
    const json = Zxbasic.serializer.JsonSerializer.serialize(model, {
      sourceText: false,
      textRegions: true,
      refText: true,
    });

    connection.sendNotification("server/documentChange", { ast: json } as CompilerResult);
  }
});

connection.onNotification("client/pfile_req", ({ filename }) => {
  const doc = shared.workspace.LangiumDocuments.getDocument(URI.file(filename));
  if (doc) {
    const pfile = new PFile(doc?.parseResult.value as Model);
    // for (let addr = 0; addr < pfile.bytes.length; addr += 16) {
    //   console.log(
    //     `${addr.toString(16).padStart(4, "0")}  ${Array.from(pfile.bytes.slice(addr, addr + 16))
    //       .map((x) => x.toString(16).padStart(2, "0"))
    //       .join(" ")}`
    //   );
    // }
    // console.log("dfile = ", pfile.dfileStart.toString(16).padStart(4, "0"));
    // console.log("basicvars = ", pfile.basicvarsStart.toString(16).padStart(4, "0"));
    connection.sendNotification("server/pfile_resp", pfile);
  }
});
