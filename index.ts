import { type Plugin } from "vite";

interface ImportPrefixPluginOptions {
  prefix: string;
  fileRegex?: RegExp;
}

/**
 * Add a prefix to the import path of the files.
 * It will consider imports with single and double quotes.
 * This will affect 3 types of imports:
 * - `from "./file.js"`
 * - `import "./file.js"`
 * - `import("./file.js")`
 * @param options - The options for the plugin
 * @param options.prefix - The prefix to add to the import paths (e.g. "/my-prefix/")
 * @param [options.fileRegex=/\.(js|ts|jsx|tsx)$/] - Optional regex to filter which files get prefixed
 * @returns A Vite plugin that adds the prefix to the import path of the files.
 * @example
 * ```ts
 * addImportPrefix({
 *   prefix: "/my-prefix/",
 * })
 * // will transform:
 * import "./file.js"
 * // to:
 * import "/my-prefix/file.js"
 * ```
 * @example
 * ```ts
 * addImportPrefix({
 *   prefix: "/my-prefix/",
 *   fileRegex: /\.(js|ts|jsx|tsx)$/,
 * })
 * // will transform:
 * import * as file from "./file.js"
 * // to:
 * import * as file from "/my-prefix/file.js"
 * ```
 */
function addImportPrefix({
  prefix,
  fileRegex = /\.(js|ts|jsx|tsx)$/,
}: ImportPrefixPluginOptions): Plugin {
  return {
    name: "add-import-prefix",
    generateBundle(_options, bundle) {
      Object.keys(bundle).forEach((fileName) => {
        const chunk = bundle[fileName];
        if (chunk.type === "chunk") {
          if (!chunk.fileName.match(fileRegex)) return;

          const regx =
            /from\s+['"](\.\/.+?)['"]|import\s+['"](\.\/.+?)['"]|import\s*\(\s*['"](\.\/.+?)['"]\s*\)/g;
          chunk.code = chunk.code.replace(
            regx,
            (match, importPath, importPath2, importPath3) => {
              const finalPath = importPath || importPath2 || importPath3;
              if (!finalPath) return match;
              return match.replace(
                finalPath,
                `${prefix}${finalPath.replace(/^\.\//, "")}`
              );
            }
          );
        }
      });
    },
  };
}

export { addImportPrefix };
export default { addImportPrefix };
