import { opcodes } from "@/z80/decode";
import { ParameterInformation, SignatureInformation } from "vscode-languageserver";

// interface IOpcodesLookupEntry {
//   args: string[];
//   code: number;
// }

// type IOpcodesLookup = Map<string, IOpcodesLookupEntry[]>;

// export const opcodesLookup = opcodes.entries().reduce<IOpcodesLookup>((accum, [code, def]) => {
//   const nameSplit = def.name.split(" ");
//   const op = nameSplit[0];

//   if (!accum.get(op)) accum.set(op, []);
//   if (!nameSplit[1]) {
//     accum.get(op)?.push({ code, args: [] });
//   } else {
//     const args = def.name.toUpperCase().split(" ")[1].split(",");
//     accum.get(op)!.push({ args, code });
//   }

//   return accum;
// }, new Map());

// const look = {
//   ld: {
//     a: {
//       b: 123,
//       c: 124
//     },
//     b: 134
//   },
//   ret:999
// }

// interface IOpcodeArgumentNode {
//   name: string,
//   code?: number,
//   children: IOpcodeArgumentNode[];
// }

export interface IOpcodesNode {
  codes: number[];
  args: Map<string, IOpcodesNode>;
  help?: string;
  signatures: SignatureInformation[];
}
type IOpcodesTree = Map<string, IOpcodesNode>;

const newOpcodesNode = () => ({ args: new Map(), codes: [], signatures: [] });

export const opcodesLookup = opcodes.entries().reduce<IOpcodesTree>((rootNode, [code, def]) => {
  const processDef = (defcase: "upper" | "lower") => {
    const instrSplit = (defcase == "upper" ? def.name.toUpperCase() : def.name.toLowerCase()).split(" ");
    const instrName = instrSplit[0];
    const args = instrSplit[1] ? instrSplit[1].split(",") : [];
    let curNode = rootNode.get(instrName) || rootNode.set(instrName, newOpcodesNode()).get(instrName)!;

    curNode.help = def.doc;
    let title = instrName + " ";
    const params = args.map((arg, i) => {
      const start = title.length;
      title += arg;
      const end = title.length;
      if (i < args.length - 1) title += ", ";
      return ParameterInformation.create([start, end]);
    });
    curNode.signatures.push(SignatureInformation.create(title, def.doc, ...params));

    let parentNode = curNode;
    if (args.length == 0) {
      // this should only be possible once
      curNode.codes.push(code);
      if (parentNode != curNode) parentNode.codes.push(code);
      if (rootNode.get(instrName) != curNode) rootNode.get(instrName)?.codes.push(code);
    } else {
      for (let i = 0; i < args.length; i++) {
        const argi = instrName == "RST" ? "$N" : args[i];
        parentNode = curNode;
        curNode = curNode.args.get(argi) || curNode.args.set(argi, newOpcodesNode()).get(argi)!;
        curNode.signatures.push(SignatureInformation.create(title, def.doc, ...params));
        if (i == args.length - 1) {
          curNode.codes.push(code);
          if (parentNode != curNode) parentNode.codes.push(code);
          rootNode.get(instrName)?.codes.push(code);
        }
      }
    }
  };
  processDef("upper");
  processDef("lower");

  return rootNode;
}, new Map());

// export const getValidArgumentValue = (op: string, pos: 0 | 1 | 2) => {
//   const options = opcodesLookup.get(op)!;
//   return options.map((opt) => opt.args[pos]).filter((x) => x);
// };

// export const getOpcodesCompletion = (op:string, args:string[]) => {
//   const options = opcodesLookup.get(op);
//   if (options && options.length) {
//     if (args.length == 3) {

//     }
//     return options.filter(o => {
//       if (args.length)
//     })
//   }
// }
