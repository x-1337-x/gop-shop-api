import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const id = req.query.id;
	console.log(id);

	if (id) {
		if (req.method === 'GET') {
			try {
				const category = await prisma.category.findUnique({
					where: { id: Number(id) },
				});
				if (!category) {
					res.status(404).send('Category not found');
					return;
				}
				return res.status(200).json(category);
			} catch (error) {
				return res.status(500).json({ error });
			}
		}

		if (req.method === 'PUT') {
			try {
				const { name, parentId = null, sortOrder, isActive = true } = req.body;
				const category = await prisma.category.update({
					where: { id: Number(id) },
					data: {
						name,
						parentId,
						sortOrder,
						isActive,
					},
				});

				return res.status(200).json(category);
			} catch (error) {
				return res.status(500).json({ error });
			}
		}

		if (req.method === 'DELETE') {
			try {
				if (req.body.type === 'all') {
					const category = await prisma.category.delete({
						where: { id: Number(id) },
					});
					res.send(category);
					return;
				}

				if (req.body.type === 'move') {
					const { newParentId } = req.body;

					const [updatedCategory, deletedCategoty] = await prisma.$transaction([
						prisma.category.updateMany({
							where: { parentId: Number(id) },
							data: {
								parentId: newParentId,
							},
						}),
						prisma.category.delete({
							where: { id: Number(id) },
						}),
					]);
					console.log('Updated: ', updatedCategory);
					console.log('Deleted: ', deletedCategoty);
					res.json({
						msg: `category has been assigned as a child to a category with id ${newParentId}`,
					});
					return;
				}
			} catch (error) {
				return res.status(500).json({ error });
			}
		}
	}

	if (req.method === 'GET') {
		try {
			const categories = await prisma.category.findMany();
			return res.status(200).json(categories);
		} catch (error) {
			return res.status(500).json({ error });
		}
	}

	if (req.method === 'POST') {
		try {
			const { name, parentId = null, isActive } = req.body;
			if (!name) {
				return res.status(400).send('Specify a name');
			}
			const category = await prisma.category.create({
				data: {
					name,
					parentId,
					isActive,
				},
			});

			return res.status(200).json(category);
		} catch (error) {
			return res.status(500).json({ error });
		}
	}
}
