export declare const build: ({ destPath, mainFile, srcDir }: {
    destPath: string;
    mainFile: string;
    srcDir: string;
}) => Promise<{
    mainFile: string;
    name: string;
    srcDir: string;
    srcPath: string;
    stat: import("fs").Stats;
}>;
