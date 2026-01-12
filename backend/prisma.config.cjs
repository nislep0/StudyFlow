require('dotenv/config');

module.exports = {
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
  },

  datasource: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://studyflow:studyflow@db:5432/studyflow?schema=public',
  },
};
