import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const categories = await prisma.category.findMany({
			where: { parentId: null },
			orderBy: { sortOrder: 'asc' },
		});
		return res.status(200).json(categories);
	} catch (error) {
		return res.status(500).json({ error });
	}
}
