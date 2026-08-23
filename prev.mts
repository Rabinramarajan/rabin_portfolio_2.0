import { notificationHtml } from "@/lib/contact/email-template";
import { writeFileSync } from "fs";
const html = notificationHtml({
  referenceId: "RR-20260823-665E",
  receivedAt: "2026-08-23T13:11:41.883Z",
  payload: {
    name: "Zellavora Solutions", email: "zellavorasolutions@gmail.com",
    inquiryType: "Project" as never, message: "i want galaxy sofas web application needed",
    projectType: "Website", projectStage: "Idea / Planning" as never,
    technologies: ["Next.js"] as never, budget: "₹50K – ₹1L", timeline: "Flexible",
    engagement: "Fixed Project" as never,
    attachmentName: "Bala Vengadesh Resume Banking operations.pdf",
  } as never,
});
writeFileSync("C:/Users/suriy/AppData/Local/Temp/claude/preview.html", html);
console.log("bytes", html.length);
