import aj from "../config/arject.js";

const arcjetMiddleware = async (req, res, next) => {
  next(); // here add the next() because getting the bot isseu

  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          message:
            "You have exceeded the allowed number of requests. Please try again later.",
        });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Bot access denied",
          message: "Access denied for bots.",
        });
      }
      return res.status(403).json({
        error: "Access denied",
        message: "Your request has been blocked.",
      });
    }
    next();
  } catch (error) {
    console.log("Arcjet middleware error:", error);
    next(error);
  }
};

export default arcjetMiddleware;
