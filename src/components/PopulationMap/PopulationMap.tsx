import {
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Card } from "@/components";
import { Catalogues } from "@/helpers/constants";
import type { CatalogueFamilyNode } from "@/helpers/types";

import styles from "./PopulationMap.module.scss";

const DRAG_THRESHOLD = 5;
const ZOOM_STEPS = [0.4, 0.55, 0.7, 0.85, 1];

interface NodeProps {
  focusId?: string | null;
  node: CatalogueFamilyNode;
}

const TreeNode = ({ focusId, node }: NodeProps): ReactElement => {
  const selected = node.id === focusId;

  return (
    // The attribute is only a hook for the scroll below, the highlight itself is <Card />'s
    <li className={styles.node} data-selected={selected || undefined}>
      {/* Sits on the line descending from the mother, hidden by CSS on roots, which have no line */}
      {!!node.birthYear && <span className={styles.year}>{node.birthYear}</span>}

      <Card
        catalogue={Catalogues.BottlenoseDolphin}
        entry={node}
        selected={selected}
        size="fixed"
      />

      {node.calves.length > 0 && (
        <ul className={styles.children}>
          {node.calves.map((calf) => (
            <TreeNode focusId={focusId} key={calf.slug} node={calf} />
          ))}
        </ul>
      )}
    </li>
  );
};

interface Props {
  focusId?: string | null;
  trees: Array<CatalogueFamilyNode>;
}

const PopulationMap = ({ focusId, trees }: Props) => {
  const mapRef = useRef<HTMLElement>(null);

  // Panning lives entirely in a ref, so dragging never re-renders
  const drag = useRef({ left: 0, moved: false, pointer: -1, top: 0, x: 0, y: 0 });

  const [zoom, setZoom] = useState(ZOOM_STEPS.length - 1);
  const previousZoom = useRef(zoom);

  // Centre a deep-linked animal
  useEffect(() => {
    if (!focusId) {
      return;
    }

    mapRef.current
      ?.querySelector("[data-selected] > a")
      ?.scrollIntoView({ block: "center", inline: "center" });
  }, [focusId]);

  // Keep the centre of the viewport in place
  useEffect(() => {
    const element = mapRef.current;
    if (!element || previousZoom.current === zoom) {
      return;
    }

    const ratio = ZOOM_STEPS[zoom] / ZOOM_STEPS[previousZoom.current];
    previousZoom.current = zoom;

    element.scrollLeft =
      (element.scrollLeft + element.clientWidth / 2) * ratio - element.clientWidth / 2;
    element.scrollTop =
      (element.scrollTop + element.clientHeight / 2) * ratio - element.clientHeight / 2;
  }, [zoom]);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    // Touch falls through to native scrolling, which keeps its momentum
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    drag.current = {
      left: event.currentTarget.scrollLeft,
      moved: false,
      pointer: event.pointerId,
      top: event.currentTarget.scrollTop,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const state = drag.current;
    if (state.pointer !== event.pointerId) {
      return;
    }

    const x = state.x - event.clientX;
    const y = state.y - event.clientY;

    if (!state.moved) {
      if (Math.abs(x) < DRAG_THRESHOLD && Math.abs(y) < DRAG_THRESHOLD) {
        return;
      }

      state.moved = true;

      // Capture only once a real pan starts
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    // Scrolling rather than transforming keeps the browser's own bounds clamping
    event.currentTarget.scrollLeft = state.left + x;
    event.currentTarget.scrollTop = state.top + y;
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (drag.current.pointer === event.pointerId) {
      drag.current.pointer = -1;
    }
  };

  const onClickCapture = (event: MouseEvent<HTMLElement>) => {
    // A click with no detail is keyboard activation, which is never the end of a pan
    if (!drag.current.moved || event.detail === 0) {
      return;
    }

    drag.current.moved = false;

    event.preventDefault(); // next/link honours defaultPrevented
    event.stopPropagation(); // and this stops its bubble phase handler outright
  };

  // Memoised so stepping the zoom does not re-render every card
  const familyTrees = useMemo(
    () => trees.map((tree) => <TreeNode focusId={focusId} key={tree.slug} node={tree} />),
    [focusId, trees],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <button
          aria-label="Zoom out"
          disabled={zoom === 0}
          onClick={() => setZoom((current) => Math.max(0, current - 1))}
          type="button"
        >
          &minus;
        </button>

        <button
          aria-label="Zoom in"
          disabled={zoom === ZOOM_STEPS.length - 1}
          onClick={() => setZoom((current) => Math.min(ZOOM_STEPS.length - 1, current + 1))}
          type="button"
        >
          +
        </button>
      </div>

      <section
        aria-label="Bottlenose dolphin population map. Drag to pan."
        className={styles.map}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()} // anchors are natively draggable
        onLostPointerCapture={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        ref={mapRef}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be focusable so it can be panned with the arrow keys, per axe's scrollable-region-focusable rule
        tabIndex={0}
      >
        <ul className={styles.canvas} style={{ zoom: ZOOM_STEPS[zoom] }}>
          {familyTrees}
        </ul>
      </section>
    </div>
  );
};

export default PopulationMap;
