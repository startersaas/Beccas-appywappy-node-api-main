// ./common/exceptions.js
import ApplicationError from "../libs/errors/application.error.js";
import l from "./logger.js";

const notifyException = async (req, error) => {
  l.error(req);
  l.error(error);
  if (process.env.APP_ENV !== "development") {
    // await airbrakeClient.notify(error)
  }
};

const handleException = (req, res, error) => {
  notifyException(req, error);
  if (error instanceof ApplicationError) {
    res.status(error.status).json(error);
  } else {
    res.status(500).json(error);
  }
  res.status(500).json(error);
};

const wrap =
  (fn) =>
  (...args) =>
    fn(...args).catch((e) => {
      handleException(args[0], args[1], e);
    });

export { handleException, notifyException, wrap };
