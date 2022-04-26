import * as vscode from "vscode";

interface Config {
  showMenu: boolean;
  class: boolean;
  oldClass: boolean;
  interface: boolean;
  oldInterface: boolean;
}

export const configurationChangeListener = (
  context: vscode.ExtensionContext
) => {
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("csharpstretch")) {
        initConfiguration();
      }
    })
  );
};

export const initConfiguration = () => {
  const config = getConfiguration();
  vscode.commands.executeCommand(
    "setContext",
    "csharpstretch.showMenu",
    config.showMenu
  );

  vscode.commands.executeCommand(
    "setContext",
    "csharpstretch.class",
    config.class
  );

  vscode.commands.executeCommand(
    "setContext",
    "csharpstretch.oldClass",
    config.oldClass
  );

  vscode.commands.executeCommand(
    "setContext",
    "csharpstretch.interface",
    config.interface
  );

  vscode.commands.executeCommand(
    "setContext",
    "csharpstretch.oldInterface",
    config.oldInterface
  );
};

export const getConfiguration = () => {
  return vscode.workspace.getConfiguration(
    "csharpstretch"
  ) as unknown as Config;
};
