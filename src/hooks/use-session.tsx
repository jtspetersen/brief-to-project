"use client";

import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { SessionState, SessionAction } from "@/lib/types/session";
import type { StageNumber } from "@/lib/types/stages";
import type { Artifact } from "@/lib/types/artifacts";

// Session expires after 2 hours of inactivity (resets on each message)
const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const initialState: SessionState = {
  currentStage: 1,
  artifacts: [],
  projectContext: {},
  startedAt: new Date(0), // Placeholder — real timestamp set in useEffect
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
  isExpired: boolean;
  setStage: (stage: StageNumber) => void;
  addArtifact: (artifact: Artifact) => void;
  updateArtifact: (id: string, data: Partial<Artifact>) => void;
  updateContext: (context: Partial<SessionState["projectContext"]>) => void;
  resetSession: () => void;
  /** Call this on user activity (e.g. sending a message) to reset the inactivity timer */
  touchActivity: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const [isExpired, setIsExpired] = useState(false);
  // Tracks the last user activity time (resets on each message)
  const lastActivityRef = useRef<number>(0);

  useEffect(() => {
    lastActivityRef.current = Date.now();
    dispatch({ type: "RESET" }); // Sets startedAt to new Date() on client
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Check session timeout every 60 seconds
  useEffect(() => {
    if (!lastActivityRef.current) return;

    const checkTimeout = () => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= SESSION_TIMEOUT_MS) {
        setIsExpired(true);
      }
    };

    checkTimeout();
    const interval = setInterval(checkTimeout, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Reset inactivity timer on user activity
  const touchActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // On timeout or manual reset: redirect to the showcase/home page
  const resetSession = useCallback(() => {
    window.location.href = "/";
  }, []);

  const value: SessionContextValue = {
    state,
    isExpired,
    setStage: (stage) => dispatch({ type: "SET_STAGE", stage }),
    addArtifact: (artifact) => dispatch({ type: "ADD_ARTIFACT", artifact }),
    updateArtifact: (id, data) => dispatch({ type: "UPDATE_ARTIFACT", id, data }),
    updateContext: (context) => dispatch({ type: "UPDATE_CONTEXT", context }),
    resetSession,
    touchActivity,
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
