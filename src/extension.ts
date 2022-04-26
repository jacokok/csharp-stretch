import * as vscode from "vscode";
import { namespaceCompletion } from "./completions";
import { fixNamespace } from "./fix-namespace";
import { setContextActions } from "./contextActions";

export function activate(context: vscode.ExtensionContext) {
  setContextActions(context);

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
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
