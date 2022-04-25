import { writeFile } from "fs/promises";
import { RegisterCommandArgs } from "./types";
import * as vscode from "vscode";
import { getNamespace } from "./namespace";
import * as path from "path";

export const getPath = (options: RegisterCommandArgs) => {
  if (options) {
    return options._fsPath || options.fsPath || options.path;
  }

  return getRootPath();
};

export const getRootPath = () => {
  return vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : "";
};

export const createFile = async (
  fileFolder: string,
  fileName: string,
  templateName: string
) => {
  const namespace = await getNamespace(fileFolder);
  const filePath = path.join(fileFolder, fileName + ".cs");
  const template = await getTemplate(templateName, fileName, namespace);
  await saveTemplateToFile(template, filePath);
};

export const fileWindow = async (template: string) => {
  try {
    const newFilename = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      prompt: "Please enter a name for the new file(s)",
      value: `New${template}`,
    });
    return newFilename;
  } catch (errOnInput) {
    console.error("Error on input", errOnInput);

    vscode.window.showErrorMessage(
      "Error on input. See extension log for more info"
    );
  }
};

const saveTemplateToFile = async (template: string, filePath: string) => {
  const cursorPosition = findCursorInTemplate(template);
  const templateResult = template.replace("${cursor}", "");

  await writeFile(filePath, templateResult);

  const openedDoc = await vscode.workspace.openTextDocument(filePath);
  const editor = await vscode.window.showTextDocument(openedDoc);

  if (cursorPosition) {
    const newSelection = new vscode.Selection(cursorPosition, cursorPosition);
    editor.selection = newSelection;
  }
};

export const getTemplate = async (
  templateName: string,
  fileName: string,
  namespace: string
) => {
  const templatePath =
    vscode.extensions.getExtension("jacokok.csharp-stretch")?.extensionPath +
    "/templates/" +
    templateName +
    ".txt";

  const template = await (
    await vscode.workspace.openTextDocument(templatePath)
  ).getText();

  const namespaceRegex = new RegExp(/\${namespace}/, "g");
  const fileNameRegex = new RegExp(/\${fileName}/, "g");

  const templateResult = template
    .replace(namespaceRegex, namespace)
    .replace(fileNameRegex, fileName);

  return templateResult;
};

const findCursorInTemplate = (text: string): vscode.Position | null => {
  const cursorPos = text.indexOf("${cursor}");
  const preCursor = text.substring(0, cursorPos);
  const matchesForPreCursor = preCursor.match(/\n/gi);

  if (matchesForPreCursor === null) {
    return null;
  }

  const lineNum = matchesForPreCursor.length;
  const charNum = preCursor.substring(preCursor.lastIndexOf("\n")).length;

  return new vscode.Position(lineNum, charNum);
};
