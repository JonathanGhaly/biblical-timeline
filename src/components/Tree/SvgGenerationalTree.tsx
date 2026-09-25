import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import type { ComputedPerson } from "../../utils/chronology";
import type { Language } from "../../types/genealogy";
import {
  getPersonDisplayName,
  formatYearDisplay,
  UI_TRANSLATIONS,
} from "../../utils/i18n";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Move,
  Layers,
  ArrowRight,
} from "lucide-react";

export interface SvgGenerationalTreeProps {
  people: ComputedPerson[];
  lang?: Language;
  searchTerm?: string;
  onSelectPerson?: (person: ComputedPerson) => void;
  selectedEra?: string;
}

// Card geometry: clean, modern proportions with ample touch targets
const CARD_WIDTH = 96;
const CARD_HEIGHT = 118;
const SIBLING_GAP = 24;
const TIER_HEIGHT = 188; // Space between generation rows
const PADDING_TOP = 70;
const PADDING_LEFT = 76;
const PADDING_BOTTOM = 260; // Generous bottom padding for tree cards, child indicators, and bottom floating overlays

interface LayoutPersonNode {
  person: ComputedPerson;
  gen: number;
  x: number;
  y: number;
  width: number;
  height: number;
  children: LayoutPersonNode[];
  spouse?: ComputedPerson;
  isExpanded: boolean;
  hasChildren: boolean;
  childCount: number;
  ancestorIds: Set<string>;
}

interface GenerationInfo {
  gen: number;
  y: number;
  labelAr: string;
  labelEn: string;
  count: number;
}

const GENERATION_NAMES: Record<number, { ar: string; en: string }> = {
  1: { ar: "الخليقة (آدم وحواء)", en: "Creation (Adam & Eve)" },
  2: { ar: "شيث ونشأة الأنساب", en: "Seth & Line of Promise" },
  3: { ar: "أنوش وبدء الدعاء", en: "Enosh (Calling on God)" },
  4: { ar: "قينان", en: "Kenan" },
  5: { ar: "مهللئيل", en: "Mahalalel" },
  6: { ar: "يارد", en: "Jared" },
  7: { ar: "أخنوخ رجل الله", en: "Enoch (Walked with God)" },
  8: { ar: "متوشالح شيخ الآباء", en: "Methuselah (Longest Life)" },
  9: { ar: "لامك", en: "Lamech" },
  10: { ar: "نوح وسفينة النجاة", en: "Noah & The Ark" },
  11: { ar: "إبراهيم وسارة", en: "Abraham & Sarah" },
  12: { ar: "إسحاق ابن الموعد", en: "Isaac (Child of Promise)" },
  13: { ar: "يعقوب وإسرائيل", en: "Jacob & Israel" },
  14: { ar: "الآباء الاثنا عشر", en: "The 12 Patriarchs" },
};

// Authentic Old Testament color palettes for tunics & headdresses
const BIBLICAL_ROBE_PALETTES = [
  { robe: "#991B1B", inner: "#7F1D1D", head: "#E5E7EB", trim: "#D4AF37" }, // Deep Crimson & Ivory
  { robe: "#1E3A8A", inner: "#172554", head: "#D1D5DB", trim: "#F59E0B" }, // Royal Indigo & Linen
  { robe: "#065F46", inner: "#022C22", head: "#E5E7EB", trim: "#D4AF37" }, // Olive Grove Green
  { robe: "#92400E", inner: "#78350F", head: "#F3F4F6", trim: "#FBBF24" }, // Desert Terracotta
  { robe: "#581C87", inner: "#3B0764", head: "#E5E7EB", trim: "#D4AF37" }, // Royal Patriarch Purple
  { robe: "#78350F", inner: "#451A03", head: "#E5E7EB", trim: "#D4AF37" }, // Cedar / Camel Hair
  { robe: "#0F766E", inner: "#134E4A", head: "#E5E7EB", trim: "#F59E0B" }, // Sinai Teal
];

// Helper to get Old Testament character styling
function getOldTestamentAvatarProps(person: ComputedPerson) {
  const id = person.id.toLowerCase();
  const isFemale = person.gender === "female" || id === "eve" || id === "sarah";

  let hash = 0;
  for (let i = 0; i < person.id.length; i++) {
    hash = (hash * 31 + person.id.charCodeAt(i)) % 1000;
  }

  const isEnoch = id === "enoch";
  const isAdam = id === "adam";
  const isNoah = id === "noah";
  const isAbraham = id === "abraham";
  const isMethuselah = id === "methuselah";
  const isSarah = id === "sarah";
  const isEve = id === "eve";
  const isIsaac = id === "isaac";

  // Robe palette
  let palette = BIBLICAL_ROBE_PALETTES[hash % BIBLICAL_ROBE_PALETTES.length];

  if (isAdam) {
    palette = { robe: "#78350F", inner: "#451A03", head: "#D1D5DB", trim: "#D4AF37" }; // Earth-born camel hair
  } else if (isEve) {
    palette = { robe: "#BE185D", inner: "#831843", head: "#FDE68A", trim: "#F472B6" }; // Coral Rose Veil
  } else if (isEnoch) {
    palette = { robe: "#F8FAFC", inner: "#E2E8F0", head: "#F8FAFC", trim: "#F59E0B" }; // Holy Luminous White
  } else if (isNoah) {
    palette = { robe: "#1E3A8A", inner: "#172554", head: "#E5E7EB", trim: "#10B981" }; // Ocean Navy with Olive trim
  } else if (isAbraham) {
    palette = { robe: "#581C87", inner: "#3B0764", head: "#E5E7EB", trim: "#D4AF37" }; // Sovereign Purple
  } else if (isSarah) {
    palette = { robe: "#9F1239", inner: "#881337", head: "#FEF08A", trim: "#D4AF37" }; // Royal Crimson & Gold
  } else if (isMethuselah) {
    palette = { robe: "#92400E", inner: "#78350F", head: "#F3F4F6", trim: "#D4AF37" }; // Ancient Sand
  } else if (isIsaac) {
    palette = { robe: "#C2410C", inner: "#9A3412", head: "#E5E7EB", trim: "#FBBF24" }; // Warm Saffron
  }

  // Facial Hair & Aging
  const isElder = isMethuselah || isNoah || isAbraham || isAdam;
  const hairColor = isElder || isEnoch
    ? "#F1F5F9" // Silver / White hair
    : isFemale
    ? hash % 2 === 0
      ? "#92400E"
      : "#451A03"
    : hash % 3 === 0
    ? "#1F2937"
    : "#78350F";

  const hasBeard = !isFemale;
  const isLongBeard = isMethuselah || isNoah || isAbraham;
  const skinTone = isFemale ? "#FDE68A" : "#FCD34D";

  return {
    isFemale,
    isEnoch,
    hasBeard,
    isLongBeard,
    hairColor,
    palette,
    skinTone,
  };
}

