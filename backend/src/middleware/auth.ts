import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include the auth'd user's ID
interface AuthRequest extends Request {
    userId?: string;
}

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Read auth header, expecting 'Bearer <token>'
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'my_secret_jwt_secret_key';
        const decoded = jwt.verify(token, secret) as { userId: string; };

        // Inject decoded User ID into request object for downstream routes.
        req.userId = decoded.userId;

        // Hand control over to next function/route handler
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}