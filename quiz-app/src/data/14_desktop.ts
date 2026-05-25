import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic14: Topic = {
  id: "14-desktop",
  number: "14",
  title: "End-User Computing",
  weight: "Useful",
  blurb: "WorkSpaces, AppStream 2.0, WorkLink, WorkDocs.",
  sections: [
    {
      id: "workspaces",
      title: "Amazon WorkSpaces",
      questions: [
        match("14-ws-m1", "Match each WorkSpaces fact.", [
          {
            left: "What is it",
            right: "Managed VDI (persistent virtual desktops)",
          },
          { left: "OS options", right: "Windows, Amazon Linux, Ubuntu" },
          { left: "Pricing", right: "Monthly or hourly bundles" },
          {
            left: "Directory integration",
            right: "Simple AD / Managed AD / AD Connector",
          },
          { left: "Persistence", right: "Per-user persistent desktop" },
        ]),
        mcq(
          "14-ws-1",
          "Replace physical Windows laptops for remote workforce:",
          ["AppStream", "WorkSpaces", "EC2 Windows", "WorkLink"],
          1,
          "WorkSpaces = persistent virtual desktops.",
        ),
      ],
    },
    {
      id: "appstream-vs-workspaces",
      title: "AppStream vs WorkSpaces",
      questions: [
        match("14-as-m1", "Match each property.", [
          { left: "WorkSpaces", right: "Full desktop, persistent" },
          { left: "AppStream 2.0", right: "Stream single application" },
          {
            left: "Persistence",
            right: "WorkSpaces yes; AppStream optional storage",
          },
          {
            left: "Use case",
            right: "WorkSpaces = daily desktop; AppStream = app delivery",
          },
        ]),
        mcq(
          "14-as-1",
       