import { cypressBlockTesting } from "~cypress/apiFunctions/blockTesting/cypress-testing";
import { Test } from "~cypress/types/cypress-types";

// Spec
export const test: Test = {
  name: `Course Syllabus Page`,
  tags: ["@course-syllabus-page", "@education"],
  pages: [
    [21675, "Undergraduate Course Syllabi", {}],
    [20614, "Graduate Course Syllabi", {}],
  ],
};

cypressBlockTesting(test);
