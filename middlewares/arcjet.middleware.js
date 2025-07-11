import aj from "../config/arcjet.js";
import fingerprint from "@arcjet/node";

const arcjetMiddleware = async (req, res, next) => {
  try {

    const isLocal = ['127.0.0.1', '::1'].includes(req.ip);

    const decision = await aj.protect(req, {
      contextOverrides: isLocal ? { 'ip.src': '8.8.8.8' } : {},
      requested: 1, // REQUIRED for token bucket rate limiting
    });

    console.log("Arcjet decision:", decision);


    console.log("Arcjet decision:", decision);


    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Rate limit exceeded. Please try again later.",
        });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Access denied for bots.",
        });
      }

      return res.status(403).json({
        error: "Request denied.",
      });
    }

    next(); 

  } catch (error) {
    console.error("Arcjet Middleware Error:", error);
    next(error);
  }
};


export default arcjetMiddleware;
