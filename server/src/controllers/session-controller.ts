import * as state from "./session-state-controller";
import * as flags from "./session-flag-controller";
import * as queries from "./session-query-controller";

export const sessionController = {
  ...state,
  ...queries,
  ...flags,
};
