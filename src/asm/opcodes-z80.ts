import { opcodes } from "@/z80/decode";
import { ParameterInformation, SignatureInformation } from "vscode-languageserver";
import { Expression, Instruction } from "./language/generated/ast";

export interface IOpcodesNode {
  name: string;
  args: Map<string, IOpcodesNode>;
  signatures: SignatureInformation[];
  codes: number[];
  leaf?: {
    nameTemplate: string;
    bytesTemplate: string;
    idx: number;
  };
}

type IOpcodesTree = Map<string, IOpcodesNode>;

const newOpcodesNode = (name: string) => ({ name, args: new Map(), codes: [], signatures: [] });

export const opcodesLookup = opcodes.entries().reduce<IOpcodesTree>((rootNode, [code, def]) => {
  const processDef = (defcase: "upper" | "lower") => {
    const instrSplit = (defcase == "upper" ? def.name.toUpperCase() : def.name.toLowerCase()).split(" ");
    const instrName = instrSplit[0];
    const args = instrSplit[1] ? instrSplit[1].split(",") : [];
    let curNode = rootNode.get(instrName) || rootNode.set(instrName, newOpcodesNode(instrName)).get(instrName)!;
    curNode.codes.push(code);

    let title = instrName;
    const params = args.map((arg, i) => {
      if (i == 0) title += " ";
      const start = title.length;
      title += arg;
      const end = title.length;
      if (i < args.length - 1) title += ", ";
      return ParameterInformation.create([start, end]);
    });
    curNode.signatures.push(SignatureInformation.create(title, def.doc, ...params));

    if (args.length == 0) {
      // this should only be possible once
      if (curNode.leaf) console.log("Aliasing " + def.name);
      curNode.leaf = {
        idx: curNode.signatures.length - 1,
        nameTemplate: def.name, // todo def.nameTemplate
        bytesTemplate: def.bytes,
      };
    } else {
      for (let i = 0; i < args.length; i++) {
        const argi = instrName == "RST" ? "$N" : args[i];
        curNode = curNode.args.get(argi) || curNode.args.set(argi, newOpcodesNode(instrName + " " + args.slice(i).join(","))).get(argi)!;
        curNode.signatures.push(SignatureInformation.create(title, def.doc, ...params));
        curNode.codes.push(code);
        if (i == args.length - 1) {
          curNode.leaf = {
            idx: curNode.signatures.length - 1,
            nameTemplate: def.name, // todo def.nameTemplate
            bytesTemplate: def.bytes,
          };
        }
        // if (parentNode != curNode) parentNode.codes.push(code);
        // rootNode.get(instrName)?.codes.push(code);
      }
    }
  };
  processDef("upper");
  processDef("lower");

  return rootNode;
}, new Map());

export const getInfoNodeForAstNode = (instrAstNode: Instruction) => {
  const emptyNode: IOpcodesNode = { args: new Map().set("Error", {}), codes: [], signatures: [] };
  const getInfoArgNode = (parentNode: IOpcodesNode, expr: Expression) => {
    if (expr.immediate)
      return parentNode.args.get("$N") || parentNode.args.get("$NN") || parentNode.args.get("$E") || parentNode.args.get("$D");
    if (expr.paren && (expr.paren.immediate || expr.paren.label)) return parentNode.args.get("($NN)");
    if (expr.label) return parentNode.args.get("$NN");
    return parentNode.args.get(expr.$cstNode!.text);
  };

  let infoNode = opcodesLookup.get(instrAstNode.opcode);
  if (infoNode) {
    if (instrAstNode.expressionList) {
      const expressions = instrAstNode.expressionList.expressions;
      if (instrAstNode.expressionList.expressions.length > 0) {
        infoNode = getInfoArgNode(infoNode, expressions[0]);
        if (!infoNode) debugger;
      }
      if (instrAstNode.expressionList.expressions.length == 2) {
        infoNode = getInfoArgNode(infoNode!, expressions[1]);
        if (!infoNode) debugger;
      }
      return infoNode;
    } else {
      // no args eg ret
      return infoNode;
    }
  }
};
