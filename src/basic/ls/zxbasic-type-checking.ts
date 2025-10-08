/******************************************************************************
 * Copyright 2024 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import type { InferOperatorWithMultipleOperands, InferOperatorWithSingleOperand, TypirServices, ValidationProblemAcceptor } from "typir";
import type { LangiumTypeSystemDefinition, TypirLangiumServices, TypirLangiumSpecifics } from "typir-langium";
import {
  BinaryExpression,
  isBinaryExpression,
  isUnaryExpression,
  NumericLiteral,
  NumericVariable,
  StatementFor,
  StatementIf,
  StatementLet,
  StringLiteral,
  StringVariable,
  UnaryExpression,
  type ZxbasicAstType,
} from "./generated/ast.js";

export interface ZxbasicSpecifics extends TypirLangiumSpecifics {
  AstTypes: ZxbasicAstType; // all AST types from the generated `ast.ts`
}

export class ZxbasicTypeSystem implements LangiumTypeSystemDefinition<ZxbasicSpecifics> {
  onInitialize(typir: TypirLangiumServices<ZxbasicSpecifics>): void {
    // define primitive types
    const typeNumber = typir.factory.Primitives.create({ primitiveName: "number" })
      .inferenceRule({ languageKey: NumericLiteral.$type })
      .inferenceRule({ languageKey: NumericVariable.$type })
      .finish();
    const typeString = typir.factory.Primitives.create({ primitiveName: "string" })
      .inferenceRule({ languageKey: StringLiteral.$type })
      .inferenceRule({ languageKey: StringVariable.$type })
      .finish();

    // extract inference rules, which is possible here thanks to the unified structure of the Langium grammar (but this is not possible in general!)
    const binaryInferenceRule: InferOperatorWithMultipleOperands<ZxbasicSpecifics, BinaryExpression> = {
      filter: isBinaryExpression,
      matching: (node: BinaryExpression, name: string) => node.operator === name,
      operands: (node: BinaryExpression) => [node.left, node.right],
      validateArgumentsOfCalls: true,
    };

    const unaryInferenceRule: InferOperatorWithSingleOperand<ZxbasicSpecifics, UnaryExpression> = {
      filter: isUnaryExpression,
      matching: (node: UnaryExpression, name: string) => node.op === name,
      operand: (node: UnaryExpression) => node.operand,
      validateArgumentsOfCalls: true,
    };

    // define operators
    // binary operators: numbers => number
    for (const operator of ["-", "**", "*", "/"]) {
      typir.factory.Operators.createBinary({ name: operator, signature: { left: typeNumber, right: typeNumber, return: typeNumber } })
        .inferenceRule(binaryInferenceRule)
        .finish();
    }

    for (const operator of ["+"]) {
      typir.factory.Operators.createBinary({
        name: operator,
        signatures: [
          { left: typeNumber, right: typeNumber, return: typeNumber },
          { left: typeString, right: typeString, return: typeString },
        ],
      })
        .inferenceRule(binaryInferenceRule)
        .finish();
    }

    // binary operators: numbers => boolean
    for (const operator of ["<", "<=", ">", ">="]) {
      typir.factory.Operators.createBinary({
        name: operator,
        signatures: [
          { left: typeNumber, right: typeNumber, return: typeNumber },
          { left: typeString, right: typeString, return: typeNumber },
        ],
      })
        .inferenceRule(binaryInferenceRule)
        .finish();
    }
    // binary operators: booleans => boolean
    for (const operator of ["AND", "OR"]) {
      typir.factory.Operators.createBinary({ name: operator, signature: { left: typeNumber, right: typeNumber, return: typeNumber } })
        .inferenceRule(binaryInferenceRule)
        .finish();
    }
    // ==, != for booleans and numbers
    for (const operator of ["=", "<>"]) {
      typir.factory.Operators.createBinary({
        name: operator,
        signatures: [
          { left: typeNumber, right: typeNumber, return: typeNumber },
          { left: typeString, right: typeString, return: typeNumber },
        ],
      })
        .inferenceRule(binaryInferenceRule)
        .finish();
    }

    // unary operators
    for (const operator of ["+", "-", "ABS", "ACS", "ASN", "ATN", "COS", "EXP", "INT", "LN", "NOT", "PEEK", "SGN", "SIN", "SQR", "TAN", "USR"])
      typir.factory.Operators.createUnary({ name: operator, signature: { operand: typeNumber, return: typeNumber } })
        .inferenceRule(unaryInferenceRule)
        .finish();

    for (const operator of ["CODE", "LEN", "VAL"])
      typir.factory.Operators.createUnary({ name: operator, signature: { operand: typeString, return: typeNumber } })
        .inferenceRule(unaryInferenceRule)
        .finish();

    for (const operator of ["CHR$", "STR$"])
      typir.factory.Operators.createUnary({ name: operator, signature: { operand: typeNumber, return: typeString } })
        .inferenceRule(unaryInferenceRule)
        .finish();

    // additional inference rules ...
    typir.Inference.addInferenceRulesForAstNodes({
      ParenExpression: (languageNode) => {
        return languageNode.operand;
      },
      SysFunctionCall: (languageNode) => {
        switch (languageNode.command) {
          case "INKEY$":
            return typeString;
          case "PI":
            return typeNumber;
          case "RND":
            return typeNumber;
        }
      },
    });

    // explicit validations for typing issues, realized with Typir (which replaced corresponding functions in the OxValidator!)
    typir.validation.Collector.addValidationRulesForAstNodes({
      StatementLet: (node: StatementLet, accept: ValidationProblemAcceptor<ZxbasicSpecifics>, typir: TypirServices<ZxbasicSpecifics>) => {
        typir.validation.Constraints.ensureNodeIsAssignable(
          node.value,
          node.name.endsWith("$") ? typeString : typeNumber,
          accept,
          (actual, expected) => ({
            message: `The expression '${node.value.$cstNode?.text}' of type '${actual.name}' is not assignable to the variable '${node.name}' with type '${expected.name}'.`,
            languageProperty: "value",
          })
        );
      },
      StatementFor: (node: StatementFor, accept: ValidationProblemAcceptor<ZxbasicSpecifics>, typir: TypirServices<ZxbasicSpecifics>) => {
        typir.validation.Constraints.ensureNodeIsAssignable(node.from, typeNumber, accept, () => ({
          message: "FROM expression needs to be evaluated to 'number'.",
          languageProperty: "from",
        }));
        typir.validation.Constraints.ensureNodeIsAssignable(node.from, typeNumber, accept, () => ({
          message: "TO expression needs to be evaluated to 'number'.",
          languageProperty: "to",
        }));
        typir.validation.Constraints.ensureNodeIsAssignable(node.step, typeNumber, accept, () => ({
          message: "STEP expression needs to be evaluated to 'number'.",
          languageProperty: "step",
        }));
      },
      StatementIf: (node: StatementIf, accept: ValidationProblemAcceptor<ZxbasicSpecifics>, typir: TypirServices<ZxbasicSpecifics>) => {
        typir.validation.Constraints.ensureNodeIsAssignable(node.test, typeNumber, accept, () => ({
          message: "IF expression needs to be evaluated to 'number'.",
          languageProperty: "test",
        }));
      },
    });
  }

  // onNewAstNode(languageNode: AstNode, typir: TypirLangiumServices<ZxbasicSpecifics>): void {}
  onNewAstNode() {}
}
