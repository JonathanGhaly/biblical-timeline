import { useState, useMemo } from "react";
import { computeAllDates, type ComputedPerson } from "../utils/chronology";
import type { Person, Language } from "../types/genealogy";
import {
  UI_TRANSLATIONS,
  getPersonDisplayName,
  formatYearDisplay,
} from "../utils/i18n";
import {
  InteractiveTreeNode,
  type TreeNodeData,
} from "../components/Tree/InteractiveTreeNode";
import { PersonDetailModal } from "../components/Tree/PersonDetailModal";
import {
  Heart,
  GitCommit,
  User,
  Sparkles,
  Search,
  Maximize2,
  Minimize2,
  GitBranch,
  ListOrdered,
  Filter,
  X,
} from "lucide-react";
import { CopticCross } from "../components/Coptic/CopticCross";

type FamilyTreeProps = {
  people: Person[];
  lang?: Language;
};

export default function FamilyTree({ people = [], lang = "en" }: FamilyTreeProps) {
  const [viewMode, setViewMode] = useState<"tree" | "sequential">("tree");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedEra, setSelectedEra] = useState<string>("all");
  const [selectedPersonForModal, setSelectedPersonForModal] =
    useState<ComputedPerson | null>(null);

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  // 1. Compute dates for all people
  const computedPeople = useMemo(() => computeAllDates(people), [people]);

  const peopleMap = useMemo(() => {
    return new Map(computedPeople.map((p) => [p.id, p]));
  }, [computedPeople]);

  // 2. Build recursive hierarchical tree data (Ordered Father -> Sons)
  const treeRoots = useMemo(() => {
    // A root is anyone without a fatherId or whose fatherId does not exist in dataset
    const roots = computedPeople.filter(
      (p) => !p.fatherId || !peopleMap.has(p.fatherId)
    );

    // Adam is the paramount biblical root
    roots.sort((a, b) => {
      if (a.id === "adam" || a.name.toLowerCase() === "adam") return -1;
      if (b.id === "adam" || b.name.toLowerCase() === "adam") return 1;
      return (b.birthYearBC ?? 0) - (a.birthYearBC ?? 0);
    });

    function buildNode(
      person: ComputedPerson,
      level: number,
      visited = new Set<string>()
    ): TreeNodeData {
      if (visited.has(person.id)) {
        return {
          person,
          level,
          generationNumber: level,
          father: person.fatherId ? peopleMap.get(person.fatherId) : undefined,
          mother: person.motherId ? peopleMap.get(person.motherId) : undefined,
          spouses: [],
          children: [],
        };
      }
      visited.add(person.id);

      // Find children where this person is the father (or mother if no father)
      const directChildren = computedPeople.filter(
        (p) => p.fatherId === person.id
      );

      // Sort children: males first, then birth year BC
      directChildren.sort((a, b) => {
        if (a.gender === "male" && b.gender !== "male") return -1;
        if (a.gender !== "male" && b.gender === "male") return 1;
        return (b.birthYearBC ?? 0) - (a.birthYearBC ?? 0);
      });

      const spouses = computedPeople.filter(
        (p) =>
          (person.spouseIds || []).includes(p.id) ||
          p.husbandId === person.id ||
          p.wifeId === person.id
      );

      return {
        person,
        level,
        generationNumber: level,
        father: person.fatherId ? peopleMap.get(person.fatherId) : undefined,
        mother: person.motherId ? peopleMap.get(person.motherId) : undefined,
        spouses,
        children: directChildren.map((child) =>
          buildNode(child, level + 1, new Set(visited))
        ),
      };
    }

    return roots.map((root) => buildNode(root, 1));
  }, [computedPeople, peopleMap]);

  // 3. Preorder traversal for strictly sequential "Father then Sons and so on"
  const sequentialOrderedNodes = useMemo(() => {
    const list: TreeNodeData[] = [];
    function traverse(node: TreeNodeData) {
      list.push(node);
      for (const child of node.children) {
        traverse(child);
      }
    }
    treeRoots.forEach(traverse);
    return list;
  }, [treeRoots]);

  // 4. Expanded node IDs state (initialized with key ancestors expanded)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    // Auto-expand all nodes with children up to level 12 so the tree is immediately rich
    function autoExpand(nodes: TreeNodeData[]) {
      for (const n of nodes) {
        if (n.children.length > 0) {
          initial.add(n.person.id);
          autoExpand(n.children);
        }
      }
    }
    treeRoots.forEach((root) => autoExpand([root]));
    return initial;
  });

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    const term = val.trim().toLowerCase();
    if (!term) return;

    setExpandedIds((prev) => {
      const next = new Set(prev);
      function checkNode(node: TreeNodeData): boolean {
        const match =
          node.person.name.toLowerCase().includes(term) ||
          (node.person.arabicName && node.person.arabicName.includes(term));

        let childMatch = false;
        for (const child of node.children) {
          if (checkNode(child)) {
            childMatch = true;
          }
        }

        if (match || childMatch) {
          next.add(node.person.id);
          return true;
        }
        return false;
      }

      treeRoots.forEach((root) => checkNode(root));
      return next;
    });
  };

  const toggleExpand = (id: string) => {
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
    function collect(nodes: TreeNodeData[]) {
      for (const n of nodes) {
        if (n.children.length > 0) {
          all.add(n.person.id);
          collect(n.children);
        }
      }
    }
    treeRoots.forEach((root) => collect([root]));
    setExpandedIds(all);
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  // Filtered roots for era filter
  const displayedRoots = useMemo(() => {
    if (selectedEra === "all") return treeRoots;
    if (selectedEra === "adam-noah") {
      return treeRoots.filter(
        (r) => r.person.id === "adam" || r.person.name.toLowerCase() === "adam"
      );
    }
    if (selectedEra === "noah") {
      const noah = computedPeople.find((p) => p.id === "noah");
      if (noah) {
        const noahNode = sequentialOrderedNodes.find(
          (n) => n.person.id === "noah"
        );
        if (noahNode) return [noahNode];
      }
    }
    if (selectedEra === "abraham") {
      const abrahamNode = sequentialOrderedNodes.find(
        (n) => n.person.id === "abraham"
      );
      if (abrahamNode) return [abrahamNode];
    }
    return treeRoots;
  }, [selectedEra, treeRoots, computedPeople, sequentialOrderedNodes]);

  // Sequential nodes filtered by search and era
  const displayedSequentialNodes = useMemo(() => {
    let list = sequentialOrderedNodes;
    if (selectedEra === "noah") {
      const noahIdx = list.findIndex((n) => n.person.id === "noah");
      if (noahIdx !== -1) list = list.slice(noahIdx);
    } else if (selectedEra === "abraham") {
      const abrahamIdx = list.findIndex((n) => n.person.id === "abraham");
      if (abrahamIdx !== -1) list = list.slice(abrahamIdx);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter(
        (n) =>
          n.person.name.toLowerCase().includes(term) ||
          (n.person.arabicName && n.person.arabicName.includes(term)) ||
          getPersonDisplayName(n.person, lang).toLowerCase().includes(term)
      );
    }
    return list;
  }, [sequentialOrderedNodes, selectedEra, searchTerm, lang]);

  return (
    <div className="space-y-8 animate-fadeIn" dir={isRTL ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="p-6 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#800020]/15 via-[#FBF8EF] to-[#D4AF37]/15 dark:from-[#1C1A17] dark:via-[#161412] dark:to-[#800020]/25 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CopticCross size={26} />
              <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                {t.treeTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6B5E4E] dark:text-[#A99F8D] mt-1 max-w-2xl">
              {t.treeSubtitle}
            </p>
          </div>

          {/* View Mode Toggle & Expand Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl border border-[#D4AF37]/50 bg-white/80 dark:bg-[#121110] shadow-sm">
              <button
                onClick={() => setViewMode("tree")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === "tree"
                    ? "bg-[#800020] text-white shadow"
                    : "text-[#800020] dark:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                }`}
              >
                <GitBranch size={14} />
                <span>{t.interactiveTree}</span>
              </button>

              <button
                onClick={() => setViewMode("sequential")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === "sequential"
                    ? "bg-[#800020] text-white shadow"
                    : "text-[#800020] dark:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                }`}
              >
                <ListOrdered size={14} />
                <span>{t.sequentialView}</span>
              </button>
            </div>

            {/* Tree Branch Expansion Buttons */}
            {viewMode === "tree" && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExpandAll}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#D4AF37]/60 bg-white dark:bg-[#1C1A17] text-xs font-bold text-[#800020] dark:text-[#F3E5AB] hover:bg-[#D4AF37]/20 transition-colors shadow-sm"
                  title={t.expandAll}
                >
                  <Maximize2 size={13} />
                  <span className="hidden sm:inline">{t.expandAll}</span>
                </button>
                <button
                  onClick={handleCollapseAll}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#D4AF37]/60 bg-white dark:bg-[#1C1A17] text-xs font-bold text-[#800020] dark:text-[#F3E5AB] hover:bg-[#D4AF37]/20 transition-colors shadow-sm"
                  title={t.collapseAll}
                >
                  <Minimize2 size={13} />
                  <span className="hidden sm:inline">{t.collapseAll}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search & Era Quick Filter Toolbar */}
        <div className="mt-5 pt-4 border-t border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className={`absolute top-1/2 -translate-y-1/2 text-[#8C7B6B] ${
                isRTL ? "right-3" : "left-3"
              }`}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t.searchTreePlaceholder}
              className={`w-full py-2 rounded-xl border border-[#D4AF37]/50 bg-white dark:bg-[#1A1816] text-xs sm:text-sm text-[#2C241E] dark:text-[#F3E5AB] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                isRTL ? "pr-9 pl-8" : "pl-9 pr-8"
              }`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className={`absolute top-1/2 -translate-y-1/2 text-[#8C7B6B] hover:text-[#800020] dark:hover:text-[#F3E5AB] ${
                  isRTL ? "left-2.5" : "right-2.5"
                }`}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Era Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-[#800020] dark:text-[#D4AF37] text-[11px] flex items-center gap-1">
              <Filter size={12} />
              {lang === "ar" ? "الحقبة:" : "Era:"}
            </span>
            {[
              { id: "all", labelAr: "الكل (من آدم)", labelEn: "All Lineage (Adam)" },
              { id: "adam-noah", labelAr: "من آدم إلى نوح", labelEn: "Adam to Noah" },
              { id: "noah", labelAr: "فرع نوح", labelEn: "Noah Branch" },
              { id: "abraham", labelAr: "إبراهيم وإسحاق", labelEn: "Abraham & Isaac" },
            ].map((era) => (
              <button
                key={era.id}
                onClick={() => setSelectedEra(era.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors border ${
                  selectedEra === era.id
                    ? "border-[#800020] bg-[#800020] text-white dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#121110]"
                    : "border-[#D4AF37]/40 bg-white/70 dark:bg-[#1A1816] text-[#6B5E4E] dark:text-[#C5BAA8] hover:bg-[#D4AF37]/15"
                }`}
              >
                {lang === "ar" ? era.labelAr : era.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE TREE */}
      {viewMode === "tree" && (
        <div className="p-6 rounded-2xl border-2 border-[#D4AF37]/60 bg-white/50 dark:bg-[#161412]/50 shadow-md overflow-x-auto min-h-[500px]">
          <div className="space-y-6 min-w-[320px]">
            {displayedRoots.length > 0 ? (
              displayedRoots.map((rootNode, rIdx) => (
                <InteractiveTreeNode
                  key={`${rootNode.person.id}_${rIdx}`}
                  node={rootNode}
                  lang={lang}
                  expandedIds={expandedIds}
                  toggleExpand={toggleExpand}
                  onSelectPerson={(p) => setSelectedPersonForModal(p)}
                  searchTerm={searchTerm}
                />
              ))
            ) : (
              <div className="text-center py-12 text-[#8C7B6B] dark:text-[#A99F8D] italic">
                {lang === "ar"
                  ? "لا توجد شخصيات مطابقة لمعايير البحث."
                  : "No figures match the current search."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: SEQUENTIAL FAMILY UNITS (Ordered Father -> Sons) */}
      {viewMode === "sequential" && (
        <div className="space-y-6">
          <div className="p-3 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-between text-xs font-bold text-[#800020] dark:text-[#F3E5AB]">
            <span>
              {lang === "ar"
                ? `ترتيب السلالة التتابعي (الأب أولاً ثم الأبناء وأحفادهم): ${displayedSequentialNodes.length} شخصية`
                : `Sequential Lineage Order (Father then direct Sons): ${displayedSequentialNodes.length} figures`}
            </span>
          </div>

          <div className="space-y-6">
            {displayedSequentialNodes.map((node, nIdx) => {
              const husband = node.person;
              const husbandDisplayName = getPersonDisplayName(husband, lang);
              const husbandSubName =
                isRTL ? husband.name : husband.arabicName;

              // Parents
              const father = node.father;
              const mother = node.mother;
              const fatherName = father
                ? getPersonDisplayName(father, lang)
                : t.rootCreation;
              const motherName = mother
                ? getPersonDisplayName(mother, lang)
                : husband.fatherId
                ? lang === "ar"
                  ? "أم غير مسجلة في السفر"
                  : "Unrecorded Mother"
                : t.rootCreation;

              // Wives / Spouses
              const wives = node.spouses;

              // Direct Children
              const children = node.children.map((c) => c.person);

              return (
                <div
                  key={`seq_${husband.id}_${nIdx}`}
                  className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37] bg-white/80 dark:bg-[#1C1A17] p-6 shadow-md transition-all space-y-5"
                >
                  {/* Top Illuminated Accents */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#1A365D]" />

                  {/* Header Tag with Generation Number */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold border border-[#800020]/40 bg-[#800020]/10 text-[#800020] dark:text-[#F3E5AB]">
                      {t.generation} {node.generationNumber}
                    </span>

                    <button
                      onClick={() => setSelectedPersonForModal(husband)}
                      className="text-xs font-bold text-[#800020] dark:text-[#D4AF37] hover:underline"
                    >
                      {t.clickToInspect}
                    </button>
                  </div>

                  {/* 1. PARENTS GENERATION (Mother & Father) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B5E4E] dark:text-[#A99F8D]">
                      <GitCommit
                        size={14}
                        className="text-[#800020] dark:text-[#D4AF37]"
                      />
                      <span>{t.parentGeneration}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Father Pill */}
                      <button
                        onClick={() => father && setSelectedPersonForModal(father)}
                        disabled={!father}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-xs font-semibold text-[#800020] dark:text-[#F3E5AB] ${
                          father ? "hover:bg-[#D4AF37]/25 cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-[#8C6F12] dark:text-[#C5A028]">
                          {t.father}:
                        </span>
                        <span>{fatherName}</span>
                      </button>

                      <span className="text-xs font-bold text-[#D4AF37]">+</span>

                      {/* Mother Pill */}
                      <button
                        onClick={() => mother && setSelectedPersonForModal(mother)}
                        disabled={!mother}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-pink-300/60 bg-pink-50/50 dark:bg-pink-950/30 text-xs font-semibold text-pink-900 dark:text-pink-300 ${
                          mother ? "hover:bg-pink-100/70 cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-pink-700 dark:text-pink-400">
                          {t.mother}:
                        </span>
                        <span>{motherName}</span>
                      </button>
                    </div>
                  </div>

                  {/* Vertical Decorative Divider */}
                  <div className="flex justify-center my-1">
                    <div className="w-px h-5 bg-[#D4AF37]/60" />
                  </div>

                  {/* 2. MARRIAGE GENERATION (Husband & Spouses) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
                      <Sparkles size={14} />
                      <span>{t.marriageGeneration}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Patriarch Box */}
                      <div
                        onClick={() => setSelectedPersonForModal(husband)}
                        className="cursor-pointer rounded-xl p-4 border-2 border-[#800020]/40 dark:border-[#800020] bg-gradient-to-br from-[#800020]/5 to-transparent space-y-2 shadow-sm hover:border-[#800020] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
                              {lang === "ar"
                                ? "رأس الأسرة / الأب"
                                : "Husband / Patriarch"}
                            </span>
                            <h4 className="text-lg font-bold font-cinzel text-[#800020] dark:text-[#F3E5AB]">
                              {husbandDisplayName}
                            </h4>
                            {husbandSubName && (
                              <span className="text-xs text-[#7A6E5E] dark:text-[#A99F8D]">
                                {husbandSubName}
                              </span>
                            )}
                          </div>

                          {husband.yearsLived !== undefined && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#D4AF37] bg-[#D4AF37]/15 text-[#8C6F12] dark:text-[#F3E5AB]">
                              {husband.yearsLived} {t.years}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#5C5042] dark:text-[#A99F8D] space-y-1 pt-1">
                          <div>
                            <strong>{t.birth}:</strong>{" "}
                            {formatYearDisplay(husband.birthYearBC, lang)}
                            {" — "}
                            <strong>{t.death}:</strong>{" "}
                            {formatYearDisplay(husband.deathYearBC, lang)}
                          </div>
                          {husband.husbandMarriageAge && (
                            <div>
                              <strong>{t.marriedAt}:</strong>{" "}
                              {husband.husbandMarriageAge} {t.years}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Wives / Spouses Box */}
                      <div className="rounded-xl p-4 border-2 border-pink-300/50 dark:border-pink-900/60 bg-gradient-to-br from-pink-50/40 dark:from-pink-950/20 to-transparent space-y-3 shadow-sm">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-700 dark:text-pink-400">
                          <Heart size={12} />
                          <span>{t.spouse}</span>
                        </div>

                        {wives.length > 0 ? (
                          wives.map((wife, wIdx) => {
                            const wifeDisplayName = getPersonDisplayName(
                              wife,
                              lang
                            );
                            return (
                              <div
                                key={`wife_${wife.id}_${wIdx}`}
                                onClick={() => setSelectedPersonForModal(wife)}
                                className="space-y-1 cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-950/40 p-1.5 rounded-lg transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <h5 className="font-bold text-base font-cinzel text-pink-900 dark:text-pink-200">
                                    {wifeDisplayName}
                                  </h5>
                                  {wife.yearsLived !== undefined && (
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300">
                                      {wife.yearsLived} {t.years}
                                    </span>
                                  )}
                                </div>
                                {wife.notes && (
                                  <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] italic line-clamp-2">
                                    {wife.notes}
                                  </p>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-xs text-[#8C7B6B] dark:text-[#9F9382] italic py-2">
                            {lang === "ar"
                              ? "الزوجة غير مسجلة بالاسم (وفقاً لسجل سفر التكوين)"
                              : "Wife unrecorded by name (Genesis 5 genealogy record)"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. NEXT GENERATION (Children - Sons and Daughters) */}
                  <div className="space-y-2 pt-2 border-t border-[#D4AF37]/20">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A365D] dark:text-[#90CDF4]">
                      <User size={14} />
                      <span>
                        {t.childrenGeneration} ({children.length})
                      </span>
                    </div>

                    {children.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {children.map((child, chIdx) => {
                          const childDisplayName = getPersonDisplayName(
                            child,
                            lang
                          );
                          const childMother = child.motherId
                            ? peopleMap.get(child.motherId)
                            : undefined;
                          const motherLabel = childMother
                            ? getPersonDisplayName(childMother, lang)
                            : lang === "ar"
                            ? "غير مسجلة"
                            : "Unrecorded";

                          return (
                            <button
                              key={`child_${child.id}_${chIdx}`}
                              onClick={() => setSelectedPersonForModal(child)}
                              className="p-3 rounded-xl border border-[#D4AF37]/40 bg-white/50 dark:bg-[#121110]/50 space-y-1 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors text-start"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-[#800020] dark:text-[#F3E5AB]">
                                  {childDisplayName}
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                    child.gender === "male"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                      : "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300"
                                  }`}
                                >
                                  {child.gender === "male" ? t.male : t.female}
                                </span>
                              </div>

                              <div className="text-[11px] text-[#7A6E5E] dark:text-[#A99F8D]">
                                <span>
                                  {t.mother}: <strong>{motherLabel}</strong>
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-[#8C7B6B] dark:text-[#9F9382] italic">
                        {t.noChildren}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Person Detail Modal */}
      <PersonDetailModal
        person={selectedPersonForModal}
        allPeople={computedPeople}
        lang={lang}
        onClose={() => setSelectedPersonForModal(null)}
        onSelectPerson={(p) => setSelectedPersonForModal(p)}
      />
    </div>
  );
}
