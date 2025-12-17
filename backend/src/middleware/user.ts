import type { Request, Response, NextFunction } from 'express';

export function mockUser(req: Request, res: Response, next: NextFunction) {
  const userId = req.header('x-user-id');
  if (!userId) {
    return res.status(401).json({ message: 'Missing x-user-id header' });
  }
  req.userId = userId;
  next();
}
