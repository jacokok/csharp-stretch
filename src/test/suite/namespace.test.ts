import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { getNamespace } from "../../namespace";

const fixturePath = path.resolve(__dirname, "../suite/");

interface Fixture {
  filename: string;
  csproj: string;
  expected: string | undefined;
}

suite("namespace", () => {
  const rootNameSpaceFixtures: Array<Fixture> = [
    {
      filename: "TestNamespace.csproj",
      csproj: `
      <Project Sdk="Microsoft.NET.Sdk.Web">
        <PropertyGroup>
          <RootNamespace>TestNamespace</RootNamespace>
        </PropertyGroup>
      </Project>`,
      expected: "TestNamespace",
    },
    {
      filename: "TestNamespaceNoRoot.csproj",
      csproj: `
      <Project Sdk="Microsoft.NET.Sdk.Web">
      </Project>`,
      expected: "TestNamespaceNoRoot",
    },
  ];

  rootNameSpaceFixtures.forEach(({ filename, csproj, expected }) => {
    test(`getNamespace from ${filename} with content ${csproj} should return expected result ${expected}`, async () => {
      const filePath = `${fixturePath}/${filename}`;
      fs.writeFileSync(filePath, csproj);
      const actual = await getNamespace(fixturePath);
      fs.unlinkSync(filePath);
      assert.strictEqual(actual, expected);
    });
  });

  test(`getNamespace with folder`, async () => {
    const actual = await getNamespace(fixturePath);
    assert.strictEqual(actual, "suite");
  });
});
