import * as vscode from "vscode";
import { namespaceCompletion } from "./completions";
import { fixNamespace } from "./fix-namespace";
import { setContextActions } from "./contextActions";
import { fileCreator, fileWatcher } from "./fileWatcher";

export function activate(context: vscode.ExtensionContext) {
  setContextActions(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("csharpstretch.createFile", fileCreator)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("csharpstretch.fixNamespace", fixNamespace)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("csharpstretch.newCSFile", fileWatcher)
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

  // Check if new C# file was created
  const folders = vscode.workspace.workspaceFolders;
  if (folders) {
    const watcher = vscode.workspace.createFileSystemWatcher("**/*.cs");
    watcher.onDidCreate((uri) =>
      vscode.commands.executeCommand("csharpstretch.newCSFile", uri)
    );
    context.subscriptions.push(watcher);
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
