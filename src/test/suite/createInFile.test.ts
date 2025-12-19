import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { fileWatcher } from "../../fileWatcher";

suite("createInFile", () => {
  test("createInFile command replaces content of Test.cs with template and saves file", async () => {
    const fixturePath = path.resolve(__dirname, "../suite/");
    const filePath = path.join(fixturePath, "Test.cs");

    // Ensure an empty file exists
    fs.writeFileSync(filePath, "");

    // Open the file in the editor
    const doc = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(doc);

    // Stub showQuickPick to return Class option
    const originalShowQuickPick = (vscode.window as any).showQuickPick;
    (vscode.window as any).showQuickPick = async () => ({ label: "Class" });

    try {
      // Run the command that should replace the editor content
      await vscode.commands.executeCommand("csharpstretch.createInFile");

      // Ensure the document text contains the generated class
      const text = editor.document.getText();
      assert.ok(text.includes("public class Test"));
      assert.ok(text.includes("namespace "));

      // Ensure file was saved to disk
      const diskContent = fs.readFileSync(filePath, "utf8");
      assert.ok(diskContent.includes("public class Test"));
    } finally {
      // Restore QuickPick
      (vscode.window as any).showQuickPick = originalShowQuickPick;

      // Cleanup
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // ignore
      }
    }
  });

  test("auto-selects single option for createInFile without showing QuickPick", async () => {
    const fixturePath = path.resolve(__dirname, "../suite/");
    const filePath = path.join(fixturePath, "TestAuto.cs");

    // Ensure an empty file exists
    fs.writeFileSync(filePath, "");

    // Open the file in the editor
    const doc = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(doc);

    // Stub workspace config to only have Class enabled
    const originalGetConfiguration = (vscode.workspace as any).getConfiguration;
    (vscode.workspace as any).getConfiguration = () => ({
      showMenu: true,
      showMenuOnFiles: false,
      class: true,
      oldClass: false,
      interface: false,
      oldInterface: false,
    });

    // Replace showQuickPick with a function that throws if called
    const originalShowQuickPick = (vscode.window as any).showQuickPick;
    (vscode.window as any).showQuickPick = async () => {
      throw new Error("showQuickPick should not be called");
    };

    try {
      // Run the command
      await vscode.commands.executeCommand("csharpstretch.createInFile");

      const text = editor.document.getText();
      assert.ok(text.includes("public class TestAuto"));
    } finally {
      (vscode.window as any).showQuickPick = originalShowQuickPick;
      (vscode.workspace as any).getConfiguration = originalGetConfiguration;

      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // ignore
      }
    }
  });

  test("auto-selects single option for fileWatcher without showing QuickPick", async () => {
    const fixturePath = path.resolve(__dirname, "../suite/");
    const filePath = path.join(fixturePath, "TestAuto2.cs");

    // Ensure an empty file exists
    fs.writeFileSync(filePath, "");

    // Stub workspace config to only have Class enabled
    const originalGetConfiguration = (vscode.workspace as any).getConfiguration;
    (vscode.workspace as any).getConfiguration = () => ({
      showMenu: true,
      showMenuOnFiles: false,
      class: true,
      oldClass: false,
      interface: false,
      oldInterface: false,
    });

    // Replace showQuickPick with a function that throws if called
    const originalShowQuickPick = (vscode.window as any).showQuickPick;
    (vscode.window as any).showQuickPick = async () => {
      throw new Error("showQuickPick should not be called");
    };

    try {
      // Call fileWatcher with the file URI
      await fileWatcher(vscode.Uri.file(filePath));

      const diskContent = fs.readFileSync(filePath, "utf8");
      assert.ok(diskContent.includes("public class TestAuto2"));
    } finally {
      (vscode.window as any).showQuickPick = originalShowQuickPick;
      (vscode.workspace as any).getConfiguration = originalGetConfiguration;

      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // ignore
      }
    }
  });
});
