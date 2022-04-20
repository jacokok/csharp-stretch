import * as fs from "fs";
import { RegisterCommandArgs } from "./types";
import * as vscode from "vscode";
import { getNamespace } from "./namespace";

export const getPath = (options: RegisterCommandArgs) => {
  if (options) {
    return options._fsPath || options.fsPath || options.path;
  }

  return vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : "";
};

export const createFile = async (
  filename: string
  // templateName: string,
  // objectName: string,
  // namespace: string
) => {
  const namespace = await getNamespace(filename);
  let text = "namespace " + namespace + ";";
  await fs.writeFileSync(filename + "/test.json", text);
};
