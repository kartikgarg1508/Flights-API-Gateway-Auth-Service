const express = require("express");
const { ServerConfig, LoggerConfig } = require("./config");
const apiRoutes = require("./routes");
const { rateLimit } = require("express-rate-limit");

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 10,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server started successfully at Port : ${ServerConfig.PORT}`);
  LoggerConfig.info("Successfully started server", {});
});
