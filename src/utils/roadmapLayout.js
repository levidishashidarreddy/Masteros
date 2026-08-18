/**
 * Utility functions for dynamic 2D graph layout calculation & normalization of Roadmaps.
 */

/**
 * Normalizes roadmap data to enforce data integrity:
 * 1. UPPERCASE NORMALIZATION: Skill titles and dependencies are automatically normalized to UPPERCASE.
 * 2. STRICT SINGLE CURRENT FOCUS: Ensures at most ONE skill in the roadmap has `isCurrent: true`.
 * 3. Prerequisite & Relationship validation.
 */
export const normalizeRoadmapData = (roadmap) => {
  if (!roadmap || !roadmap.skills || !Array.isArray(roadmap.skills)) {
    return roadmap;
  }

  const skills = [...roadmap.skills];
  let currentFound = false;

  const normalizedSkills = skills.map((skill) => {
    const isSkillCurrent = Boolean(skill.isCurrent || skill.status === 'current' || skill.currentFocus);

    let finalIsCurrent = false;
    if (isSkillCurrent && !currentFound) {
      finalIsCurrent = true;
      currentFound = true;
    }

    const uppercaseTitle = (skill.title || 'UNTITLED SKILL').trim().toUpperCase();
    const uppercaseDeps = (Array.isArray(skill.dependencies) ? skill.dependencies : []).map(d => d.trim().toUpperCase());

    return {
      ...skill,
      id: skill.id || `sk-${Math.random().toString(36).substr(2, 6)}`,
      title: uppercaseTitle,
      dependencies: uppercaseDeps,
      isParallel: Boolean(skill.isParallel || skill.relationshipType === 'parallel'),
      relationshipType: skill.relationshipType || (skill.isParallel ? 'parallel' : 'sequential'),
      done: Boolean(skill.done || skill.status === 'completed'),
      isCurrent: finalIsCurrent,
      status: skill.done ? 'completed' : finalIsCurrent ? 'current' : (skill.isParallel ? 'parallel' : 'future')
    };
  });

  // If no skill is marked as Current Focus, set the first uncompleted main-path skill (or first skill) as Current Focus
  if (!currentFound && normalizedSkills.length > 0) {
    const firstUncompletedIndex = normalizedSkills.findIndex(s => !s.done && !s.isParallel);
    const targetIdx = firstUncompletedIndex !== -1 ? firstUncompletedIndex : 0;
    normalizedSkills[targetIdx].isCurrent = true;
    normalizedSkills[targetIdx].status = normalizedSkills[targetIdx].done ? 'completed' : 'current';
  }

  return {
    ...roadmap,
    skills: normalizedSkills
  };
};

/**
 * Calculates 2D graph node layout (X, Y coordinates) dynamically for skills.
 * Adapts spacing dynamically for mobile devices.
 */
