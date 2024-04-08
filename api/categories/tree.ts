import { PrismaClient } from '@prisma/client';
import { categoriesListToTree } from '../../utils/treeBuilder';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { sortOrder: 'asc' },
		});
		const catTree = categoriesListToTree(categories);

		return res.status(200).json(catTree);
	} catch (error) {
		return res.status(500).json({ error });
	}
}
