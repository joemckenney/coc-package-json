import {
  commands,
  CompleteResult,
  ExtensionContext,
  listManager,
  sources,
  window,
  workspace,
} from "coc.nvim";
import { sortPackageJson } from "sort-package-json";

import path from "node:path";
import DemoList from "./lists";

export async function activate(context: ExtensionContext): Promise<void> {
  window.showInformationMessage("sort-package-json works!");

  context.subscriptions.push(
    commands.registerCommand("sort-package-json.Command", async () => {
      window.showInformationMessage("sort-package-json Commands works!");
    }),

    listManager.registerList(new DemoList()),

    sources.createSource({
      name: "sort-package-json completion source", // unique id
      doComplete: async () => {
        const items = await getCompletionItems();
        return items;
      },
    }),

    workspace.registerKeymap(
      ["n"],
      "sort-package-json-keymap",
      async () => {
        window.showInformationMessage("registerKeymap");
      },
      { sync: false }
    ),

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

async function getCompletionItems(): Promise<CompleteResult> {
  return {
    items: [
      {
        word: "TestCompletionItem 1",
        menu: "[sort-package-json]",
      },
      {
        word: "TestCompletionItem 2",
        menu: "[sort-package-json]",
      },
    ],
  };
}
