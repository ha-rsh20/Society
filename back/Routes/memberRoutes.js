const express = require("express");

const router = express.Router();

router.get("/members", require("../Controllers/MemberController").getMembers);
router.get(
  "/members/:id",
  require("../Controllers/MemberController").getOneMember,
);
router.post("/members", require("../Controllers/MemberController").addMember);
router.put(
  "/members/:id",
  require("../Controllers/MemberController").updateMember,
);
router.delete(
  "/members/:id",
  require("../Controllers/MemberController").deleteMember,
);

module.exports = router;
