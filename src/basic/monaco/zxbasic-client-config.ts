import type { ExtensionConfig } from "monaco-languageclient/vscodeApiWrapper";
import type { LanguageClientConfig } from "monaco-languageclient/lcwrapper";
import type { EditorAppConfig } from "monaco-languageclient/editorApp";
import zxbasicWorkerUrl from "../ls/zxbasic-server?worker&url";

// cannot be imported with assert as json contains comments
import zxbasicVscodeConfig from "./zxbasic-vscode-config.json?raw";
import zxbasicTmGrammar from "./zxbasic-tm-grammar.json?raw";

const extensionFilesOrContents = new Map<string, string | URL>();
extensionFilesOrContents.set(`/zxbasic-configuration.json`, zxbasicVscodeConfig);
extensionFilesOrContents.set(`/zxbasic-grammar.json`, zxbasicTmGrammar);

export const zxbasicVscodeExtension: ExtensionConfig = {
  config: {
    name: "zxbasic-example",
    publisher: "TypeFox",
    version: "1.0.0",
    engines: {
      vscode: "*",
    },
    contributes: {
      languages: [
        {
          id: "zxbasic",
          extensions: [".bas"],
          aliases: ["zxbasic", "Zxbasic"],
          configuration: `./zxbasic-configuration.json`,
        },
      ],
      grammars: [
        {
          language: "zxbasic",
          scopeName: "source.zxbasic",
          path: `./zxbasic-grammar.json`,
        },
      ],
    },
  },
  filesOrContents: extensionFilesOrContents,
};

const languageClientConfig: LanguageClientConfig = {
  languageId: "zxbasic",
  clientOptions: {
    documentSelector: ["zxbasic"],
  },
  connection: {
    options: {
      $type: "WorkerDirect",
      worker: new Worker(zxbasicWorkerUrl, {
        type: "module",
        name: "zxbasic Server Regular",
      }),
      // messagePort: params.messagePort,
    },
    // messageTransports: params.messageTransports,
  },
};

const editorAppConfig: EditorAppConfig = {
  codeResources: {
    modified: {
      text: "10 REM HELLO",
      uri: "source.bas",
    },
  },
};

export const zxbasicClientConfig = {
  editorAppConfig,
  languageClientConfig,
};