export const SvgGenerationalTree: React.FC<SvgGenerationalTreeProps> = ({
  people,
  lang = "en",
  searchTerm = "",
  onSelectPerson,
  selectedEra = "all",
}) => {
  const isRTL = lang === "ar";
  const t = UI_TRANSLATIONS[lang];

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pan and Zoom Transformation state
  const [zoom, setZoom] = useState<number>(0.92);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 20 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Refs for synchronous mouse-anchored zoom without React batching drift
  const zoomRef = useRef<number>(0.92);
  const panRef = useRef<{ x: number; y: number }>({ x: 30, y: 20 });
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  // Hover state for highlighting lineage connectors and displaying detailed tooltip
  const [hoveredPersonId, setHoveredPersonId] = useState<string | null>(null);

  // Toggles
  const [showGenerationGuides, setShowGenerationGuides] = useState<boolean>(true);

  // People Map for fast lookup
  const peopleMap = useMemo(() => {
    return new Map<string, ComputedPerson>(people.map((p) => [p.id, p]));
  }, [people]);

  // 1. Calculate strictly unified generational levels for every person
  const generationMap = useMemo(() => {
    const map = new Map<string, number>();
    const visited = new Set<string>();

    function resolveGen(personId: string): number {
      if (map.has(personId)) return map.get(personId)!;
      if (visited.has(personId)) return 1;
      visited.add(personId);

      const p = peopleMap.get(personId);
      if (!p) return 1;

      // Adam and Eve are Generation 1
      if (
        p.id.toLowerCase() === "adam" ||
        p.name.toLowerCase() === "adam" ||
        p.id.toLowerCase() === "eve" ||
        p.name.toLowerCase() === "eve"
      ) {
        map.set(personId, 1);
        return 1;
      }

      // If father is known, generation = father's generation + 1
      if (p.fatherId && peopleMap.has(p.fatherId)) {
        const fatherGen = resolveGen(p.fatherId);
        const g = fatherGen + 1;
        map.set(personId, g);
        return g;
      }

      // If mother is known and father not found
      if (p.motherId && peopleMap.has(p.motherId)) {
        const motherGen = resolveGen(p.motherId);
        const g = motherGen + 1;
        map.set(personId, g);
        return g;
      }

      // If spouse is known, match spouse's generation
      const spouseId =
        p.husbandId ||
        p.wifeId ||
        (p.spouseIds && p.spouseIds.length > 0 ? p.spouseIds[0] : undefined);

      if (spouseId && peopleMap.has(spouseId) && !visited.has(spouseId)) {
        const spouseGen = resolveGen(spouseId);
        map.set(personId, spouseGen);
        return spouseGen;
      }

      map.set(personId, 1);
      return 1;
    }

    people.forEach((p) => resolveGen(p.id));
    return map;
  }, [people, peopleMap]);

  // 2. Identify child relationships
  const childrenMap = useMemo(() => {
    const map = new Map<string, ComputedPerson[]>();
    people.forEach((p) => map.set(p.id, []));

    people.forEach((p) => {
      if (p.fatherId && map.has(p.fatherId)) {
        map.get(p.fatherId)!.push(p);
      } else if (p.motherId && map.has(p.motherId)) {
        map.get(p.motherId)!.push(p);
      }
    });

    map.forEach((children) => {
      children.sort((a, b) => {
        if (a.gender === "male" && b.gender !== "male") return -1;
        if (a.gender !== "male" && b.gender === "male") return 1;
        return (a.birthYearBC ?? 0) - (b.birthYearBC ?? 0);
      });
    });

    return map;
  }, [people]);

  // 3. Spouses map
  const spouseMap = useMemo(() => {
    const map = new Map<string, ComputedPerson>();
    people.forEach((p) => {
      const spId =
        p.wifeId ||
        p.husbandId ||
        (p.spouseIds && p.spouseIds.length > 0 ? p.spouseIds[0] : undefined);
      if (spId && peopleMap.has(spId)) {
        map.set(p.id, peopleMap.get(spId)!);
      }
    });
    return map;
  }, [people, peopleMap]);

  // 4. Expansion State (all nodes default to expanded)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    people.forEach((p) => {
      const c = childrenMap.get(p.id) || [];
      if (c.length > 0) {
        set.add(p.id);
      }
    });
    return set;
  });

  const toggleNodeExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    const all = new Set<string>();
    people.forEach((p) => {
      if ((childrenMap.get(p.id) || []).length > 0) {
        all.add(p.id);
      }
    });
    setExpandedIds(all);
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  // 5. Filter roots by Selected Era
  const rootPeople = useMemo(() => {
    let roots = people.filter((p) => {
      if (p.fatherId && peopleMap.has(p.fatherId)) return false;
      if ((p.husbandId && peopleMap.has(p.husbandId)) || (p.id === "eve" || p.id === "sarah")) {
        return false;
      }
      return true;
    });

    if (selectedEra === "adam-noah") {
      roots = roots.filter(
        (p) => p.id === "adam" || p.name.toLowerCase() === "adam"
      );
    } else if (selectedEra === "noah") {
      const noah = people.find((p) => p.id === "noah");
      if (noah) roots = [noah];
    } else if (selectedEra === "abraham") {
      const abraham = people.find((p) => p.id === "abraham");
      if (abraham) roots = [abraham];
    }

    roots.sort((a, b) => {
      if (a.id === "adam" || a.name.toLowerCase() === "adam") return -1;
      if (b.id === "adam" || b.name.toLowerCase() === "adam") return 1;
      return (a.birthYearBC ?? 0) - (b.birthYearBC ?? 0);
    });

    return roots;
  }, [people, peopleMap, selectedEra]);

  // Auto-expand search matches and their ancestors
  const effectiveExpandedIds = useMemo(() => {
    if (!searchTerm.trim()) return expandedIds;
    const term = searchTerm.trim().toLowerCase();
    const next = new Set(expandedIds);

    people.forEach((p) => {
      const nameEn = p.name.toLowerCase();
      const nameAr = (p.arabicName || "").toLowerCase();
      if (nameEn.includes(term) || nameAr.includes(term)) {
        let curr = p.fatherId ? peopleMap.get(p.fatherId) : undefined;
        while (curr) {
          next.add(curr.id);
          curr = curr.fatherId ? peopleMap.get(curr.fatherId) : undefined;
        }
      }
    });

    return next;
  }, [expandedIds, searchTerm, people, peopleMap]);

  // 6. Multi-Pass Hierarchical Tree Layout Algorithm
  const { layoutNodes, layoutEdges, bounds, generationsList } = useMemo(() => {
    const nodes: LayoutPersonNode[] = [];
    const edges: {
      id: string;
      parentCenter: { x: number; y: number };
      childrenPoints: { x: number; y: number }[];
      midY: number;
      fromPersonId: string;
      toPersonIds: string[];
      isHighlighted: boolean;
    }[] = [];

    let maxGenFound = 1;

    function computeSubtreeWidth(
      person: ComputedPerson,
      visited = new Set<string>()
    ): number {
      if (visited.has(person.id)) return CARD_WIDTH;
      visited.add(person.id);

      const isExp = effectiveExpandedIds.has(person.id);
      const spouse = spouseMap.get(person.id);
      const unitWidth = spouse ? CARD_WIDTH * 2 + SIBLING_GAP : CARD_WIDTH;

      if (!isExp) return unitWidth;

      const directChildren = childrenMap.get(person.id) || [];
      if (directChildren.length === 0) return unitWidth;

      let childrenTotalWidth = 0;
      directChildren.forEach((child, idx) => {
        const childWidth = computeSubtreeWidth(child, new Set(visited));
        childrenTotalWidth += childWidth;
        if (idx < directChildren.length - 1) {
          childrenTotalWidth += SIBLING_GAP;
        }
      });

      return Math.max(unitWidth, childrenTotalWidth);
    }

    let currentRootLeft = PADDING_LEFT;
    const tierRightTracker = new Map<number, number>();

    function buildLayoutNode(
      person: ComputedPerson,
      leftX: number,
      ancestors = new Set<string>(),
      visited = new Set<string>()
    ): LayoutPersonNode {
      if (visited.has(person.id)) {
        const gen = generationMap.get(person.id) || 1;
        return {
          person,
          gen,
          x: leftX,
          y: PADDING_TOP + (gen - 1) * TIER_HEIGHT,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          children: [],
          isExpanded: false,
          hasChildren: false,
          childCount: 0,
          ancestorIds: ancestors,
        };
      }
      visited.add(person.id);

      const gen = generationMap.get(person.id) || 1;
      maxGenFound = Math.max(maxGenFound, gen);

      const y = PADDING_TOP + (gen - 1) * TIER_HEIGHT;
      const spouse = spouseMap.get(person.id);
      const unitWidth = spouse ? CARD_WIDTH * 2 + SIBLING_GAP : CARD_WIDTH;

      const isExp = effectiveExpandedIds.has(person.id);
      const directChildren = childrenMap.get(person.id) || [];
      const hasChildren = directChildren.length > 0;

      const currentAncestors = new Set(ancestors);
      currentAncestors.add(person.id);

      const minXForTier = tierRightTracker.get(gen) || PADDING_LEFT;
      const safeLeftX = Math.max(leftX, minXForTier);

      const childNodes: LayoutPersonNode[] = [];
      let finalCardX = safeLeftX;

      if (!isExp || directChildren.length === 0) {
        finalCardX = safeLeftX;
        tierRightTracker.set(gen, finalCardX + unitWidth + SIBLING_GAP);
      } else {
        let childCursorX = safeLeftX;
        directChildren.forEach((child) => {
          const childNode = buildLayoutNode(
            child,
            childCursorX,
            currentAncestors,
            new Set(visited)
          );
          childNodes.push(childNode);

          const childSpan = computeSubtreeWidth(child);
          childCursorX = Math.max(
            childCursorX + childSpan + SIBLING_GAP,
            (tierRightTracker.get(childNode.gen) || 0)
          );
        });

        // Center parent over children
        if (childNodes.length > 0) {
          const firstChildCenter = childNodes[0].x + CARD_WIDTH / 2;
          const lastChildCenter =
            childNodes[childNodes.length - 1].x + CARD_WIDTH / 2;
          const childrenCenter = (firstChildCenter + lastChildCenter) / 2;

          finalCardX = Math.max(safeLeftX, childrenCenter - unitWidth / 2);
        }

        tierRightTracker.set(gen, finalCardX + unitWidth + SIBLING_GAP);
      }

      const nodeResult: LayoutPersonNode = {
        person,
        gen,
        x: finalCardX,
        y,
        width: unitWidth,
        height: CARD_HEIGHT,
        children: childNodes,
        spouse,
        isExpanded: isExp,
        hasChildren,
        childCount: directChildren.length,
        ancestorIds: currentAncestors,
      };

      nodes.push(nodeResult);

      if (childNodes.length > 0) {
        const parentCenterX = spouse
          ? finalCardX + CARD_WIDTH + SIBLING_GAP / 2
          : finalCardX + CARD_WIDTH / 2;
        const parentBottomY = y + CARD_HEIGHT;

        const childrenPoints = childNodes.map((c) => ({
          x: c.x + CARD_WIDTH / 2,
          y: c.y,
        }));

        const midY = (parentBottomY + childNodes[0].y) / 2;

        edges.push({
          id: `bus_${person.id}`,
          parentCenter: { x: parentCenterX, y: parentBottomY },
          childrenPoints,
          midY,
          fromPersonId: person.id,
          toPersonIds: childNodes.map((c) => c.person.id),
          isHighlighted: false,
        });
      }

      return nodeResult;
    }

    // Process roots
    rootPeople.forEach((root) => {
      const rootSpan = computeSubtreeWidth(root);
      buildLayoutNode(root, currentRootLeft);
      currentRootLeft = Math.max(
        currentRootLeft + rootSpan + SIBLING_GAP * 2,
        (tierRightTracker.get(1) || 0) + SIBLING_GAP
      );
    });

    let minX = 0;
    let maxX = 1200;
    let maxContentBottom = PADDING_TOP + maxGenFound * TIER_HEIGHT + CARD_HEIGHT;

    nodes.forEach((n) => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x + n.width + 120);
      const nodeBottom = n.y + n.height + (n.hasChildren ? 36 : 0);
      if (nodeBottom > maxContentBottom) {
        maxContentBottom = nodeBottom;
      }
    });

    const totalHeight = maxContentBottom + PADDING_BOTTOM;

    const genList: GenerationInfo[] = [];
    for (let g = 1; g <= maxGenFound; g++) {
      const gY = PADDING_TOP + (g - 1) * TIER_HEIGHT;
      const count = nodes.filter((n) => n.gen === g).length;
      const name = GENERATION_NAMES[g] || {
        ar: `الجيل ${g}`,
        en: `Generation ${g}`,
      };
      genList.push({
        gen: g,
        y: gY,
        labelAr: name.ar,
        labelEn: name.en,
        count,
      });
    }

    return {
      layoutNodes: nodes,
      layoutEdges: edges,
      bounds: { width: Math.max(1200, maxX + 90), height: totalHeight },
      generationsList: genList,
    };
  }, [rootPeople, effectiveExpandedIds, childrenMap, spouseMap, generationMap]);

  // Set highlighted edges based on hovered person
  const edgesWithHighlight = useMemo(() => {
    if (!hoveredPersonId) return layoutEdges;
    const targetNode = layoutNodes.find((n) => n.person.id === hoveredPersonId);
    if (!targetNode) return layoutEdges;

    const ancestors = targetNode.ancestorIds;
    return layoutEdges.map((edge) => {
      const isAncestorBus =
        ancestors.has(edge.fromPersonId) &&
        edge.toPersonIds.some((id) => ancestors.has(id));
      return {
        ...edge,
        isHighlighted: isAncestorBus,
      };
    });
  }, [layoutEdges, hoveredPersonId, layoutNodes]);

  // Active hovered person details
  const hoveredPerson = useMemo(() => {
    if (!hoveredPersonId) return null;
    return peopleMap.get(hoveredPersonId) || null;
  }, [hoveredPersonId, peopleMap]);

  // Ensure hovered node is rendered last so it sits completely on top of all other nodes
  const sortedLayoutNodes = useMemo(() => {
    if (!hoveredPersonId) return layoutNodes;
    return [...layoutNodes].sort((a, b) => {
      if (a.person.id === hoveredPersonId) return 1;
      if (b.person.id === hoveredPersonId) return -1;
      return 0;
    });
  }, [layoutNodes, hoveredPersonId]);

  // Pan & Zoom handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".interactive-node")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    if (!isDragging) return;
    const newPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    panRef.current = newPan;
    setPan(newPan);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Cursor-anchored or center-anchored zoom for toolbar buttons
  const handleZoomByFactor = (factor: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const anchorX = mousePosRef.current ? mousePosRef.current.x : rect.width / 2;
    const anchorY = mousePosRef.current ? mousePosRef.current.y : rect.height / 2;

    const currentZoom = zoomRef.current;
    const currentPan = panRef.current;
    const nextZoom = Math.max(0.2, Math.min(3.5, currentZoom * factor));
    if (Math.abs(nextZoom - currentZoom) < 0.0001) return;

    const scaleRatio = nextZoom / currentZoom;
    const nextPanX = anchorX - (anchorX - currentPan.x) * scaleRatio;
    const nextPanY = anchorY - (anchorY - currentPan.y) * scaleRatio;

    zoomRef.current = nextZoom;
    panRef.current = { x: nextPanX, y: nextPanY };

    setZoom(nextZoom);
    setPan({ x: nextPanX, y: nextPanY });
  };

  // Native non-passive wheel event listener to zoom directly towards pointer and completely prevent page scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      // Completely prevent outer window / page from scrolling
      e.preventDefault();
      e.stopPropagation();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      mousePosRef.current = { x: mouseX, y: mouseY };

      const currentZoom = zoomRef.current;
      const currentPan = panRef.current;

      // Handle trackpad pinch (e.ctrlKey) vs mouse wheel steps smoothly
      let zoomFactor: number;
      if (e.ctrlKey) {
        zoomFactor = Math.exp(-e.deltaY * 0.015);
      } else {
        const delta = Math.max(-120, Math.min(120, e.deltaY));
        zoomFactor = delta < 0 ? 1.15 : 0.87;
      }
      const nextZoom = Math.max(0.2, Math.min(3.5, currentZoom * zoomFactor));
      if (Math.abs(nextZoom - currentZoom) < 0.0001) return;

      // Exact cursor-anchored transformation:
      // The point in content coordinates under the mouse is (mouseX - currentPan.x) / currentZoom
      // After zooming, that same point stays pinned under the cursor:
      const contentX = (mouseX - currentPan.x) / currentZoom;
      const contentY = (mouseY - currentPan.y) / currentZoom;
      const nextPanX = mouseX - contentX * nextZoom;
      const nextPanY = mouseY - contentY * nextZoom;

      // Synchronously update the refs so consecutive rapid wheel events calculate against accurate values
      zoomRef.current = nextZoom;
      panRef.current = { x: nextPanX, y: nextPanY };

      setZoom(nextZoom);
      setPan({ x: nextPanX, y: nextPanY });
    };

    // Touch gesture pinch-to-zoom support
    let initialPinchDistance: number | null = null;
    let initialPinchZoom = 1;
    let initialPinchCenter = { x: 0, y: 0 };
    let initialPinchPan = { x: 0, y: 0 };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        initialPinchDistance = Math.hypot(dx, dy);

        const rect = container.getBoundingClientRect();
        initialPinchCenter = {
          x: (touch1.clientX + touch2.clientX) / 2 - rect.left,
          y: (touch1.clientY + touch2.clientY) / 2 - rect.top,
        };

        setZoom((z) => {
          initialPinchZoom = z;
          return z;
        });
        setPan((p) => {
          initialPinchPan = p;
          return p;
        });
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDistance !== null) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        const distance = Math.hypot(dx, dy);

        const factor = distance / initialPinchDistance;
        const nextZoom = Math.max(0.25, Math.min(2.8, initialPinchZoom * factor));
        const scaleRatio = nextZoom / initialPinchZoom;

        setZoom(nextZoom);
        setPan({
          x: initialPinchCenter.x - (initialPinchCenter.x - initialPinchPan.x) * scaleRatio,
          y: initialPinchCenter.y - (initialPinchCenter.y - initialPinchPan.y) * scaleRatio,
        });
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialPinchDistance = null;
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.clientWidth || 1000;
    const containerH = containerRef.current.clientHeight || 700;

    const scaleX = (containerW - 32) / bounds.width;
    const scaleY = (containerH - 70) / bounds.height;
    const fitScale = Math.max(0.24, Math.min(1.15, Math.min(scaleX, scaleY)));

    setZoom(fitScale);
    setPan({
      x: Math.max(16, (containerW - bounds.width * fitScale) / 2),
      y: 20,
    });
  }, [bounds]);

  useEffect(() => {
    handleFitToScreen();
  }, [selectedEra, handleFitToScreen]);

  // Smooth jump to center on specific key patriarch
  const handleJumpToPerson = (personId: string) => {
    const target = layoutNodes.find(
      (n) => n.person.id.toLowerCase() === personId.toLowerCase()
    );
    if (!target || !containerRef.current) return;

    const containerW = containerRef.current.clientWidth || 1000;
    const containerH = containerRef.current.clientHeight || 700;

    const targetZoom = 1.05;
    const targetPanX = containerW / 2 - (target.x + CARD_WIDTH / 2) * targetZoom;
    const targetPanY = containerH / 2 - (target.y + CARD_HEIGHT / 2) * targetZoom;

    setZoom(targetZoom);
    setPan({ x: targetPanX, y: targetPanY });
    setHoveredPersonId(target.person.id);
  };

  // Export SVG with generous bottom navigation space & embedded interactive pan/zoom
  const handleExportSvg = () => {
    if (!svgRef.current) return;

    // Clone the SVG DOM node so we can export a clean, unclipped standalone document
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;

    // Very generous bottom space (850px) so the user can comfortably scroll, pan and navigate through the bottom
    const extraBottomNavSpace = 850;
    const exportWidth = Math.max(1400, bounds.width + 160);
    const exportHeight = bounds.height + extraBottomNavSpace;

    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("viewBox", `0 0 ${exportWidth} ${exportHeight}`);
    clone.setAttribute("width", `${exportWidth}`);
    clone.setAttribute("height", `${exportHeight}`);
    clone.setAttribute("style", "background: #181C24;");

    // Reset transient interactive pan/zoom on root group so the full tree is framed perfectly
    const transformGroup = clone.querySelector("g[transform]");
    if (transformGroup) {
      transformGroup.setAttribute("transform", "translate(20, 20) scale(1)");

      // Append explicit navigation spacer element at bottom
      const bottomSpacer = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bottomSpacer.setAttribute("x", "0");
      bottomSpacer.setAttribute("y", `${bounds.height}`);
      bottomSpacer.setAttribute("width", `${exportWidth}`);
      bottomSpacer.setAttribute("height", `${extraBottomNavSpace}`);
      bottomSpacer.setAttribute("fill", "transparent");
      transformGroup.appendChild(bottomSpacer);

      // Bottom navigation margin line
      const baseline = document.createElementNS("http://www.w3.org/2000/svg", "line");
      baseline.setAttribute("x1", "40");
      baseline.setAttribute("y1", `${bounds.height + 60}`);
      baseline.setAttribute("x2", `${exportWidth - 40}`);
      baseline.setAttribute("y2", `${bounds.height + 60}`);
      baseline.setAttribute("stroke", "#D4AF37");
      baseline.setAttribute("stroke-width", "1.5");
      baseline.setAttribute("stroke-dasharray", "8 8");
      baseline.setAttribute("opacity", "0.5");
      transformGroup.appendChild(baseline);

      // Bottom Navigation Guide Banner
      const navGuideBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      navGuideBox.setAttribute("x", `${exportWidth / 2 - 280}`);
      navGuideBox.setAttribute("y", `${bounds.height + 85}`);
      navGuideBox.setAttribute("width", "560");
      navGuideBox.setAttribute("height", "44");
      navGuideBox.setAttribute("rx", "12");
      navGuideBox.setAttribute("fill", "#1E222A");
      navGuideBox.setAttribute("stroke", "#D4AF37");
      navGuideBox.setAttribute("stroke-width", "1");
      transformGroup.appendChild(navGuideBox);

      const navGuideText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      navGuideText.setAttribute("x", `${exportWidth / 2}`);
      navGuideText.setAttribute("y", `${bounds.height + 112}`);
      navGuideText.setAttribute("text-anchor", "middle");
      navGuideText.setAttribute("fill", "#F3E5AB");
      navGuideText.setAttribute("font-size", "13px");
      navGuideText.setAttribute("font-family", "system-ui, sans-serif");
      navGuideText.setAttribute("font-weight", "bold");
      navGuideText.textContent = "✦ Interactive Navigation: Click & Drag anywhere to pan · Scroll wheel to zoom in/out";
      transformGroup.appendChild(navGuideText);

      // Descriptive footer watermark
      const footerLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      footerLabel.setAttribute("x", `${exportWidth / 2}`);
      footerLabel.setAttribute("y", `${bounds.height + 165}`);
      footerLabel.setAttribute("text-anchor", "middle");
      footerLabel.setAttribute("fill", "#9CA3AF");
      footerLabel.setAttribute("font-size", "14px");
      footerLabel.setAttribute("font-family", "serif");
      footerLabel.textContent = "✝ Old Testament Chronological Family Tree · Biblical Genealogy & Lineage";
      transformGroup.appendChild(footerLabel);
    }

    // Embed interactive pan/zoom navigation script for standalone browser viewing
    const navScript = document.createElementNS("http://www.w3.org/2000/svg", "script");
    navScript.setAttribute("type", "text/javascript");
    navScript.textContent = `
      (function() {
        var svg = document.documentElement;
        var g = svg.querySelector('g[transform]');
        if (!g) return;
        var isPanning = false;
        var startX = 0, startY = 0;
        var currentPanX = 20, currentPanY = 20;
        var currentScale = 1;

        function updateTransform() {
          g.setAttribute('transform', 'translate(' + currentPanX + ', ' + currentPanY + ') scale(' + currentScale + ')');
        }

        svg.addEventListener('mousedown', function(e) {
          if (e.target.tagName === 'a' || e.target.tagName === 'button') return;
          isPanning = true;
          startX = e.clientX - currentPanX;
          startY = e.clientY - currentPanY;
          svg.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', function(e) {
          if (!isPanning) return;
          currentPanX = e.clientX - startX;
          currentPanY = e.clientY - startY;
          updateTransform();
        });

        window.addEventListener('mouseup', function() {
          isPanning = false;
          svg.style.cursor = 'grab';
        });

        svg.addEventListener('wheel', function(e) {
          e.preventDefault();
          var zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
          var newScale = Math.min(4, Math.max(0.15, currentScale * zoomFactor));
          var rect = svg.getBoundingClientRect();
          var mouseX = e.clientX - rect.left;
          var mouseY = e.clientY - rect.top;
          currentPanX = mouseX - (mouseX - currentPanX) * (newScale / currentScale);
          currentPanY = mouseY - (mouseY - currentPanY) * (newScale / currentScale);
          currentScale = newScale;
          updateTransform();
        }, { passive: false });

        svg.style.cursor = 'grab';
      })();
    `;
    clone.appendChild(navScript);

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(clone);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `biblical-family-tree-${selectedEra}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Search matches
  const matchingPersonIds = useMemo(() => {
    if (!searchTerm.trim()) return new Set<string>();
    const term = searchTerm.trim().toLowerCase();
    const matches = new Set<string>();
    people.forEach((p) => {
      const match =
        p.name.toLowerCase().includes(term) ||
        (p.arabicName && p.arabicName.includes(term));
      if (match) matches.add(p.id);
    });
    return matches;
  }, [searchTerm, people]);

  // Key patriarchs for instant quick-jump
  const quickJumpPatriarchs = [
    { id: "adam", nameAr: "آدم", nameEn: "Adam" },
    { id: "seth", nameAr: "شيث", nameEn: "Seth" },
    { id: "enoch", nameAr: "أخنوخ", nameEn: "Enoch" },
    { id: "noah", nameAr: "نوح", nameEn: "Noah" },
    { id: "abraham", nameAr: "إبراهيم", nameEn: "Abraham" },
    { id: "isaac", nameAr: "إسحاق", nameEn: "Isaac" },
  ];

  // Render authentic Old Testament character illustration
  const renderOldTestamentAvatar = (person: ComputedPerson) => {
    const {
      isFemale,
      isEnoch,
      hasBeard,
      isLongBeard,
      hairColor,
      palette,
      skinTone,
    } = getOldTestamentAvatarProps(person);

    return (
      <g transform="translate(18, 8)">
        {/* Subtle avatar background frame */}
        <rect
          x="0"
          y="0"
          width="60"
          height="58"
          rx="10"
          fill="#1A1E27"
          fillOpacity="0.6"
        />

        <g clipPath="url(#otAvatarClip)">
          {/* Enoch Divine Radiance Halo */}
          {isEnoch && (
            <circle
              cx="30"
              cy="23"
              r="22"
              fill="#F59E0B"
              fillOpacity="0.25"
            />
          )}

          {/* Flowing Biblical Robe / Tunic (Shoulders & Torso) */}
          <path
            d="M 6 56 C 6 40, 18 36, 30 36 C 42 36, 54 40, 54 56 Z"
            fill={palette.robe}
          />

          {/* Draped Inner Tunic Lapel / Mantle Fold */}
          <path
            d="M 22 36 L 30 47 L 38 36 Z"
            fill={palette.inner}
          />

          {/* Sacred Golden Embroidery Trim across Neckline */}
          <path
            d="M 18 36 L 30 49 L 42 36"
            fill="none"
            stroke={palette.trim}
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Neck */}
          <rect
            x="26"
            y="28"
            width="8"
            height="10"
            rx="1.5"
            fill={skinTone}
          />

          {/* Face */}
          <ellipse
            cx="30"
            cy="22"
            rx="10.5"
            ry="12"
            fill={skinTone}
          />

          {/* Eyes */}
          <ellipse cx="26.5" cy="20.5" rx="1.2" ry="0.8" fill="#1F2937" />
          <ellipse cx="33.5" cy="20.5" rx="1.2" ry="0.8" fill="#1F2937" />

          {/* Eyebrows */}
          <path d="M 24.5 19 Q 26.5 18 28.5 19" fill="none" stroke={hairColor} strokeWidth="0.9" />
          <path d="M 31.5 19 Q 33.5 18 35.5 19" fill="none" stroke={hairColor} strokeWidth="0.9" />

          {isFemale ? (
            /* FEMALE: Sacred Draped Head Veil (Mitpachat / Tza'if) */
            <g>
              {/* Flowing Veil draping down both shoulders */}
              <path
                d="M 15 22 C 13 9, 47 9, 45 22 C 48 30, 49 44, 46 56 C 42 56, 40 36, 38 27 C 35 18, 25 18, 22 27 C 20 36, 18 56, 14 56 C 11 44, 12 30, 15 22 Z"
                fill={palette.head}
                opacity="0.95"
              />
              {/* Forehead Golden Fillet / Headband Ornament */}
              <path
                d="M 19 17.5 C 24 15, 36 15, 41 17.5"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Forehead Jewel */}
              <circle cx="30" cy="16.5" r="1.8" fill="#DC2626" />
            </g>
          ) : (
            /* MALE: Old Testament Patriarch Headdress (Keffiyeh / Headcloth with Agal Cord) */
            <g>
              {/* Draped Headdress flowing over head and sides */}
              <path
                d="M 17 21 C 15 10, 45 10, 43 21 C 45 27, 45 40, 42 48 C 39 36, 39 25, 38 21 C 34 14, 26 14, 22 21 C 21 25, 21 36, 18 48 C 15 40, 15 27, 17 21 Z"
                fill={palette.head}
              />
              {/* Golden Headdress Cord (Agal) binding the crown */}
              <path
                d="M 17 16 C 24 13, 36 13, 43 16"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Hair edge peeking from headdress */}
              <path
                d="M 21 18 C 24 16, 36 16, 39 18"
                fill="none"
                stroke={hairColor}
                strokeWidth="1"
              />
            </g>
          )}

          {/* Full Flowing Patriarch Beard & Mustache */}
          {hasBeard && (
            <g>
              <path
                d={
                  isLongBeard
                    ? "M 20 27 C 20 46, 40 46, 40 27 C 37 34, 23 34, 20 27 Z"
                    : "M 21 27 C 21 38, 39 38, 39 27 C 36 33, 24 33, 21 27 Z"
                }
                fill={hairColor}
              />
              {/* Mustache */}
              <path
                d="M 23 26 C 26.5 25, 30 27, 30 27 C 30 27, 33.5 25, 37 26 C 35 28.5, 31.5 28.5, 30 27.5 C 28.5 28.5, 25 28.5, 23 26 Z"
                fill={hairColor}
              />
            </g>
          )}
        </g>
      </g>
    );
  };

  return (
    <div className="relative rounded-2xl border border-[#3E4554] bg-[#1E222A] shadow-2xl overflow-hidden flex flex-col h-[560px] sm:h-[660px] lg:h-[760px] min-h-[480px] max-h-[85vh] select-none">
      {/* Top Toolbar */}
      <div className="relative z-20 flex flex-col gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[#363C4A] bg-[#252A35]/95 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Left: View & Zoom Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-[#1C2028] p-1 rounded-xl border border-[#3A4252]">
              <button
                onClick={() => handleZoomByFactor(1.15)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#2F3644] transition-colors"
                title={t.zoomIn || "Zoom In"}
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={() => handleZoomByFactor(0.87)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#2F3644] transition-colors"
                title={t.zoomOut || "Zoom Out"}
              >
                <ZoomOut size={15} />
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 30, y: 20 });
                }}
                className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-[#2F3644] transition-colors"
                title="100% Zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={handleFitToScreen}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#2F3644] transition-colors"
                title={t.fitToScreen || "Fit to Screen"}
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Expand / Collapse All */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleExpandAll}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border border-[#3A4252] bg-[#1E232C] text-xs font-bold text-slate-200 hover:bg-[#2F3644] transition-colors shadow-xs"
                title={t.expandAll}
              >
                <ChevronDown size={13} />
                <span className="hidden sm:inline">{t.expandAll}</span>
              </button>
              <button
                onClick={handleCollapseAll}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border border-[#3A4252] bg-[#1E232C] text-xs font-bold text-slate-200 hover:bg-[#2F3644] transition-colors shadow-xs"
                title={t.collapseAll}
              >
                <ChevronUp size={13} />
                <span className="hidden sm:inline">{t.collapseAll}</span>
              </button>
            </div>

            {/* Toggle Generation Levels */}
            <button
              onClick={() => setShowGenerationGuides((v) => !v)}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                showGenerationGuides
                  ? "border-[#D4AF37]/50 bg-[#D4AF37]/15 text-[#F3E5AB]"
                  : "border-[#3A4252] bg-[#1E232C] text-slate-400 hover:text-slate-200"
              }`}
              title="Toggle Generation Level Guide Lines"
            >
              <Layers size={13} />
              <span>{isRTL ? "مستويات الأجيال" : "Gen Tiers"}</span>
            </button>
          </div>

          {/* Center: Generation & Search Stats */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-[#D4AF37]" />
              <span>
                {isRTL
                  ? `${layoutNodes.length} شخصية عهد قديم عبر ${generationsList.length} أجيال`
                  : `${layoutNodes.length} Old Testament figures across ${generationsList.length} generations`}
              </span>
            </span>

            {searchTerm && matchingPersonIds.size > 0 && (
              <span className="flex items-center gap-1 text-[#FCD34D] font-bold bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2 py-0.5 rounded-md">
                <Sparkles size={12} />
                <span>
                  {matchingPersonIds.size} {isRTL ? "مطابقة" : "matches"}
                </span>
              </span>
            )}
          </div>

          {/* Right: Export SVG */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSvg}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#D4AF37]/70 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-950 text-xs font-bold hover:brightness-110 transition-all shadow-sm"
              title="Download Scalable Vector Graphic (SVG)"
            >
              <Download size={13} />
              <span className="hidden sm:inline">{t.downloadSvg || "Export SVG"}</span>
            </button>
          </div>
        </div>

        {/* Quick Jump Bar to Major Biblical Patriarchs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs scrollbar-none touch-pan-x -mx-1 px-1">
          <span className="text-slate-400 text-[11px] font-bold shrink-0 flex items-center gap-1">
            <ArrowRight size={12} className="text-[#D4AF37]" />
            {isRTL ? "انتقال سريع إلى:" : "Quick Jump:"}
          </span>
          {quickJumpPatriarchs.map((patriarch) => (
            <button
              key={patriarch.id}
              onClick={() => handleJumpToPerson(patriarch.id)}
              className="px-2.5 py-1 rounded-lg border border-[#3E4554] bg-[#1A1E26] hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 text-slate-200 hover:text-[#F3E5AB] font-semibold text-[11px] transition-colors shrink-0 shadow-2xs"
            >
              {isRTL ? patriarch.nameAr : patriarch.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`relative flex-1 w-full h-full overflow-hidden cursor-${
          isDragging ? "grabbing" : "grab"
        } bg-[radial-gradient(ellipse_at_50%_25%,#3E4452_0%,#20242D_70%,#15181E_100%)]`}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Card Rounded Drop Shadow */}
            <filter id="otCardShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation="6"
                floodColor="#0B0D12"
                floodOpacity="0.65"
              />
            </filter>

            {/* Glowing Golden Aura for Active/Hovered Lineage */}
            <filter id="otGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="5"
                floodColor="#D4AF37"
                floodOpacity="0.9"
              />
            </filter>

            {/* Avatar Frame Clip Mask */}
            <clipPath id="otAvatarClip">
              <rect x="0" y="0" width="60" height="58" rx="10" />
            </clipPath>
          </defs>

          {/* Dynamic Transform Group (Pan & Zoom) */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Generous Bottom Padding Spacer element inside SVG */}
            <rect
              x={0}
              y={bounds.height - PADDING_BOTTOM}
              width={bounds.width}
              height={PADDING_BOTTOM}
              fill="transparent"
              pointerEvents="none"
            />
            {/* 1. HORIZONTAL GENERATION LEVEL GUIDES */}
            {showGenerationGuides &&
              generationsList.map((gInfo) => (
                <g key={`gen_tier_${gInfo.gen}`}>
                  <line
                    x1={PADDING_LEFT - 30}
                    y1={gInfo.y + CARD_HEIGHT / 2}
                    x2={bounds.width + 50}
                    y2={gInfo.y + CARD_HEIGHT / 2}
                    stroke="#4B5563"
                    strokeWidth="1.2"
                    strokeDasharray="4 8"
                    opacity="0.25"
                  />

                  {/* Left Generation Milestone Badge */}
                  <g transform={`translate(16, ${gInfo.y + 32})`}>
                    <rect
                      x="0"
                      y="0"
                      width="46"
                      height="26"
                      rx="6"
                      fill="#1E232D"
                      stroke="#4B5563"
                      strokeWidth="1"
                    />
                    <text
                      x="23"
                      y="17"
                      textAnchor="middle"
                      fill="#9CA3AF"
                      className="font-mono font-bold text-[10.5px]"
                    >
                      G{gInfo.gen}
                    </text>
                  </g>
                </g>
              ))}

            {/* 2. ORTHOGONAL CONNECTING LINES */}
            <g id="svg-tree-edges">
              {edgesWithHighlight.map((edge) => {
                const { parentCenter, childrenPoints, midY, isHighlighted } = edge;
                const lineColor = isHighlighted ? "#D4AF37" : "#565F73";
                const strokeWidth = isHighlighted ? 3 : 2;

                if (childrenPoints.length === 1) {
                  const child = childrenPoints[0];
                  return (
                    <g key={edge.id}>
                      <path
                        d={`M ${parentCenter.x} ${parentCenter.y} L ${parentCenter.x} ${midY} L ${child.x} ${midY} L ${child.x} ${child.y}`}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter={isHighlighted ? "url(#otGoldGlow)" : undefined}
                      />
                    </g>
                  );
                }

                const minChildX = Math.min(...childrenPoints.map((c) => c.x));
                const maxChildX = Math.max(...childrenPoints.map((c) => c.x));

                return (
                  <g key={edge.id}>
                    {/* Vertical drop from parent center down to midY */}
                    <line
                      x1={parentCenter.x}
                      y1={parentCenter.y}
                      x2={parentCenter.x}
                      y2={midY}
                      stroke={lineColor}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      filter={isHighlighted ? "url(#otGoldGlow)" : undefined}
                    />

                    {/* Horizontal crossbar spanning from leftmost to rightmost child */}
                    <line
                      x1={Math.min(parentCenter.x, minChildX)}
                      y1={midY}
                      x2={Math.max(parentCenter.x, maxChildX)}
                      y2={midY}
                      stroke={lineColor}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      filter={isHighlighted ? "url(#otGoldGlow)" : undefined}
                    />

                    {/* Vertical drops into each child's top center */}
                    {childrenPoints.map((childPt, cIdx) => (
                      <g key={`${edge.id}_child_${cIdx}`}>
                        <line
                          x1={childPt.x}
                          y1={midY}
                          x2={childPt.x}
                          y2={childPt.y}
                          stroke={lineColor}
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                          filter={isHighlighted ? "url(#otGoldGlow)" : undefined}
                        />
                        <circle
                          cx={childPt.x}
                          cy={childPt.y}
                          r={isHighlighted ? 3.5 : 2.5}
                          fill={lineColor}
                        />
                      </g>
                    ))}
                  </g>
                );
              })}
            </g>

            {/* 3. PERSON NODES (Sleek Dark Cards with Old Testament Character Art) */}
            <g id="svg-tree-nodes">
              {sortedLayoutNodes.map((node) => {
                const { person, x, y, spouse, isExpanded, hasChildren, childCount } = node;
                const isHovered = hoveredPersonId === person.id;
                const isMatch = matchingPersonIds.has(person.id);

                const displayName = getPersonDisplayName(person, lang);
                const subName = isRTL ? person.name : person.arabicName;

                return (
                  <g
                    key={`node_unit_${person.id}`}
                    className="interactive-node"
                    onMouseEnter={() => setHoveredPersonId(person.id)}
                    onMouseLeave={() => setHoveredPersonId(null)}
                  >
                    {/* Primary Person Card */}
                    <g
                      transform={`translate(${x}, ${y})`}
                      onClick={() => onSelectPerson && onSelectPerson(person)}
                      className="cursor-pointer group"
                    >
                      {/* Dark Rounded-Square Card Body */}
                      <rect
                        width={CARD_WIDTH}
                        height={CARD_HEIGHT}
                        rx="14"
                        ry="14"
                        fill="#2A2F3A"
                        stroke={
                          isMatch
                            ? "#F59E0B"
                            : isHovered
                            ? "#D4AF37"
                            : "#3E4656"
                        }
                        strokeWidth={isMatch ? 3 : isHovered ? 2.5 : 1.5}
                        filter={isMatch || isHovered ? "url(#otGoldGlow)" : "url(#otCardShadow)"}
                        className="transition-all duration-150"
                      />

                      {/* Old Testament Character Vector Avatar */}
                      {renderOldTestamentAvatar(person)}

                      {/* Primary Person Name */}
                      <text
                        x={CARD_WIDTH / 2}
                        y={80}
                        textAnchor="middle"
                        fill="#F9FAFB"
                        className="font-cinzel font-black text-[11px] select-none pointer-events-none"
                      >
                        {displayName.length > 13
                          ? displayName.slice(0, 12) + "…"
                          : displayName}
                      </text>

                      {/* Lifespan or Dates subtitle */}
                      <text
                        x={CARD_WIDTH / 2}
                        y={94}
                        textAnchor="middle"
                        fill="#D4AF37"
                        className="font-mono text-[9.5px] font-bold opacity-90 select-none pointer-events-none"
                      >
                        {person.yearsLived
                          ? `${person.yearsLived} ${t.years || "y"}`
                          : person.birthYearBC !== undefined
                          ? formatYearDisplay(person.birthYearBC, lang)
                          : subName
                          ? subName.slice(0, 12)
                          : ""}
                      </text>

                      {/* Large, Easy-to-Click Expand/Collapse Button (Solves interaction difficulty!) */}
                      {hasChildren && (
                        <g
                          transform={`translate(${(CARD_WIDTH - 60) / 2}, ${CARD_HEIGHT - 12})`}
                          onClick={(e) => toggleNodeExpand(person.id, e)}
                          className="cursor-pointer hover:brightness-125 transition-all"
                        >
                          <rect
                            x="0"
                            y="0"
                            width="60"
                            height="19"
                            rx="9.5"
                            fill="#1B1F27"
                            stroke="#D4AF37"
                            strokeWidth="1.2"
                          />
                          <text
                            x="30"
                            y="13"
                            textAnchor="middle"
                            fill="#F3E5AB"
                            className="font-mono font-bold text-[9.5px] select-none pointer-events-none"
                          >
                            {isExpanded
                              ? `▲ ${isRTL ? "طي" : "Hide"}`
                              : `▼ ${childCount} ${isRTL ? "أبناء" : "sons"}`}
                          </text>
                        </g>
                      )}
                    </g>

                    {/* Spouse Companion Card (e.g. Eve with Adam, Sarah with Abraham) */}
                    {spouse && (
                      <g>
                        {/* Horizontal Marriage Link Line */}
                        <line
                          x1={x + CARD_WIDTH}
                          y1={y + CARD_HEIGHT / 2}
                          x2={x + CARD_WIDTH + SIBLING_GAP}
                          y2={y + CARD_HEIGHT / 2}
                          stroke="#D4AF37"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                        />

                        {/* Spouse Card */}
                        <g
                          transform={`translate(${x + CARD_WIDTH + SIBLING_GAP}, ${y})`}
                          onClick={() => onSelectPerson && onSelectPerson(spouse)}
                          className="cursor-pointer group"
                        >
                          <rect
                            width={CARD_WIDTH}
                            height={CARD_HEIGHT}
                            rx="14"
                            ry="14"
                            fill="#2A2F3A"
                            stroke={
                              matchingPersonIds.has(spouse.id)
                                ? "#F59E0B"
                                : hoveredPersonId === spouse.id
                                ? "#D4AF37"
                                : "#4A3944"
                            }
                            strokeWidth={matchingPersonIds.has(spouse.id) ? 3 : 1.5}
                            filter="url(#otCardShadow)"
                            className="transition-all duration-150"
                          />

                          {/* Spouse Character Vector Avatar */}
                          {renderOldTestamentAvatar(spouse)}

                          {/* Spouse Name */}
                          <text
                            x={CARD_WIDTH / 2}
                            y={80}
                            textAnchor="middle"
                            fill="#FCE7F3"
                            className="font-cinzel font-black text-[11px] select-none pointer-events-none"
                          >
                            {getPersonDisplayName(spouse, lang).length > 13
                              ? getPersonDisplayName(spouse, lang).slice(0, 12) + "…"
                              : getPersonDisplayName(spouse, lang)}
                          </text>

                          {/* Spouse Lifespan */}
                          <text
                            x={CARD_WIDTH / 2}
                            y={94}
                            textAnchor="middle"
                            fill="#F472B6"
                            className="font-mono text-[9.5px] font-bold opacity-90 select-none pointer-events-none"
                          >
                            {spouse.yearsLived
                              ? `${spouse.yearsLived} ${t.years || "y"}`
                              : isRTL
                              ? "الزوجة"
                              : "Spouse"}
                          </text>
                        </g>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {/* Floating Active Person Inspection Pill (Instant biblical context & inspection on hover) */}
        {hoveredPerson ? (
          <div className="absolute bottom-2 sm:bottom-3 left-2 right-2 sm:right-auto sm:left-3 z-30 flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-[#181C24]/95 border border-[#D4AF37] text-white shadow-2xl backdrop-blur-md max-w-full sm:max-w-md animate-fadeIn">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#252A35] border border-[#3A4252] flex items-center justify-center shrink-0">
              <Users size={16} className="text-[#D4AF37]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-xs text-[#F3E5AB] truncate">
                  {getPersonDisplayName(hoveredPerson, lang)}
                </span>
                {hoveredPerson.yearsLived && (
                  <span className="font-mono text-[10px] text-[#D4AF37] font-bold shrink-0">
                    ({hoveredPerson.yearsLived} {t.years || "y"})
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">
                {isRTL
                  ? `اضغط على الشخصية لعرض التفاصيل وسلسلة النسب الكاملة`
                  : `Click figure to open full biblical details & lineage`}
              </p>
            </div>
            <button
              onClick={() => onSelectPerson && onSelectPerson(hoveredPerson)}
              className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37] text-slate-950 font-bold text-xs shrink-0 hover:brightness-110 transition-all shadow-xs"
            >
              {isRTL ? "التفاصيل" : "Details"}
            </button>
          </div>
        ) : (
          /* Default Navigation Instructions */
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-10 pointer-events-none flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#181C24]/85 border border-[#3A4252] text-slate-300 shadow-lg backdrop-blur-md max-w-[calc(100%-120px)] sm:max-w-none truncate">
            <Move size={12} className="text-[#D4AF37] shrink-0" />
            <span className="truncate">
              {t.panHint || (isRTL ? "اسحب للتحريك · قرّب بأصابعك للتكبير · اضغط للمعاينة" : "Drag to pan · Pinch/scroll to zoom · Click to inspect")}
            </span>
          </div>
        )}

        {/* Level Indicator Pill (Hidden on mobile if inspection card is visible to prevent overlap) */}
        <div className={`${hoveredPerson ? "hidden sm:flex" : "flex"} absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-10 items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#181C24]/85 border border-[#3A4252] text-[11px] sm:text-xs font-mono font-bold text-slate-200 shadow-lg backdrop-blur-md`}>
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>
            {generationsList.length} {isRTL ? "مستويات أفقية" : "Horizontal Rows"}
          </span>
        </div>
      </div>
    </div>
  );
};
