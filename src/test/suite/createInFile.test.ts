import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { fileWatcher } from "../../fileWatcher";

// Helper to wait until a file is persisted to disk and stable, then return
const waitForFileSaved = async (filePath: string, timeout = 2000) => {
  const start = Date.now();
  const exists = (p: string) => fs.existsSync(p);
  while (Date.now() - start < timeout) {
    if (exists(filePath)) {
      try {
        const first = fs.statSync(filePath).size;
        await new Promise((r) => setTimeout(r, 50));
        const second = fs.statSync(filePath).size;
        if (first === second) return;
      } catch {
        // file might be temporarily unavailable; keep waiting
      }
    }
    await new Promise((r) => setTimeout(r, 50));
  }
};

suite("createInFile", () => {
  test("createInFile command replaces content of Test.cs with template and saves file", async () => {
    const fixturePath = path.resolve(__dirname, "../suite/");
    const filePath = path.join(fixturePath, "Test.cs");

    // Ensure an empty file exists
    fs.writeFileSync(filePath, "");

    // Open the file in the editor
    const doc = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(doc);

    // Stub showQuickPick to return Class option (typed)
    const win = vscode.window as unknown as {
      showQuickPick: <T>(
        items: T[] | Thenable<T[]>,
        options?: vscode.QuickPickOptions
      ) => Promise<T | undefined>;
    };
    const originalShowQuickPick = win.showQuickPick;
    win.showQuickPick = async <T>() =>
      ({ label: "Class" } as unknown as T | undefined);

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
      win.showQuickPick = originalShowQuickPick;

      // Cleanup — wait until file is fully saved and close editor before removing
      try {
        await waitForFileSaved(filePath);
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );
        fs.unlinkSync(filePath);
      } catch {
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

    // Stub workspace config to only have Class enabled (typed)
    const ws = vscode.workspace as unknown as {
      getConfiguration: (section?: string) => Record<string, boolean>;
    };
    const originalGetConfiguration = ws.getConfiguration;
    ws.getConfiguration = () => ({
      showMenu: true,
      showMenuOnFiles: false,
      class: true,
      oldClass: false,
      interface: false,
      oldInterface: false,
    });

    // Replace showQuickPick with a function that throws if called (typed)
    const win2 = vscode.window as unknown as {
      showQuickPick: <T>(
        items: T[] | Thenable<T[]>,
        options?: vscode.QuickPickOptions
      ) => Promise<T | undefined>;
    };
    const originalShowQuickPick = win2.showQuickPick;
    win2.showQuickPick = async () => {
      throw new Error("showQuickPick should not be called");
    };

    try {
      // Run the command
      await vscode.commands.executeCommand("csharpstretch.createInFile");

      const text = editor.document.getText();
      assert.ok(text.includes("public class TestAuto"));
    } finally {
      win2.showQuickPick = originalShowQuickPick;
      ws.getConfiguration = originalGetConfiguration;

      try {
        await waitForFileSaved(filePath);
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );
        fs.unlinkSync(filePath);
      } catch {
        // ignore
      }
    }
  });

  test("auto-selects single option for fileWatcher without showing QuickPick", async () => {
    const fixturePath = path.resolve(__dirname, "../suite/");
    const filePath = path.join(fixturePath, "TestAuto2.cs");

    // Ensure an empty file exists
    fs.writeFileSync(filePath, "");

    // Stub workspace config to only have Class enabled (typed)
    const ws2 = vscode.workspace as unknown as {
      getConfiguration: (section?: string) => Record<string, boolean>;
    };
    const originalGetConfiguration = ws2.getConfiguration;
    ws2.getConfiguration = () => ({
      showMenu: true,
      showMenuOnFiles: false,
      class: true,
      oldClass: false,
      interface: false,
      oldInterface: false,
    });

    // Replace showQuickPick with a function that throws if called (typed)
    const win3 = vscode.window as unknown as {
      showQuickPick: <T>(
        items: T[] | Thenable<T[]>,
        options?: vscode.QuickPickOptions
      ) => Promise<T | undefined>;
    };
    const originalShowQuickPick = win3.showQuickPick;
    win3.showQuickPick = async () => {
      throw new Error("showQuickPick should not be called");
    };

    try {
      // Call fileWatcher with the file URI
      await fileWatcher(vscode.Uri.file(filePath));

      const diskContent = fs.readFileSync(filePath, "utf8");
      assert.ok(diskContent.includes("public class TestAuto2"));
    } finally {
      win3.showQuickPick = originalShowQuickPick;
      ws2.getConfiguration = originalGetConfiguration;

      try {
        await waitForFileSaved(filePath);
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );
        fs.unlinkSync(filePath);
      } catch {
        // ignore
      }
    }
  });
});
