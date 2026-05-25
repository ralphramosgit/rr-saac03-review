import type { Topic } from "../types";
import { topicMasterCore } from "./00_master_core";
import { topic00 } from "./00_critical";
import { topic01 } from "./01_overview";
import { topic02 } from "./02_compute";
import { topic03 } from "./03_storage";
import { topic04 } from "./04_database";
import { topic05 } from "./05_migration";
import { topic06 } from "./06_networking";
import { topic07 } from "./07_security";
import { topic08 } from "./08_management";
import { topic09 } from "./09_analytics";
import { topic10 } from "./10_billing";
import { topic11 } from "./11_developer";
import { topic12 } from "./12_appservices";
import { topic13 } from "./13_frontend";
import { topic14 } from "./14_desktop";
import { topic15 } from "./15_ml";
import { topic16 } from "./16_other";
import { topic17 } from "./17_comparisons";
import { topic18 } from "./18_drills";

export const TOPICS: Topic[] = [
  topicMasterCore,
  topic00,
  topic01,
  topic02,
  topic03,
  topic04,
  topic05,
  topic06,
  topic07,
  topic08,
  topic09,
  topic10,
  topic11,
  topic12,
  topic13,
  topic14,
  topic15,
  topic16,
  topic17,
  topic18,
];
