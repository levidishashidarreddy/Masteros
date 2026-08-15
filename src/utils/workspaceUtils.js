/**
 * Sorts an array of workspace objects by most recent activity timestamp (lastActivityAt / updatedAt / createdAt).
 * Primary sort: lastActivityAt descending (newest active first).
 * Secondary tie-breaker: createdAt descending (newest creation time first).
 * 
 * @param {Array} workspaces - Array of workspace objects
 * @returns {Array} New sorted array of workspaces
 */
export const sortWorkspacesByRecentActivity = (workspaces = []) => {
  if (!Array.isArray(workspaces)) return [];

  return [...workspaces].sort((a, b) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    const timeA = new Date(a.lastActivityAt || a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.lastActivityAt || b.updatedAt || b.createdAt || 0).getTime();

    if (timeB !== timeA) {
      return timeB - timeA;
    }

    const createA = new Date(a.createdAt || 0).getTime();
    const createB = new Date(b.createdAt || 0).getTime();
    return createB - createA;
  });
};
