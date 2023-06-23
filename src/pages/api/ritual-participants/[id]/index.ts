import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { ritualParticipantValidationSchema } from 'validationSchema/ritual-participants';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.ritual_participant
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRitualParticipantById();
    case 'PUT':
      return updateRitualParticipantById();
    case 'DELETE':
      return deleteRitualParticipantById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRitualParticipantById() {
    const data = await prisma.ritual_participant.findFirst(convertQueryToPrismaUtil(req.query, 'ritual_participant'));
    return res.status(200).json(data);
  }

  async function updateRitualParticipantById() {
    await ritualParticipantValidationSchema.validate(req.body);
    const data = await prisma.ritual_participant.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRitualParticipantById() {
    const data = await prisma.ritual_participant.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
