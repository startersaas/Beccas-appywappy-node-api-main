// api/tokens/tokens.router.js
import * as express from "express";
import { wrap } from "../../common/exceptions.js";
import tokenController from "./token.controller.js";

export default express
  .Router()
  .get("/", wrap(tokenController.index))
  .put("/:id/deactivate", wrap(tokenController.deactivateToken))
  .post("/generate", wrap(tokenController.generateToken));

