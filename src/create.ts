import * as vscode from "vscode";
import { RegisterCommandArgs } from "./types";
import { getPath, createFile, fileWindow } from "./utils";

export const createClass = async (options: RegisterCommandArgs) => {
  const fileFolder = getPath(options);
  const filePath = await fileWindow("Class");
  if (filePath === undefined) {
    vscode.window.showErrorMessage("Could not find file path!");
    return;
  }
  await createFile(fileFolder, filePath, "class");
};
