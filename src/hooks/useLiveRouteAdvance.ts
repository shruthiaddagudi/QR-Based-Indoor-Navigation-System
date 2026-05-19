"use client";

import { useEffect, useRef } from "react";
import type { Route } from "@/lib/pathfinding";
import type { Point } from "@/types";
import { distanceBetween, findRouteNode } from "@/lib/navigation/routeGeometry";

const ADVANCE_RADIUS = 56;

/**
 * Advance turn-by-turn steps when the live dot crosses into the next step's
 * waypoint radius (edge-triggered so we don't spam advance while standing inside).
 */
export default function useLiveRouteAdvance(
  route: Route | null,
  isLiveTracking: boolean,
  position: Point | null,
  floor: number,
  currentStepIndex: number,
  advanceStep: () => void
): void {
  const prevDistRef = useRef<number>(Infinity);

  useEffect(() => {
    prevDistRef.current = Infinity;
  }, [route?.startId, route?.goalId, isLiveTracking, floor]);

  useEffect(() => {
    if (!isLiveTracking || !route?.found || !position || route.steps.length === 0) {
      return;
    }

    const nextStep = route.steps[currentStepIndex + 1];
    if (!nextStep) {
      return;
    }

    // If it's a floor change, we check the distance to the stairs node on the CURRENT floor.
    let targetNodeId = nextStep.nodeId;
    if (nextStep.isFloorChange) {
      const targetNodeIndex = route.allNodes.findIndex(n => n.id === nextStep.nodeId);
      if (targetNodeIndex > 0) {
        const prevNode = route.allNodes[targetNodeIndex - 1];
        if (prevNode && prevNode.floor === floor) {
          targetNodeId = prevNode.id;
        }
      }
    } else if (nextStep.floor !== floor) {
      return;
    }

    const node = findRouteNode(route, targetNodeId);
    if (!node) return;

    const dist = distanceBetween(position, node.position);
    const prev = prevDistRef.current;
    prevDistRef.current = dist;

    const crossedInto =
      prev >= ADVANCE_RADIUS && dist < ADVANCE_RADIUS;

    if (crossedInto) {
      advanceStep();
    }
  }, [route, isLiveTracking, position, floor, currentStepIndex, advanceStep]);
}
