import * as vscode from "vscode";
import { Uri } from "vscode";
import { getConfiguration } from "./configuration";
import { PickOption } from "./types";
import * as path from "path";
import { getNamespace } from "./namespace";
import {
  createFile,
  isFileEmpty,
  getPathAndFolder,
  getFolder,
  fileWindow,
  getTemplate,
  replaceEditorContentWithTemplate,
  pickSingleOrShow,
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

  const target = await pickSingleOrShow(getQuickPickList(), {
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
  const target = await pickSingleOrShow(getQuickPickList(), {
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

export const createInFile = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found to create file in.");
    return;
  }

  const doc = editor.document;
  if (path.extname(doc.fileName) !== ".cs") {
    vscode.window.showErrorMessage(
      "Active file must be a C# (.cs) file to use this command."
    );
    return;
  }

  const file = path.parse(doc.fileName).name;
  const fileFolder = getFolder(doc.uri);

  const target = await pickSingleOrShow(getQuickPickList(), {
    placeHolder: "Select file type",
  });

  if (target) {
    const namespace = await getNamespace(fileFolder);
    const template = await getTemplate(target.label, file, namespace);
    await replaceEditorContentWithTemplate(template, editor);
  }
};
