import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { ritualValidationSchema } from 'validationSchema/rituals';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.ritual
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRitualById();
    case 'PUT':
      return updateRitualById();
    case 'DELETE':
      return deleteRitualById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRitualById() {
    const data = await prisma.ritual.findFirst(convertQueryToPrismaUtil(req.query, 'ritual'));
    return res.status(200).json(data);
  }

  async function updateRitualById() {
    await ritualValidationSchema.validate(req.body);
    const data = await prisma.ritual.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRitualById() {
    const data = await prisma.ritual.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
