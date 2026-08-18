/**
 * Utility graph engine for skill insertion, reordering, and dependency repair in Roadmaps.
 */

/**
 * Normalizes skill title to UPPERCASE consistently.
 */
export const normalizeSkillTitle = (title) => {
  if (!title) return '';
  return title.trim().toUpperCase();
};

/**
 * Inserts a new skill BETWEEN two existing skills (e.g. C++ -> NEW_SKILL -> JAVA).
 * - Updates newSkill's prerequisites to [sourceSkillTitle].
 * - Updates targetSkill's prerequisites from sourceSkillTitle to [newSkill.title].
 */
export const insertSkillBetween = (skills = [], sourceSkillTitle, targetSkillTitle, newSkillData) => {
  const sourceTitle = normalizeSkillTitle(sourceSkillTitle);
  const targetTitle = normalizeSkillTitle(targetSkillTitle);
  const newTitle = normalizeSkillTitle(newSkillData.title);

  if (!newTitle) return skills;

  const newSkill = {
    id: newSkillData.id || `sk-${Date.now()}`,
    title: newTitle,
    category: newSkillData.category || 'General',
    done: false,
    isCurrent: false,
    isParallel: Boolean(newSkillData.isParallel),
    relationshipType: newSkillData.isParallel ? 'parallel' : 'sequential',
    dependencies: sourceTitle ? [sourceTitle] : [],
    why: newSkillData.why || `Inserted between ${sourceTitle} and ${targetTitle}`
  };

  const updatedSkills = skills.map(sk => {
    const skTitle = normalizeSkillTitle(sk.title);
    if (skTitle === targetTitle) {
      // Replace sourceTitle dependency with newTitle
      const newDeps = (sk.dependencies || []).map(d => {
        return normalizeSkillTitle(d) === sourceTitle ? newTitle : normalizeSkillTitle(d);
      });
      if (!newDeps.includes(newTitle)) newDeps.push(newTitle);
      return { ...sk, dependencies: newDeps };
    }
    return sk;
  });

  return [...updatedSkills, newSkill];
};

/**
 * Inserts a new skill BEFORE a reference skill (e.g. NEW_SKILL -> TARGET_SKILL).
 * - newSkill inherits referenceSkill's prerequisites.
 * - referenceSkill's prerequisite becomes newSkill.title.
 */
export const insertSkillBefore = (skills = [], referenceSkillTitle, newSkillData) => {
  const refTitle = normalizeSkillTitle(referenceSkillTitle);
  const newTitle = normalizeSkillTitle(newSkillData.title);

  if (!newTitle || !refTitle) return skills;

  const refSkill = skills.find(s => normalizeSkillTitle(s.title) === refTitle);
  const inheritedDeps = refSkill ? (refSkill.dependencies || []).map(normalizeSkillTitle) : [];

  const newSkill = {
    id: newSkillData.id || `sk-${Date.now()}`,
    title: newTitle,
    category: newSkillData.category || 'General',
    done: false,
    isCurrent: false,
    isParallel: Boolean(newSkillData.isParallel),
    relationshipType: newSkillData.isParallel ? 'parallel' : 'sequential',
    dependencies: inheritedDeps,
    why: newSkillData.why || `Inserted before ${refTitle}`
  };

  const updatedSkills = skills.map(sk => {
    if (normalizeSkillTitle(sk.title) === refTitle) {
      return { ...sk, dependencies: [newTitle] };
    }
    return sk;
  });

  return [...updatedSkills, newSkill];
};

/**
 * Inserts a new skill AFTER a reference skill (e.g. REF_SKILL -> NEW_SKILL).
 * - newSkill's prerequisite becomes refTitle.
 * - Skills that previously depended on refTitle now depend on newTitle.
 */
export const insertSkillAfter = (skills = [], referenceSkillTitle, newSkillData) => {
  const refTitle = normalizeSkillTitle(referenceSkillTitle);
  const newTitle = normalizeSkillTitle(newSkillData.title);

  if (!newTitle || !refTitle) return skills;

  const newSkill = {
    id: newSkillData.id || `sk-${Date.now()}`,
    title: newTitle,
    category: newSkillData.category || 'General',
    done: false,
    isCurrent: false,
    isParallel: Boolean(newSkillData.isParallel),
    relationshipType: newSkillData.isParallel ? 'parallel' : 'sequential',
    dependencies: [refTitle],
    why: newSkillData.why || `Inserted after ${refTitle}`
  };

  // Re-link skills depending on refTitle to depend on newTitle (unless parallel)
  const updatedSkills = skills.map(sk => {
    const skDeps = (sk.dependencies || []).map(normalizeSkillTitle);
    if (skDeps.includes(refTitle) && !sk.isParallel && !newSkillData.isParallel) {
      const updatedDeps = skDeps.map(d => d === refTitle ? newTitle : d);
      return { ...sk, dependencies: updatedDeps };
    }
    return sk;
  });

  return [...updatedSkills, newSkill];
};

/**
 * Reorders an existing skill to a new position (At beginning, Before X, After X).
 */
export const reorderSkillPosition = (skills = [], skillToMoveId, positionType, referenceSkillTitle) => {
  const targetSkill = skills.find(s => s.id === skillToMoveId);
  if (!targetSkill) return skills;

  const targetTitle = normalizeSkillTitle(targetSkill.title);
  const refTitle = normalizeSkillTitle(referenceSkillTitle);

  if (targetTitle === refTitle) return skills;

  // Remove targetSkill from current dependencies of other skills
  let cleanSkills = skills.map(sk => {
    const deps = (sk.dependencies || []).map(normalizeSkillTitle).filter(d => d !== targetTitle);
    return { ...sk, dependencies: deps };
  });

  if (positionType === 'beginning') {
    cleanSkills = cleanSkills.map(sk => {
      if (sk.id === skillToMoveId) {
        return { ...sk, dependencies: [] };
      }
      return sk;
    });
  } else if (positionType === 'before' && refTitle) {
    const refSkill = cleanSkills.find(s => normalizeSkillTitle(s.title) === refTitle);
    const inheritedDeps = refSkill ? (refSkill.dependencies || []).map(normalizeSkillTitle) : [];

    cleanSkills = cleanSkills.map(sk => {
      if (sk.id === skillToMoveId) {
        return { ...sk, dependencies: inheritedDeps };
      }
      if (normalizeSkillTitle(sk.title) === refTitle) {
        return { ...sk, dependencies: [targetTitle] };
      }
      return sk;
    });
  } else if (positionType === 'after' && refTitle) {
    cleanSkills = cleanSkills.map(sk => {
      if (sk.id === skillToMoveId) {
        return { ...sk, dependencies: [refTitle] };
      }
      return sk;
    });
  }

  return cleanSkills;
};
