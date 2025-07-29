import { TemplateType } from "./template-types";
export type RenderTemplateOptions = {
    data: string;
    title: string;
};
export declare const renderTemplate: (templateType: TemplateType, options: RenderTemplateOptions) => Promise<string>;
