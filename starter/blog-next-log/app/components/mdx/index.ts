import { Timeline, TimelineItem } from "./Timeline";
import { FileTree, Folder, File } from "./FileTree";
import { CodeBlock } from "./CodeBlock";

export const mdxComponents = {
  Timeline,
  TimelineItem,
  FileTree,
  Folder,
  File,
  pre: CodeBlock,
};
