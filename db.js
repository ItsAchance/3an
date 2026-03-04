import { Pool } from 'pg';

export const pool = new Pool ({
    host: 'trean-postgre-db',
    port: 5432,
    user: 'postgre',
    password: 'postgre',
    database: 'trean'
});
