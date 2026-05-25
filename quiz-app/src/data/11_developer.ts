import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic11: Topic = {
  id: "11-developer",
  number: "11",
  title: "Developer Tools",
  weight: "Useful",
  blurb:
    "CodeCommit, CodeBuild, CodeDeploy, CodePipeline, Cloud9, CloudShell, X-Ray.",
  sections: [
    {
      id: "codesuite",
      title: "AWS Code* Suite",
      questions: [
        match("11-cs-m1", "Match each Code* service.", [
          { left: "CodeCommit", right: "Managed private Git repo" },
          { left: "CodeBuild", right: "Build + test on-demand" },
          { left: "CodeDeploy", right: "Deploy to EC2/Lambda/ECS/on-prem" },
          { left: "CodePipeline", right: "CI/CD orchestrator" },
          { left: "CodeArtifact", right: "Package manager (npm/Maven/pip)" },
          { left: "CodeStar", right: "Project templates (deprecated 2024)" },
          { left: "CodeGuru", right: "ML-based code review + profiler" },
          { left: "X-Ray", right: "Distributed tracing" },
        ]),
        mcq(
          "11-cs-1",
          "Trace a microservice request across Lambda + DDB + SQS:",
          ["CloudWatch Logs", "X-Ray", "CodeGuru", "Inspector"],
          1,
          "X-Ray = distributed tracing.",
        ),
      ],
    },
    {
      id: "codedeploy",
      title: "CodeDeploy Strategies",
      questions: [
        match("11-cd-m1", "Match each deployment strategy.", [
          { left: "In-place (EC2)", right: "Update in same instances" },
          {
            left: "Blue/Green (EC2/ECS/Lambda)",
            right: "New environment, swap traffic",
          },
          {
            left: "Canary (Lambda/ECS)",
            right: "Small % then 100% after bake",
          },
          { left: "Linear (Lambda/ECS)", right: "Equal increments over time" },
          { left: "AllAtOnce (Lambda)", right: "Shift 100% immediately" },
        ]),
        mcq(
          "11-cd-1",
          "Shift 10% Lambda traffic, wait 10 min, then 100% if no errors:",
          ["In-place", "Linear", "Canary", "AllAtOnce"],
          2,
          "Canary = small % then full after bake time.",
        ),
      ],
    },
    {
      id: "cloud9-shell",
      title: "Cloud9 vs CloudShell",
      questions: [
        match("11-c9-m1", "Match each.", [
          { left: "Cloud9", right: "Browser IDE on EC2 (collab, debug)" },
          {
            left: "CloudShell",
            right: "Browser shell with AWS CLI pre-installed, 1 GB free",
          },
        ]),
        mcq(
          "11-c9-1",
          "Quickly run a one-off AWS CLI command in your browser:",
          ["Cloud9", "CloudShell", "CodeBuild", "Cloud Development Kit"],
          1,
          "CloudShell is the simplest free CLI in browser.",
        ),
      ],
    },
  ],
};
