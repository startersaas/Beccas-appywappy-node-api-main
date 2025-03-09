import * as express from "express";
import { wrap } from "../../common/exceptions.js";
import workspaceController from "./workspace.controller.js";

export default express
  .Router()
  .post("/", wrap(workspaceController.create))
  .get("/", wrap(workspaceController.index))
  .get("/get-this-workspace/:name", wrap(workspaceController.getWorkspaceFile))
  .get("/:id", wrap(workspaceController.byId))
  .put("/:id", wrap(workspaceController.update))
  .delete("/:id", wrap(workspaceController.delete));