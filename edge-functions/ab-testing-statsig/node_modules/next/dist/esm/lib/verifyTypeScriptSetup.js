import chalk from "next/dist/compiled/chalk";
import path from "path";
import { hasNecessaryDependencies } from "./has-necessary-dependencies";
import semver from "next/dist/compiled/semver";
import { CompileError } from "./compile-error";
import { FatalError } from "./fatal-error";
import * as log from "../build/output/log";
import { getTypeScriptIntent } from "./typescript/getTypeScriptIntent";
import { writeAppTypeDeclarations } from "./typescript/writeAppTypeDeclarations";
import { writeConfigurationDefaults } from "./typescript/writeConfigurationDefaults";
import { installDependencies } from "./install-dependencies";
import { isCI } from "../telemetry/ci-info";
import { missingDepsError } from "./typescript/missingDependencyError";
import { writeVscodeConfigurations } from "./typescript/writeVscodeConfigurations";
const requiredPackages = [
    {
        file: "typescript/lib/typescript.js",
        pkg: "typescript",
        exportsRestrict: true
    },
    {
        file: "@types/react/index.d.ts",
        pkg: "@types/react",
        exportsRestrict: true
    },
    {
        file: "@types/node/index.d.ts",
        pkg: "@types/node",
        exportsRestrict: true
    }, 
];
export async function verifyTypeScriptSetup({ dir , cacheDir , intentDirs , tsconfigPath , typeCheckPreflight , disableStaticImages , isAppDirEnabled  }) {
    const resolvedTsConfigPath = path.join(dir, tsconfigPath);
    try {
        var ref;
        // Check if the project uses TypeScript:
        const intent = await getTypeScriptIntent(dir, intentDirs, tsconfigPath);
        if (!intent) {
            return {
                version: null
            };
        }
        // Ensure TypeScript and necessary `@types/*` are installed:
        let deps = await hasNecessaryDependencies(dir, requiredPackages);
        if (((ref = deps.missing) == null ? void 0 : ref.length) > 0) {
            if (isCI) {
                // we don't attempt auto install in CI to avoid side-effects
                // and instead log the error for installing needed packages
                await missingDepsError(dir, deps.missing);
            }
            console.log(chalk.bold.yellow(`It looks like you're trying to use TypeScript but do not have the required package(s) installed.`) + "\n" + "Installing dependencies" + "\n\n" + chalk.bold("If you are not trying to use TypeScript, please remove the " + chalk.cyan("tsconfig.json") + " file from your package root (and any TypeScript files in your pages directory).") + "\n");
            await installDependencies(dir, deps.missing, true).catch((err)=>{
                if (err && typeof err === "object" && "command" in err) {
                    console.error(`Failed to install required TypeScript dependencies, please install them manually to continue:\n` + err.command + "\n");
                }
                throw err;
            });
            deps = await hasNecessaryDependencies(dir, requiredPackages);
        }
        // Load TypeScript after we're sure it exists:
        const tsPath = deps.resolved.get("typescript");
        const ts = await Promise.resolve(require(tsPath));
        if (semver.lt(ts.version, "4.3.2")) {
            log.warn(`Minimum recommended TypeScript version is v4.3.2, older versions can potentially be incompatible with Next.js. Detected: ${ts.version}`);
        }
        // Reconfigure (or create) the user's `tsconfig.json` for them:
        await writeConfigurationDefaults(ts, resolvedTsConfigPath, intent.firstTimeSetup, isAppDirEnabled);
        // Write out the necessary `next-env.d.ts` file to correctly register
        // Next.js' types:
        await writeAppTypeDeclarations(dir, !disableStaticImages);
        if (isAppDirEnabled && !isCI) {
            await writeVscodeConfigurations(dir, tsPath);
        }
        let result;
        if (typeCheckPreflight) {
            const { runTypeCheck  } = require("./typescript/runTypeCheck");
            // Verify the project passes type-checking before we go to webpack phase:
            result = await runTypeCheck(ts, dir, resolvedTsConfigPath, cacheDir, isAppDirEnabled);
        }
        return {
            result,
            version: ts.version
        };
    } catch (err) {
        // These are special errors that should not show a stack trace:
        if (err instanceof CompileError) {
            console.error(chalk.red("Failed to compile.\n"));
            console.error(err.message);
            process.exit(1);
        } else if (err instanceof FatalError) {
            console.error(err.message);
            process.exit(1);
        }
        throw err;
    }
}

//# sourceMappingURL=verifyTypeScriptSetup.js.map