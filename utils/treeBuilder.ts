import { Category } from '@prisma/client';
import { CategoryWithChildren } from '../../shared/types';

// export const createDataTree = (dataset: Category[]) => {
//   const hashTable = Object.create(null);
//   dataset.forEach(
//     (entry: Category) => (hashTable[entry.id] = { ...entry, children: [] })
//   );
//   const dataTree: Category[] = [];
//   dataset.forEach((entry: Category) => {
//     if (entry.parentId)
//       hashTable[entry.parentId].children.push(hashTable[entry.id]);
//     else dataTree.push(hashTable[entry.id]);
//   });
//   return dataTree;
// };

export const categoriesListToTree = (
  categories: Category[]
): CategoryWithChildren[] => {
  const hash: Record<string, CategoryWithChildren> = {};
  const tree: CategoryWithChildren[] = [];

  for (const c of categories) {
    hash[c.id] = {
      ...c,
      children: [],
    };
  }

  for (const c of categories) {
    if (c.parentId) {
      hash[c.parentId].children?.push(c);
    } else {
      tree.push(hash[c.id]);
    }
  }

  return tree;
};
