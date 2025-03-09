import * as express from "express";
import { wrap } from "../../common/exceptions.js";
import publicController from "./public.controller.js";

export default express
  .Router()
  .get("/get-all-resources", wrap(publicController.getAllResources))
  .get("/get-all-resources/:name", wrap(publicController.getResourceByName));

