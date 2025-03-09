// server.js
import Express from "express";
import morgan from "morgan";
import * as http from "http";
import * as os from "os";
import l from "./common/logger.js";
import passport from "passport";
import compression from "compression";
import { handleException } from "./common/exceptions.js";
import { setLang } from "./middlewares/lang.middleware.js";
import cron from "node-cron";
import SubscriptionService from "./api/subscriptions/subscription.service.js";

import "./common/passport.js";

const app = new Express();

export default class ExpressServer {
  constructor() {
    // Request logging middleware
    app.use((req, res, next) => {
      console.log('Request Details:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        path: req.path,
        origin: req.headers.origin,
        referer: req.headers.referer,
        host: req.headers.host,
        fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        headers: req.headers
      });
      next();
    });

    // Standard middleware
    if (process.env.ENABLE_HTTP_LOGGER === "true") {
      app.use(morgan('combined'));
    }

    app.use(Express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf;
      }
    }));
    
    app.use(Express.urlencoded({ extended: false }));
    app.use(compression());
    app.use(setLang());
    app.use(passport.initialize());

    // Custom middleware for additional processing
    app.use((req, res, next) => {
      // Add request timestamp
      req.requestTime = Date.now();
      next();
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Express error:', {
        message: err.message,
        stack: err.stack,
        type: err.name,
        url: req.url,
        method: req.method,
        headers: req.headers
      });

      handleException(req, res, err);
    });
  }

  router(routes) {
    routes(app);
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = (p) => () => {
      l.info(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
      l.info(`Server listening on port: ${p}`);
      l.info(`Server hostname: ${os.hostname()}`);
    };

    http.createServer(app).listen(port, welcome(port));
    return this;
  }

  initCron() {
    cron.schedule(
      "1 0 * * *",
      () => {
        SubscriptionService.runNotifyExpiringTrials();
        SubscriptionService.runNotifyPaymentFailed();
      },
      {
        scheduled: true,
      }
    );
    return this;
  }
}

