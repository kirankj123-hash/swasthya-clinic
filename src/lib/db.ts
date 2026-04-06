import postgres from 'postgres';

declare global {
  var __CPIMS_SQL: postgres.Sql | undefined;
}

function getConnectionString() {
  return process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || null;
}

export function getSql() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error('CPIMS database connection is not configured.');
  }

  if (!globalThis.__CPIMS_SQL) {
    globalThis.__CPIMS_SQL = postgres(connectionString, {
      prepare: false,
      max: 5,
      idle_timeout: 20,
      connect_timeout: 20,
    });
  }

  return globalThis.__CPIMS_SQL;
}
