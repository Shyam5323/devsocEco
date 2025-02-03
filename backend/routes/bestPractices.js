// Routes setup
const recommendationController = require("./controllers/recommendationController");
router.get("/recommendations", recommendationController.getRecommendations);
router.post(
  "/recommendations/:recommendationId/implement",
  recommendationController.markImplemented
);
router.get(
  "/recommendations/history",
  recommendationController.getImplementationHistory
);
