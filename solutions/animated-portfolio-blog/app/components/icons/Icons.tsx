import React, { ReactElement } from "react";
import {
  Monitor,
  Info,
  HelpCircle,
  Code,
  Link as LinkIcon,
  Mail,
  Shield,
  Bot,
  Leaf,
  Gamepad2,
  AppWindow,
  Timer,
  Wrench,
  CalendarClock,
  FileText,
  MessageSquare,
  Newspaper,
  Home,
  Quote,
  ArrowUpRight,
} from "lucide-react";

// Brand glyphs as hand-rolled SVGs (lucide deprecated brand icons). Like
// Medium.tsx, each sets width/height + fill="currentColor" so it inherits
// color (both themes + hover) and renders at a sane default size.
import Twitter from "./Twitter";
import FacebookIcon from "./Facebook";
import GitHubIcon from "./Github";
import LinkedInIcon from "./Linkedin";

// Tech logos (programming languages, databases, frameworks) — already custom SVGs.
import CppIcon from "./CplusplusPlain";
import JavaIcon from "./JavaPlainWordmark";
import ScalaIcon from "./Scala";
import KotlinIcon from "./Kotlin";
import AngularIcon from "./AngularjsPlainWordmark";
import JavaScriptIcon from "./JavascriptPlain";
import MongoDBIcon from "./MongodbPlainWordmark";
import MySQLIcon from "./MysqlPlainWordmark";
import NodejsIcon from "./NodejsPlainWordmark";
import PHPIcon from "./PhpPlain";
import ReactIcon from "./ReactOriginalWordmark";
import TypeScriptIcon from "./TypescriptPlain";
import GraphQLIcon from "./Graphql";
import TerraformIcon from "./Terraform";
import PostgresIcon from "./Postgresql";
import KubernetesIcon from "./Kubernetes";
import MediumIcon from "./Medium";

const Icons = {
  email: Mail,
  facebook: FacebookIcon,
  twitter: Twitter,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  projectSection: Monitor,
  aboutSection: Info,
  reviewSection: MessageSquare,
  cpp: CppIcon,
  java: JavaIcon,
  typescript: TypeScriptIcon,
  javascript: JavaScriptIcon,
  mysql: MySQLIcon,
  php: PHPIcon,
  mongodb: MongoDBIcon,
  nodejs: NodejsIcon,
  react: ReactIcon,
  angular: AngularIcon,
  graphql: GraphQLIcon,
  helpoutline: HelpCircle,
  code: Code,
  link: LinkIcon,
  security: Shield,
  energy: Leaf,
  smartToy: Bot,
  videoGame: Gamepad2,
  timer: Timer,
  app: AppWindow,
  scala: ScalaIcon,
  kotlin: KotlinIcon,
  schedule: CalendarClock,
  tools: Wrench,
  terraform: TerraformIcon,
  postgresql: PostgresIcon,
  kubernetes: KubernetesIcon,
  cv: FileText,
  home: Home,
  blog: Newspaper,
  medium: MediumIcon,
  formatQuote: Quote,
  arrowOutward: ArrowUpRight,
};

export type IconKey = keyof typeof Icons;

export const getIcon = (key: IconKey, className?: string): ReactElement => {
  const IconComponent = Icons[key];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <span>Missing icon: {key}</span>;
};

// Human-readable names for icons whose registry key isn't already a clean
// display name — used for tooltips, alt text, etc. Keys not listed fall back
// to a Title-cased version of the registry key.
const iconLabels: Partial<Record<IconKey, string>> = {
  java: "Java",
  cpp: "C++",
  typescript: "TypeScript",
  scala: "Scala",
  kotlin: "Kotlin",
  nodejs: "Node.js",
  react: "React",
  graphql: "GraphQL",
  postgresql: "PostgreSQL",
  terraform: "Terraform",
  mongodb: "MongoDB",
  kubernetes: "Kubernetes",
};

export const getIconLabel = (key: IconKey): string =>
  iconLabels[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
