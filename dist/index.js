"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(src_exports);
var import_coc2 = require("coc.nvim");
var import_sort_package_json = require("sort-package-json");
var import_node_path = __toESM(require("node:path"));

// src/lists.ts
var import_coc = require("coc.nvim");
var DemoList = class extends import_coc.BasicList {
  constructor() {
    super();
    this.name = "demo_list";
    this.description = "CocList for sort-package-json";
    this.defaultAction = "open";
    this.actions = [];
    this.addAction("open", (item) => {
      import_coc.window.showInformationMessage(`${item.label}, ${item.data.name}`);
    });
  }
  async loadItems(context) {
    return [
      {
        label: "sort-package-json list item 1",
        data: { name: "list item 1" }
      },
      {
        label: "sort-package-json list item 2",
        data: { name: "list item 2" }
      }
    ];
  }
};

// src/index.ts
async function activate(context) {
  import_coc2.window.showInformationMessage("sort-package-json works!");
  context.subscriptions.push(
    import_coc2.commands.registerCommand("sort-package-json.Command", async () => {
      import_coc2.window.showInformationMessage("sort-package-json Commands works!");
    }),
    import_coc2.listManager.registerList(new DemoList()),
    import_coc2.sources.createSource({
      name: "sort-package-json completion source",
      // unique id
      doComplete: async () => {
        const items = await getCompletionItems();
        return items;
      }
    }),
    import_coc2.workspace.registerKeymap(
      ["n"],
      "sort-package-json-keymap",
      async () => {
        import_coc2.window.showInformationMessage("registerKeymap");
      },
      { sync: false }
    ),
    import_coc2.workspace.registerAutocmd({
      event: "BufWritePre",
      request: true,
      callback: async () => {
        const { nvim } = import_coc2.workspace;
        const filePath = await nvim.call("expand", ["%:p"]);
        const fileName = import_node_path.default.basename(filePath);
        if (fileName !== "package.json") {
          return;
        }
        const buffer = await nvim.buffer;
        const lines = await buffer.getLines();
        const content = lines.join("\n");
        try {
          const sorted = (0, import_sort_package_json.sortPackageJson)(content);
          buffer.setLines(sorted.split("\n"), {
            start: 0,
            end: -1,
            strictIndexing: false
          });
        } catch (err) {
          console.log(err);
        }
      }
    })
  );
}
async function getCompletionItems() {
  return {
    items: [
      {
        word: "TestCompletionItem 1",
        menu: "[sort-package-json]"
      },
      {
        word: "TestCompletionItem 2",
        menu: "[sort-package-json]"
      }
    ]
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
