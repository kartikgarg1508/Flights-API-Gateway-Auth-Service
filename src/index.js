const express = require("express");
const { ServerConfig, LoggerConfig } = require("./config");
const apiRoutes = require("./routes");
const { rateLimit } = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 10,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use(
  "/searchservice",
  createProxyMiddleware({
    target: ServerConfig.SEARCH_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "/searchservice": "/",
    },
  })
);

app.use(
  "/bookingservice",
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "/bookingservice": "/",
    },
  })
);

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server started successfully at Port : ${ServerConfig.PORT}`);
  LoggerConfig.info("Successfully started server", {});
});