export const calculateRoadmapGraphLayout = (skills = [], config = {}) => {
  if (!skills || skills.length === 0) {
    return { nodes: [], connections: [], width: 350, height: 300 };
  }

  const isMobile = config.isMobile || (typeof window !== 'undefined' && window.innerWidth < 768);

  const CARD_WIDTH = config.cardWidth || (isMobile ? 170 : 230);
  const CARD_HEIGHT = config.cardHeight || (isMobile ? 80 : 90);
  const X_SPACING = config.xSpacing || (isMobile ? 195 : 270);
  const Y_SPACING = config.ySpacing || (isMobile ? 120 : 140);
  const PADDING_X = config.paddingX || (isMobile ? 20 : 80);
  const PADDING_Y = config.paddingY || (isMobile ? 40 : 60);

  // Build ID / Name lookup maps with uppercase keys
  const skillMap = new Map();
  skills.forEach((sk) => {
    const titleUpper = (sk.title || '').trim().toUpperCase();
    const key = sk.id || titleUpper;
    skillMap.set(key, sk);
    skillMap.set(titleUpper, sk);
  });

  // Calculate Level (Y-index) using Topological Depth
  const levels = new Map();

  const getSkillLevel = (skill, visited = new Set()) => {
    if (levels.has(skill.id)) return levels.get(skill.id);
    if (visited.has(skill.id)) return 0; // Prevent infinite loops on circular dependencies

    visited.add(skill.id);

    const prereqs = skill.dependencies || [];
    if (prereqs.length === 0) {
      levels.set(skill.id, 0);
      return 0;
    }

    let maxParentLevel = -1;
    prereqs.forEach((pName) => {
      const pUpper = (pName || '').trim().toUpperCase();
      const parentSkill = skillMap.get(pUpper);
      if (parentSkill && parentSkill.id !== skill.id) {
        const pLevel = getSkillLevel(parentSkill, new Set(visited));
        if (pLevel > maxParentLevel) {
          maxParentLevel = pLevel;
        }
      }
    });

    const level = maxParentLevel + 1;
    levels.set(skill.id, level);
    return level;
  };

  // Ensure every skill gets a level calculation
  skills.forEach((sk) => getSkillLevel(sk));

  // Determine Columns (X-index)
  const levelGroups = new Map();
  skills.forEach((sk) => {
    const lvl = levels.get(sk.id) || 0;
    if (!levelGroups.has(lvl)) levelGroups.set(lvl, []);
    levelGroups.get(lvl).push(sk);
  });

  const columns = new Map();
  // Assign columns per level group
  levelGroups.forEach((groupSkills) => {
    let rightOffset = 1;
    let leftOffset = -1;

    groupSkills.forEach((sk, idx) => {
      const isParallel = Boolean(sk.isParallel || sk.relationshipType === 'parallel');

      if (!isParallel && idx === 0) {
        columns.set(sk.id, 0);
      } else if (isParallel) {
        if (rightOffset <= Math.abs(leftOffset)) {
          columns.set(sk.id, rightOffset);
          rightOffset++;
        } else {
          columns.set(sk.id, leftOffset);
          leftOffset--;
        }
      } else {
        columns.set(sk.id, rightOffset);
        rightOffset++;
      }
    });
  });

  // Calculate bounding box columns & levels
  const allCols = Array.from(columns.values());
  const minCol = Math.min(...allCols, 0);
  const maxCol = Math.max(...allCols, 0);
  const totalLevels = Math.max(...Array.from(levels.values()), 0);

  // Convert (col, level) to Pixel Coordinates (x, y)
  const centerShift = Math.abs(minCol) * X_SPACING + PADDING_X;

  const nodes = skills.map((sk) => {
    const col = columns.get(sk.id) || 0;
    const lvl = levels.get(sk.id) || 0;

    const x = centerShift + col * X_SPACING;
    const y = PADDING_Y + lvl * Y_SPACING;

    return {
      ...sk,
      title: (sk.title || '').trim().toUpperCase(),
      col,
      level: lvl,
      x,
      y,
      width: CARD_WIDTH,
      height: CARD_HEIGHT
    };
  });

  // Calculate SVG directed Connection Paths with midpoint coordinates
  const connections = [];
  const nodeMap = new Map();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  nodes.forEach((targetNode) => {
    const prereqs = targetNode.dependencies || [];
    prereqs.forEach((pName) => {
      const pUpper = (pName || '').trim().toUpperCase();
      const sourceSkill = skillMap.get(pUpper);
      if (sourceSkill) {
        const sourceNode = nodeMap.get(sourceSkill.id);
        if (sourceNode && sourceNode.id !== targetNode.id) {
          // Source anchor point (bottom-center of source node)
          const x1 = sourceNode.x + CARD_WIDTH / 2;
          const y1 = sourceNode.y + CARD_HEIGHT;

          // Target anchor point (top-center of target node)
          const x2 = targetNode.x + CARD_WIDTH / 2;
          const y2 = targetNode.y;

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          connections.push({
            id: `conn-${sourceNode.id}-${targetNode.id}`,
            fromId: sourceNode.id,
            toId: targetNode.id,
            fromTitle: sourceNode.title.toUpperCase(),
            toTitle: targetNode.title.toUpperCase(),
            isParallel: targetNode.isParallel,
            x1,
            y1,
            x2,
            y2,
            midX,
            midY
          });
        }
      }
    });
  });

  const totalWidth = (maxCol - minCol + 1) * X_SPACING + PADDING_X * 2 + CARD_WIDTH;
  const totalHeight = (totalLevels + 1) * Y_SPACING + PADDING_Y * 2 + CARD_HEIGHT;

  return {
    nodes,
    connections,
    width: Math.max(totalWidth, isMobile ? 360 : 750),
    height: Math.max(totalHeight, 400)
  };
};
