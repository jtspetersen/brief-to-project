"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type { SessionState, SessionAction } from "@/lib/types/session";
import type { StageNumber } from "@/lib/types/stages";
import type { Artifact } from "@/lib/types/artifacts";

const initialState: SessionState = {
  currentStage: 1,
  artifacts: [],
  projectContext: {},
  startedAt: new Date(),
};

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "SET_STAGE":
      return { ...state, currentStage: action.stage };
    case "ADD_ARTIFACT":
      return { ...state, artifacts: [...state.artifacts, action.artifact] };
    case "UPDATE_ARTIFACT":
      return {
        ...state,
        artifacts: state.artifacts.map((a) =>
          a.id === action.id ? { ...a, ...action.data, updatedAt: new Date() } : a
        ),
      };
    case "UPDATE_CONTEXT":
      return {
        ...state,
        projectContext: { ...state.projectContext, ...action.context },
      };
    case "RESET":
      return { ...initialState, startedAt: new Date() };
    default:
      return state;
  }
}

interface SessionContextValue {
  state: SessionState;
  setStage: (stage: StageNumber) => void;
  addArtifact: (artifact: Artifact) => void;
  updateArtifact: (id: string, data: Partial<Artifact>) => void;
  updateContext: (context: Partial<SessionState["projectContext"]>) => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const value: SessionContextValue = {
    state,
    setStage: (stage) => dispatch({ type: "SET_STAGE", stage }),
    addArtifact: (artifact) => dispatch({ type: "ADD_ARTIFACT", artifact }),
    updateArtifact: (id, data) => dispatch({ type: "UPDATE_ARTIFACT", id, data }),
    updateContext: (context) => dispatch({ type: "UPDATE_CONTEXT", context }),
    resetSession: () => dispatch({ type: "RESET" }),
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
