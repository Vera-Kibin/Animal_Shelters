import os from "node:os";

function getHealth(req, res) {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: {
        rss: process.memoryUsage().rss,
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
      },
      system: {
        platform: os.platform(),
        nodeVersion: process.version,
      },
    },
  });
}

export { getHealth };
