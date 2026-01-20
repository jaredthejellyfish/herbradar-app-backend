import { Hono } from 'hono';

import type { AuthType } from '../../lib/auth';

import auth from './routes/auth';

const app = new Hono<{ Variables: AuthType }>({
  strict: true,
});

app.use('*', async (c, next) => {
  await next();
  const method = c.req.method;
  const path = c.req.path;
  const status = c.res.status;
  const time = new Date().toISOString();
  const color = {
    reset: '\x1b[0m',
    gray: '\x1b[90m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    magenta: '\x1b[35m',
    white: '\x1b[37m',
  };
  const methodColor =
    method === 'GET'
      ? color.blue
      : method === 'POST'
        ? color.cyan
        : method === 'PUT'
          ? color.yellow
          : method === 'PATCH'
            ? color.magenta
            : method === 'DELETE'
              ? color.red
              : color.white;
  const statusColor = status >= 400 ? color.red : color.green;
  console.log(
    `${color.gray}${time}${color.reset} -- (${methodColor}${method}${color.reset}) ${statusColor}${status}${color.reset} - ${path}`
  );
});

const routes = [auth] as const;

routes.forEach((route) => {
  app.route('/api', route);
});

export default app;
