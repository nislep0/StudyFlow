import type { Request, Response, NextFunction } from 'express';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function mockUser(req: Request, res: Response, next: NextFunction) {
  const userId = req.header('x-user-id');
  if (!userId) return res.status(401).json({ message: 'Missing x-user-id header' });

  if (!UUID_RE.test(userId)) {
    return res.status(400).json({ message: `Invalid x-user-id '${userId}' (must be UUID)` });
  }

  req.userId = userId;
  next();
}
