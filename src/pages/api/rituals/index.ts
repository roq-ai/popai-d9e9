import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { ritualValidationSchema } from 'validationSchema/rituals';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getRituals();
    case 'POST':
      return createRitual();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRituals() {
    const data = await prisma.ritual
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'ritual'));
    return res.status(200).json(data);
  }

  async function createRitual() {
    await ritualValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.ritual_participant?.length > 0) {
      const create_ritual_participant = body.ritual_participant;
      body.ritual_participant = {
        create: create_ritual_participant,
      };
    } else {
      delete body.ritual_participant;
    }
    const data = await prisma.ritual.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
