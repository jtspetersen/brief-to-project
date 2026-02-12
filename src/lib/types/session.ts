import type { StageNumber } from "./stages";
import type { Artifact } from "./artifacts";

/** Project context gathered during the conversation */
export interface ProjectContext {
  name?: string;
  type?: string;
  industry?: string;
  methodology?: string;
  budget?: string;
  timeline?: string;
  teamSize?: string;
  description?: string;
}

/** The full session state for the app */
export interface SessionState {
  currentStage: StageNumber;
  artifacts: Artifact[];
  projectContext: ProjectContext;
  startedAt: Date;
}

/** Actions that can modify the session state */
export type SessionAction =
  | { type: "SET_STAGE"; stage: StageNumber }
  | { type: "ADD_ARTIFACT"; artifact: Artifact }
  | { type: "UPDATE_ARTIFACT"; id: string; data: Partial<Artifact> }
  | { type: "UPDATE_CONTEXT"; context: Partial<ProjectContext> }
  | { type: "RESET" };
