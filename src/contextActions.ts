import * as vscode from "vscode";
import { RegisterCommandArgs } from "./types";
import { getPath, createFile, fileWindow } from "./utils";
import {
  configurationChangeListener,
  initConfiguration,
} from "./configuration";

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
    async (options: RegisterCommandArgs) => {
      const fileFolder = getPath(options);
      const filePath = await fileWindow(name);
      if (filePath === undefined) {
        vscode.window.showErrorMessage("Could not find file path!");
        return;
      }
      await createFile(fileFolder, filePath, name);
    }
  );
  context.subscriptions.push(command);
};
