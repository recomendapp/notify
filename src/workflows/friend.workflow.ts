import { workflow } from "@novu/framework";
import { z } from 'zod';
import { translationService } from "../lib/i18n";

export const friendCreatedWorkflow = workflow('friend_created', async ({ payload, step, subscriber }) => {
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
	payloadSchema: z.object({
		id: z.number().int().describe('The ID of the friend record'),
		friend: z.object({
			username: z.string().describe('The user who you are now friends with'),
			avatar: z
				.string()
				.nullable()
				.optional()
				.describe('The avatar of the user who you are now friends with')
		})
	})
});

export const friendWorkflows = [friendCreatedWorkflow];