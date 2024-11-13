import { workflow } from "@novu/framework";
import { z } from 'zod';
import { translationService } from "../lib/i18n";

export const guidelistSentWorkflow = workflow('guidelist_sent', async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('guidelist.sent.in_app.subject', subscriber.locale, {
			userUsername: payload.sender.username
		}),
		body: translationService.translate('guidelist.sent.in_app.body', subscriber.locale, {
			movieTitle: payload.movie.title
		}),
		avatar: payload.sender.avatar || undefined,
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('guidelist.sent.push.subject', subscriber.locale, {
			userUsername: payload.sender.username
		}),
		body: translationService.translate('guidelist.sent.push.body', subscriber.locale, {
			movieTitle: payload.movie.title
		}),
		
	}));
}, {
	payloadSchema: z.object({
		sender: z.object({
			username: z.string().describe('The user who sent the guidelist'),
			avatar: z
				.string()
				.nullable()
				.optional()
				.describe('The avatar of the user who sent the guidelist')
		}),
		movie: z.object({
			title: z.string().describe('The movie that was recommended')
		}),
	})
});

export const guidelistCompletedWorkflow = workflow('guidelist_completed', async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('guidelist.completed.in_app.subject', subscriber.locale, {
			userUsername: payload.receiver.username
		}),
		body: translationService.translate('guidelist.completed.in_app.body', subscriber.locale, {
			movieTitle: payload.movie.title
		}),
		avatar: payload.receiver.avatar || undefined,
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('guidelist.completed.push.subject', subscriber.locale, {
			userUsername: payload.receiver.username
		}),
		body: translationService.translate('guidelist.completed.push.body', subscriber.locale, {
			movieTitle: payload.movie.title
		})
	}));
}, {
	payloadSchema: z.object({
		receiver: z.object({
			username: z.string().describe('The user who received the guidelist'),
			avatar: z
				.string()
				.nullable()
				.optional()
				.describe('The avatar of the user who received the guidelist')
		}),
		movie: z.object({
			title: z.string().describe('The movie that was recommended')
		}),
	})
});

export const guidelistWorkflows = [guidelistSentWorkflow, guidelistCompletedWorkflow];
