import { workflow } from "@novu/framework";
import { z } from 'zod';
import { translationService } from "../lib/i18n";
import { NotificationTypeEnum } from "@recomendapp/types/dist";
import { friendCreatedSchema } from "@recomendapp/types/dist/notifications/schemas/friend-created.schema";

export const friendCreatedWorkflow = workflow(NotificationTypeEnum.friend_created, async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('friend.created.in_app.subject', subscriber.locale),
		body: translationService.translate('friend.created.in_app.body', subscriber.locale, {
			userUsername: payload.friend.username,
		}),
		avatar: payload.friend.avatar || undefined,
		redirect: {
			url: `/@${payload.friend.username}`,
		}
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('friend.created.push.subject', subscriber.locale),
		body: translationService.translate('friend.created.push.body', subscriber.locale, {
			userUsername: payload.friend.username,
		}),
	}));
}, {
	tags: ['friend'],
	payloadSchema: friendCreatedSchema
});

export const friendWorkflows = [friendCreatedWorkflow];