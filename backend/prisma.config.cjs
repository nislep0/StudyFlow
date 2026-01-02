const databaseUrl = process.env.DATABASE_URL ||
    'postgresql://studyflow:studyflow@db:5432/studyflow?schema=public';

module.exports = {
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'tsx prisma/seed.ts',
    },
    datasource: { url: databaseUrl },
};