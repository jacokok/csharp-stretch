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
  fileFolder: string,
  filename: string
  // templateName: string,
  // objectName: string,
  // namespace: string
) => {
  const namespace = await getNamespace(fileFolder);
  const activeDoc = vscode.window.activeTextEditor?.document;
  let text = "namespace " + namespace + ";";
  await fs.writeFileSync(`${fileFolder}/${filename}`, text);
};

export const fileWindow = async (template: string) => {
  try {
    let newFilename = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      prompt: "Please enter a name for the new file(s)",
      value: `New${template}`,
    });
    return newFilename;
  } catch (errOnInput) {
    console.error("Error on input", errOnInput);

    vscode.window.showErrorMessage(
      "Error on input. See extension log for more info"
    );
  }
};
