import { Hono } from 'hono';
import { adminMiddleware } from '../middlewares/admin';
import { userRoutes } from './user.routes';
import { invitationRoutes } from './invitation.routes';
import { categoryRoutes } from './category.routes';
import { templateRoutes } from './template.routes';
import { draftRoutes } from './draft.routes';
import { analyticsRoutes } from './analytics.routes';
import { settingsRoutes } from './settings.routes';
import { adminRoutes } from './admin.routes';
import { featureFlagsRoutes } from './feature-flags.routes';

const apiRouter = new Hono();

apiRouter.route('/users', userRoutes);
apiRouter.route('/invitations', invitationRoutes);
apiRouter.route('/categories', categoryRoutes);
apiRouter.route('/templates', templateRoutes);
apiRouter.route('/drafts', draftRoutes);
apiRouter.route('/analytics', analyticsRoutes);
apiRouter.route('/settings', settingsRoutes);

const adminSubRouter = new Hono();
adminSubRouter.use('*', adminMiddleware);
adminSubRouter.route('/', adminRoutes);

const flagsSubRouter = new Hono();
flagsSubRouter.use('*', adminMiddleware);
flagsSubRouter.route('/', featureFlagsRoutes);

apiRouter.route('/admin', adminSubRouter);
apiRouter.route('/feature-flags', flagsSubRouter);

export { apiRouter };
