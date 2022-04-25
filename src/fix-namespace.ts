import * as vscode from "vscode";
import * as path from "path";
import { getNamespace } from "./namespace";

export const fixNamespace = async () => {
  const document = vscode.window.activeTextEditor?.document;
  if (typeof document === "undefined") {
    return;
  }

  const namespace = await getNamespace(path.dirname(document.fileName));

  const namespaceRegex = new RegExp(/namespace\s/g);
  let namespaceLine = -1;
  let isModernSyntax = false;
  for (let i = 0; i < document?.lineCount; i++) {
    const documentLine = document?.lineAt(i);
    if (namespaceRegex.exec(documentLine?.text)) {
      namespaceLine = i;
      isModernSyntax = documentLine?.text.includes(";");
      break;
    }
  }

  if (namespaceLine === -1) {
    vscode.window.showInformationMessage("Couldn't find namespace");
    return;
  }

  await vscode.window.activeTextEditor?.edit(
    (editBuilder: vscode.TextEditorEdit) => {
      editBuilder.delete(
        new vscode.Range(namespaceLine, 0, namespaceLine + 1, 0)
      );
      const newNamespaceLineValue = isModernSyntax
        ? `namespace ${namespace};\n`
        : `namespace ${namespace}\n`;
      editBuilder.insert(
        new vscode.Position(namespaceLine, 0),
        newNamespaceLineValue
      );
    }
  );
};
