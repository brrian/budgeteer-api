import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Context } from '../..';
import { enviornment as env } from '../../environment';
import db from '../../models';
import { UserInstance } from '../../models/User';
import { MutateCreateUser, MutateLogin } from './typeDef';

export default {
  Query: {
    async user(_: any, args: any, { userId }: Context) {
      return db.User.findByPk(userId);
    },
  },

  Mutation: {
    async login(_: any, { email, password }: MutateLogin) {
      const user = await db.User.findOne({ where: { email } });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      return jwt.sign(
        {
          userId: user.id,
          groupId: user.groupId,
        },
        env.jwtSecret,
        {
          expiresIn: '5y',
        }
      );
    },

    async createUser(
      _: any,
      { name, email, password, group }: MutateCreateUser
    ) {
      const userGroup = await db.Group.create({ name: group });

      return await db.User.create({
        groupId: userGroup.id!,
        name,
        email,
        password: await bcrypt.hash(password, 10),
      });
    },
  },

  User: {
    async group(user: UserInstance) {
      return await user.getGroup();
    },
  },
};
