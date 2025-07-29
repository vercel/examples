import * as citty from 'citty';

declare const tunnel: citty.CommandDef<{
    url: {
        type: "positional";
        description: string;
        required: false;
    };
    port: {
        type: "string";
        description: string;
    };
    hostname: {
        type: "string";
        description: string;
        valueHint: string;
    };
    protocol: {
        type: "string";
        description: string;
        valueHint: string;
    };
}>;
declare const main: citty.CommandDef<citty.ArgsDef>;
declare const runMain: () => Promise<void>;

export { main, runMain, tunnel };
