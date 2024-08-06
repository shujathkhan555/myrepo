import { Type } from '@fastify/type-provider-typebox';
import { CODE } from '../utils/exam';

export const examEnvironmentPostScreenshot = {
  response: {
    200: Type.Object({
      code: Type.Enum(CODE)
    })
  }
};
