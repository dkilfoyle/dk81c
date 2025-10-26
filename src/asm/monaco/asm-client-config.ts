import type { ExtensionConfig } from "monaco-languageclient/vscodeApiWrapper";
import type { LanguageClientConfig } from "monaco-languageclient/lcwrapper";
import type { EditorAppConfig } from "monaco-languageclient/editorApp";
import asmWorkerUrl from "../language/asm-server?worker&url";

// cannot be imported with assert as json contains comments
import vscodeConfig from "./asm-vscode-config.json?raw";
import tmGrammar from "./asm-tm-grammar.json?raw";
import scratchCode from "../examples/scratch.asm?raw";

const extensionFilesOrContents = new Map<string, string | URL>();
extensionFilesOrContents.set(`/asm-vscode-config.json`, vscodeConfig);
extensionFilesOrContents.set(`/asm-tm-grammar.json`, tmGrammar);

export const asmVscodeExtension: ExtensionConfig = {
  config: {
    name: "asm-language-extension",
    publisher: "DK",
    version: "1.0.0",
    engines: {
      vscode: "*",
    },
    contributes: {
      languages: [
        {
          id: "asm",
          extensions: [".asm"],
          aliases: ["asm", "Asm", "ASM"],
          configuration: `./asm-vscode-config.json`,
        },
      ],

      grammars: [
        {
          language: "asm",
          scopeName: "source.asm",
          path: `./asm-tm-grammar.json`,
        },
      ],
    },
  },
  filesOrContents: extensionFilesOrContents,
};

const languageClientConfig: LanguageClientConfig = {
  languageId: "asm",
  connection: {
    options: {
      $type: "WorkerDirect",
      worker: new Worker(asmWorkerUrl, { type: "module", name: "asm server" }),
    },
  },
  clientOptions: {
    documentSelector: ["asm"],
    // documentSelector: [
    //   { scheme: "file", language: "asm" },
    //   { scheme: "builtin", language: "asm" },
    // ], // the language id, NOT extension
  },
};

const editorAppConfig: EditorAppConfig = {
  codeResources: {
    modified: {
      text: scratchCode,
      uri: "source.asm",
    },
  },
};

export const asmClientConfig = {
  editorAppConfig,
  languageClientConfig,
};
