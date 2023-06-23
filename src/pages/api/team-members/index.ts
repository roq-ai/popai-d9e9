import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { teamMemberValidationSchema } from 'validationSchema/team-members';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTeamMembers();
    case 'POST':
      return createTeamMember();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTeamMembers() {
    const data = await prisma.team_member
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'team_member'));
    return res.status(200).json(data);
  }

  async function createTeamMember() {
    await teamMemberValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.ritual_participant?.length > 0) {
      const create_ritual_participant = body.ritual_participant;
      body.ritual_participant = {
        create: create_ritual_participant,
      };
    } else {
      delete body.ritual_participant;
    }
    const data = await prisma.team_member.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
