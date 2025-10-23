import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

const test: Test = {
  name: `TITW Index Pages`,
  tags: ["@titw", "@index-pages"],
  pages: [
    [6651, "Today with the President", { tags: ["article-index-page"] }],
    [6205, "Stories", { tags: ["article-index-page", "@review"], skip: true }], // The filter button is not showing up
    [5572, "Question and Answer", { tags: ["q&a-index-page"] }],
    [6204, "Practical Theology", { tags: ["article-index-page"] }],
    [7242, "Marriage, Prison, and God’s Word", { tags: ["article-detail-page"] }],
    [5616, "Discussion Starters", { tags: ["discussion-starter-index-page"] }],
    [2995, "Daily Devotional", { tags: ["devotional-collection-index"] }],
    [6222, "Bible Verses", { tags: ["bible-verses-index-page"] }],
    [12915, "Devotional Monthly Study", { tags: ["devotional-monthly-study-page"] }],
  ],
};

cypressBlockTesting(test);
