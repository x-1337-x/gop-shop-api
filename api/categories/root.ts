import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(request: VercelRequest, response: VercelResponse) {
	try {
		const categories = await prisma.category.findMany({
			where: { parentId: null },
			orderBy: { sortOrder: 'asc' },
		});
		return response.status(200).json({ categories });
	} catch (error) {
		return response.status(500).json({ error });
	}
}
