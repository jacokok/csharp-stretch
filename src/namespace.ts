import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export const getNamespace = async (fileName: string) => {
  // const fileDir = path.dirname(document.fileName);
  // const fileDir = path.dirname(fileName);
  const csprojInfo = getCsprojFile(fileName);

  if (!csprojInfo) {
    return "";
  }

  let rootNamespace = await getRootNameSpaceCsproj(csprojInfo.fullPath);

  if (!rootNamespace) {
    rootNamespace = getRootNamespaceFromFileName(csprojInfo.fileName);
  }

  const projectRootRelativePath = path.relative(csprojInfo.dir, fileName);

  const namespace = resolveNamespace(rootNamespace, projectRootRelativePath);

  return namespace;
};

const getRootNameSpaceCsproj = async (csprojPath: string) => {
  const csproj = await vscode.workspace.openTextDocument(csprojPath);
  const matches = csproj
    .getText()
    .match(/<RootNamespace>([\w.]+)<\/RootNamespace>/);

  if (!matches) {
    return;
  }

  return matches[1];
};

const getRootNamespaceFromFileName = (csprojFileName: string) => {
  return path.basename(csprojFileName, path.extname(csprojFileName));
};

const getCsprojFile = (fileDir: string) => {
  let searchDir = fileDir;
  const root = path.parse(fileDir).root;

  let fileName: string | undefined;

  for (let i = 0; i < 25; i++) {
    fileName = fs.readdirSync(searchDir).find((f) => /.\.csproj$/.test(f));

    if (!fileName && searchDir !== root) {
      searchDir = path.join(searchDir, "..");
    } else {
      break;
    }
  }

  if (!fileName) {
    return;
  }

  return {
    fileName: fileName,
    dir: searchDir,
    fullPath: path.join(searchDir, fileName),
  };
};

const resolveNamespace = (
  rootNamespace: string,
  projectRootRelativePath: string
) =>
  path
    .join(rootNamespace, projectRootRelativePath)
    .replace(/[\/\\]/g, ".")
    .replace(/[^\w.]/g, "_")
    .replace(/[.]{2,}/g, ".")
    .replace(/^[.]+/, "")
    .replace(/[.]+$/, "")
    .split(".")
    .map((s) => (/^[0-9]/.test(s) ? "_" + s : s))
    .join(".");
