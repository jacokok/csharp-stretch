import * as vscode from "vscode";
import { RegisterCommandArgs } from "./types";
import { getPath, createFile, fileWindow } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "csharpstretch.createClass",
    async (options: RegisterCommandArgs) => {
      const fileFolder = getPath(options);
      const filePath = await fileWindow("Class");
      if (filePath === undefined) {
        vscode.window.showErrorMessage("Could not find file path!");
        return;
      }
      await createFile(fileFolder, filePath);
      console.log("test");
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
