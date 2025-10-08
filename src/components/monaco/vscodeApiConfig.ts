import { asmVscodeExtension } from "@/asm/monaco/asm-client-config";
import { zxbasicVscodeExtension } from "@/basic/monaco/zxbasic-client-config";
import { LogLevel } from "@codingame/monaco-vscode-api";
import type { MonacoVscodeApiConfig } from "monaco-languageclient/vscodeApiWrapper";
import { configureDefaultWorkerFactory } from "monaco-languageclient/workerFactory";

// VS Code API configuration
export const vscodeApiConfig: MonacoVscodeApiConfig = {
  $type: "extended",
  logLevel: LogLevel.Error,
  viewsConfig: { $type: "EditorService", htmlContainer: "ReactPlaceholder" },
  userConfiguration: {
    json: JSON.stringify({
      "workbench.colorTheme": "Default Dark Modern",
      "editor.guides.bracketPairsHorizontal": "active",
      "editor.wordBasedSuggestions": "off",
      "editor.experimental.asyncTokenization": true,
    }),
  },
  monacoWorkerFactory: configureDefaultWorkerFactory,
  extensions: [zxbasicVscodeExtension, asmVscodeExtension],
};
