import * as vscode from "vscode";
import { Uri } from "vscode";
import { getConfiguration } from "./configuration";
import { PickOption } from "./types";
import {
  createFile,
  isFileEmpty,
  getPathAndFolder,
  getFolder,
  fileWindow,
} from "./utils";

const getQuickPickList = () => {
  const config = getConfiguration();

  const list: Array<PickOption> = [];
  if (config.class) {
    list.push({ label: "Class", description: "Create new Class" });
  }
  if (config.interface) {
    list.push({ label: "Interface", description: "Create new Interface" });
  }
  if (config.oldClass) {
    list.push({ label: "OldClass", description: "Create new OldClass" });
  }
  if (config.oldInterface) {
    list.push({
      label: "OldInterface",
      description: "Create new OldInterface",
    });
  }
  return list;
};

export const fileWatcher = async (options: Uri) => {
  const isEmpty = isFileEmpty(options);
  if (!isEmpty) {
    return;
  }

  const { file, folder } = getPathAndFolder(options);

  const target = await vscode.window.showQuickPick(getQuickPickList(), {
    placeHolder: "Select file type",
  });

  if (target) {
    await createFile(folder, file, target.label);
  }
};

export const fileCreator = async () => {
  const originalClipboard = await vscode.env.clipboard.readText();
  await vscode.commands.executeCommand("copyFilePath");
  const folder = await vscode.env.clipboard.readText();
  await vscode.env.clipboard.writeText(originalClipboard);
  const newUri = await vscode.Uri.file(folder);
  const fileFolder = getFolder(newUri);
  const target = await vscode.window.showQuickPick(getQuickPickList(), {
    placeHolder: "Select file type",
  });
  if (target) {
    const filePath = await fileWindow(target.label);
    if (filePath === undefined) {
      vscode.window.showErrorMessage("Could not find file path!");
      return;
    }
    await createFile(fileFolder, filePath, target.label);
  }
  // vscode.commands.executeCommand("csharpstretch.createClass", options);
};
