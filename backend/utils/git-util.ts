import { execSync } from 'child_process';

// branch_name || branch-name || branch.name => BranchName
const formatName = (name: string): string => {
  const words = name.split(/[_\-.]/);
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};

export const getCurrentGitBranch = (): string => {
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const prId = process.env.PR_ID;
    if (currentBranch.toLowerCase() === 'head' && prId) return formatName(`Pr${prId}`);
    return formatName(currentBranch);
  } catch (err) {
    return 'Master';
  }
};
