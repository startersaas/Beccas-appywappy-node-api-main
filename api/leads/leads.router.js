// api/leads/leads.router.js
import * as express from "express";
import { wrap } from "../../common/exceptions.js";
import leadController from "./lead.controller.js";

export default express
  .Router()
  .get("/", wrap(leadController.index))
  .get("/:id", wrap(leadController.byId))
  .post("/", wrap(leadController.create))               // Disabled but included
  .put("/:id", wrap(leadController.update))             // Disabled but included
  .delete("/:id", wrap(leadController.delete))          // Disabled but included
  .get("/generate-leads/:number", wrap(leadController.generateLeads))
  .get("/trial-leads", wrap(leadController.generateTrialLeads))
  .get("/subscriber-update-notifier", wrap(leadController.subscriberUpdateNotifier));

