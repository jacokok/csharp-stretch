import * as vscode from "vscode";
import { RegisterCommandArgs } from "./types";
import { getPath, createFile } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "csharpstretch.createClass",
    async (options: RegisterCommandArgs) => {
      console.log(options);
      await createFile(getPath(options));
      vscode.window.showInformationMessage("Hello World!");
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
