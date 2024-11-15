import { workflow } from "@novu/framework";
import { z } from 'zod';
import { translationService } from "../lib/i18n";

export const guidelistSentWorkflow = workflow('guidelist_sent', async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('guidelist.sent.in_app.subject', subscriber.locale),
		body: translationService.translate('guidelist.sent.in_app.body', subscriber.locale, {
			userUsername: payload.sender.username,
			movieTitle: payload.movie.title,
			movieSlug: payload.movie.slug
		}),
		avatar: payload.sender.avatar || undefined,
		redirect: {
			url: `/collection/guidelist#${payload.id}`
		}
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('guidelist.sent.push.subject', subscriber.locale),
		body: translationService.translate('guidelist.sent.push.body', subscriber.locale, {
			userUsername: payload.sender.username,
			movieTitle: payload.movie.title
		}),
	}));
}, {
	tags: ['guidelist'],
	payloadSchema: z.object({
		id: z.number().int().describe('The ID of the guidelist'),
		sender: z.object({
			username: z.string().describe('The user who sent the guidelist'),
			avatar: z
				.string()
				.nullable()
				.optional()
				.describe('The avatar of the user who sent the guidelist')
		}),
		movie: z.object({
			title: z.string().describe('The movie that was recommended'),
			slug: z.string().describe('The slug of the movie that was recommended')
		}),
	})
});

export const guidelistCompletedWorkflow = workflow('guidelist_completed', async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('guidelist.completed.in_app.subject', subscriber.locale),
		body: translationService.translate('guidelist.completed.in_app.body', subscriber.locale, {
			userUsername: payload.receiver.username,
			movieTitle: payload.movie.title,
			movieSlug: payload.movie.slug
		}),
		avatar: payload.receiver.avatar || undefined,
		redirect: {
			url: `/@${payload.receiver.username}`,
		}
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('guidelist.completed.push.subject', subscriber.locale),
		body: translationService.translate('guidelist.completed.push.body', subscriber.locale, {
			userUsername: payload.receiver.username,
			movieTitle: payload.movie.title
		})
	}));
}, {
	tags: ['guidelist'],
	payloadSchema: z.object({
		id: z.number().int().describe('The ID of the guidelist'),
		receiver: z.object({
			username: z.string().describe('The user who received the guidelist'),
			avatar: z
				.string()
				.nullable()
				.optional()
				.describe('The avatar of the user who received the guidelist')
		}),
		movie: z.object({
			title: z.string().describe('The movie that was recommended'),
			slug: z.string().describe('The slug of the movie that was recommended')
		}),
	})
});

export const guidelistWorkflows = [guidelistSentWorkflow, guidelistCompletedWorkflow];
