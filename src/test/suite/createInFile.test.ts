import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

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
});
