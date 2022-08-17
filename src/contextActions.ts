import * as vscode from "vscode";
import { createFile, fileWindow, getFolder } from "./utils";
import {
  configurationChangeListener,
  initConfiguration,
} from "./configuration";
import { Uri } from "vscode";

export const setContextActions = (context: vscode.ExtensionContext) => {
  initConfiguration();
  configurationChangeListener(context);
  const actions = ["Class", "OldClass", "Interface", "OldInterface"];
  actions.map((name) => {
    setContextAction(context, name);
  });
};

const setContextAction = (context: vscode.ExtensionContext, name: string) => {
  const command = vscode.commands.registerCommand(
    `csharpstretch.create${name}`,
    async (options: Uri) => {
      if (!options) {
        const originalClipboard = await vscode.env.clipboard.readText();
        await vscode.commands.executeCommand("copyFilePath");
        const folder = await vscode.env.clipboard.readText();
        await vscode.env.clipboard.writeText(originalClipboard);
        const newUri = await vscode.Uri.file(folder);
        const fileFolder = getFolder(newUri);

        const filePath = await fileWindow(name);
        if (filePath === undefined) {
          vscode.window.showErrorMessage("Could not find file path!");
          return;
        }
        await createFile(fileFolder, filePath, name);
      } else {
        const fileFolder = getFolder(options);
        const filePath = await fileWindow(name);
        if (filePath === undefined) {
          vscode.window.showErrorMessage("Could not find file path!");
          return;
        }
        await createFile(fileFolder, filePath, name);
      }
    }
  );
  context.subscriptions.push(command);
};
