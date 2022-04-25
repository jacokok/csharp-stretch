import * as vscode from "vscode";
import { namespaceCompletion } from "./completions";
import { fixNamespace } from "./fix-namespace";
import { createClass } from "./create";

export function activate(context: vscode.ExtensionContext) {
  vscode.commands.executeCommand("setContext", "csharpstretch.showMenu", true);
  const disposable = vscode.commands.registerCommand(
    "csharpstretch.createClass",
    createClass
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("csharpstretch.fixNamespace", fixNamespace)
  );

  const namespaceCompletionProvider =
    vscode.languages.registerCompletionItemProvider(
      { scheme: "file", language: "csharp" },
      {
        async provideCompletionItems(document) {
          return await namespaceCompletion(document.fileName);
        },
      }
    );

  context.subscriptions.push(namespaceCompletionProvider);
  context.subscriptions.push(disposable);
}

export function deactivate() {}
