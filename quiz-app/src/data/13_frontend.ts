import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic13: Topic = {
  id: "13-frontend",
  number: "13",
  title: "Frontend & Mobile Services",
  weight: "Useful",
  blurb: "Amplify, AppSync, Device Farm, Location, Pinpoint, SES, SNS.",
  sections: [
    {
      id: "comm-services",
      title: "Pinpoint vs SES vs SNS",
      questions: [
        match("13-cs-m1", "Match each service.", [
          { left: "SES", right: "Bulk transactional/marketing email" },
          { left: "SNS", right: "Notifications + SMS + mobile push" },
          {
            left: "Pinpoint",
            right: "Targeted campaigns, segmentation, analytics",
          },
        ]),
        mcq(
          "13-cs-1",
          "Customer engagement campaign with segmentation + A/B test:",
          ["SNS", "SES", "Pinpoint", "EventBridge"],
          2,
          "Pinpoint is campaign / engagement focused.",
        ),
      ],
    },
    {
      id: "frontend-mobile",
      title: "Amplify, AppSync, Device Farm, Location",
      questions: [
        match("13-fr-m1", "Match each service.", [
          {
            left: "Amplify",
            right: "Mobile/web fullstack framework + hosting",
          },
          { left: "AppSync", right: "GraphQL backend" },
          { left: "Device Farm", right: "Test apps on real devices" },
          {
            left: "Location Service",
            right: "Maps, geocoding, tracking, geofences",
          },
        ]),
        mcq(
          "13-fr-1",
          "Test your i