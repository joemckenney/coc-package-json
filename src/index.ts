import { commands, ExtensionContext, window, workspace } from "coc.nvim";
import { sortPackageJson } from "sort-package-json";

import path from "node:path";

export async function activate(context: ExtensionContext): Promise<void> {
  window.showInformationMessage("sort-package-json works!");

  context.subscriptions.push(
    commands.registerCommand("sort-package-json.Command", async () => {
      window.showInformationMessage("sort-package-json Commands works!");
    }),

    workspace.registerAutocmd({
      event: "BufWritePre",
      request: true,
      callback: async () => {
        const { nvim } = workspace;

        const filePath = await nvim.call("expand", ["%:p"]);
        const fileName = path.basename(filePath);

        if (fileName !== "package.json") {
          return;
        }

        const buffer = await nvim.buffer;

        const lines = await buffer.getLines();
        const content = lines.join("\n");

        try {
          const sorted = sortPackageJson(content);

          buffer.setLines(sorted.split("\n"), {
            start: 0,
            end: -1,
            strictIndexing: false,
          });
        } catch (err) {
          console.log(err);
        }
      },
    })
  );
}
