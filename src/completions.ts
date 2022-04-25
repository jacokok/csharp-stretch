import { getNamespace } from "./namespace";
import * as vscode from "vscode";
import * as path from "path";

export const namespaceCompletion = async (fileName: string) => {
  const namespace = await getNamespace(path.dirname(fileName));
  return createCompletions(namespace);
};

const createCompletions = (namespace: string) => {
  const moduleCompletion = new vscode.CompletionItem(
    namespace,
    vscode.CompletionItemKind.Module
  );
  const snippetCompletion = new vscode.CompletionItem(
    "namespace-fill",
    vscode.CompletionItemKind.Snippet
  );
  snippetCompletion.insertText = namespace;
  snippetCompletion.detail = namespace;
  return [moduleCompletion, snippetCompletion];
};
