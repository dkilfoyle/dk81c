import { opcodes } from "@/z80/decode";

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

interface IOpcodesNode {
  codes: number[];
  args: Map<string, IOpcodesNode>;
}
type IOpcodesTree = Map<string, IOpcodesNode>;

export const opcodesLookup = opcodes.entries().reduce<IOpcodesTree>((rootNode, [code, def]) => {
  const instrSplit = def.name.toUpperCase().split(" ");
  const instrName = instrSplit[0];
  const args = instrSplit[1] ? instrSplit[1].split(",") : [];
  let curNode = rootNode.get(instrName) || rootNode.set(instrName, { args: new Map(), codes: [] }).get(instrName)!;

  if (args.length == 0) {
    // this should only be possible once
    curNode.codes.push(code);
  } else {
    for (let i = 0; i < args.length; i++) {
      curNode = curNode.args.get(args[i]) || curNode.args.set(args[i], { args: new Map(), codes: [] }).get(args[i])!;
      if (i == args.length - 1) {
        curNode.codes.push(code);
      }
    }
  }

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
