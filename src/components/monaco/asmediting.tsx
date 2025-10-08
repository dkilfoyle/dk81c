import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PFile } from "@/basic/compiler/pfile";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Button, createListCollection, Flex, HStack } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "@/components/ui/select";
import { LanguageClientsManager, LanguageClientWrapper } from "monaco-languageclient/lcwrapper";
import { EditorApp } from "monaco-languageclient/editorApp";
import { vscodeApiConfig } from "./vscodeApiConfig";
import { asmClientConfig } from "@/asm/monaco/asm-client-config";

const sourceCodes = import.meta.glob("../../asm/examples/**/*.asm", { as: "raw" });

export const AsmEditing = ({ zxworker }: { zxworker: React.RefObject<Worker | null> }) => {
  const asmWrapperRef = useRef<LanguageClientWrapper | null>(null);
  const editorAppRef = useRef<EditorApp | null>(null);
  const [source, setSource] = useState("scratch.asm");

  const clickLoad = useCallback(() => {
    if (asmWrapperRef.current) {
      asmWrapperRef.current.getLanguageClient()?.sendNotification("client/pfile_req", { filename: "workspace/source.asm" });
    }
  }, [asmWrapperRef]);

  const onLanguageClientsLoad = useCallback(
    (lcsManager?: LanguageClientsManager) => {
      const wrapper = lcsManager?.getLanguageClientWrapper("asm");
      if (!wrapper) throw Error("asm !wrapper");
      asmWrapperRef.current = wrapper;
      const lc = wrapper.getLanguageClient();
      if (!lc) throw Error("asm !lc");
      lc.onNotification("server/documentChange", ({ ast }) => {
        console.log("app received notification server/documentChange", JSON.parse(ast));
      });
      lc.onNotification("server/pfile_resp", (pfile: PFile) => {
        console.log("app received notification server/pfile_resp", pfile, zxworker);
        if (pfile.bytes.length == 0) {
          toaster.create({
            description: ".bas to .p failed",
            type: "error",
          });
        } else zxworker.current?.postMessage({ msg: "load_pfile", msgData: pfile.bytes });
      });
    },
    [zxworker]
  );

  useEffect(() => {}, [zxworker]);

  const files = useMemo(() => {
    return createListCollection({
      items: Object.keys(sourceCodes).map((x) => ({ label: x.replace("../asm/examples/", ""), value: x })),
    });
  }, []);

  const onEditorStart = useCallback((editorApp?: EditorApp) => {
    if (!editorApp) throw Error("zxbasic !editorapp");
    editorAppRef.current = editorApp;
  }, []);

  useEffect(() => {
    async function getCode() {
      editorAppRef.current?.getEditor()?.setValue(await sourceCodes[source]());
    }
    getCode();
  }, [source]);

  return (
    <Flex direction={"column"} height="100%" gap={4}>
      <Toaster />
      <HStack>
        <SelectRoot collection={files} value={[source]} onValueChange={(e) => setSource(e.value[0])} size="sm">
          <SelectTrigger>
            <SelectValueText placeholder="Basic source file"></SelectValueText>
          </SelectTrigger>
          <SelectContent>
            {files.items.map((file) => (
              <SelectItem item={file} key={file.value}>
                {file.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
        <Button onClick={clickLoad}>Load</Button>
      </HStack>
      <MonacoEditorReactComp
        style={{ height: "100%", width: "100%" }}
        vscodeApiConfig={vscodeApiConfig}
        editorAppConfig={asmClientConfig.editorAppConfig}
        languageClientConfig={asmClientConfig.languageClientConfig}
        onLanguageClientsStartDone={onLanguageClientsLoad}
        onEditorStartDone={onEditorStart}></MonacoEditorReactComp>
    </Flex>
  );
};
