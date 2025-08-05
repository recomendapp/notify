import { workflow } from "@novu/framework";
import { z } from 'zod';
import { translationService } from "../lib/i18n";
import { NotificationTypeEnum } from "../types/type.db";

export const recoSentWorkflow = workflow(NotificationTypeEnum.reco_sent, async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('reco.sent.in_app.subject', subscriber.locale),
		body: translationService.translate('reco.sent.in_app.body', subscriber.locale, {
			userUsername: payload.sender.username,
			mediaTitle: payload.media.title,
			mediaUrl: payload.media.url
		}),
		avatar: payload.sender.avatar || undefined,
		redirect: {
			url: `/collection/my-recos#${payload.id}`
		}
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('reco.sent.push.subject', subscriber.locale),
		body: translationService.translate('reco.sent.push.body', subscriber.locale, {
			userUsername: payload.sender.username,
			mediaTitle: payload.media.title
		}),
	}));
}, {
	tags: ['reco'],
	payloadSchema: z.object({
		id: z.number().int().describe('The ID of the reco'),
		type: z.literal(NotificationTypeEnum.reco_sent).describe('Type of notification'),
		sender: z.object({
			username: z.string().describe('The user who sent the reco'),
			avatar: z
				.string()
				.nullable()
				.optional()
				.describe('The avatar of the user who sent the reco')
		}),
		media: z.object({
			title: z.string().describe('The media that was recommended'),
			url: z.string().describe('The url of the media that was recommended')
		}),
	})
});

export const recoCompletedWorkflow = workflow(NotificationTypeEnum.reco_completed, async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('reco.completed.in_app.subject', subscriber.locale),
		body: translationService.translate('reco.completed.in_app.body', subscriber.locale, {
			userUsername: payload.receiver.username,
			mediaTitle: payload.media.title,
			mediaUrl: payload.media.url
		}),
		avatar: payload.receiver.avatar || undefined,
		redirect: {
			url: `/@${payload.receiver.username}`,
		}
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('reco.completed.push.subject', subscriber.locale),
		body: translationService.translate('reco.completed.push.body', subscriber.locale, {
			userUsername: payload.receiver.username,
			mediaTitle: payload.media.title
		})
	}));
}, {
	tags: ['reco'],
	payloadSchema: z.object({
		id: z.number().int().describe('The ID of the reco'),
		type: z.literal(NotificationTypeEnum.reco_completed).describe('Type of notification'),
		receiver: z.object({
			username: z.string().describe('The user who received the reco'),
			avatar: z
				.string()
				.nullable()
				.optional()
				.describe('The avatar of the user who received the reco')
		}),
		media: z.object({
			title: z.string().describe('The media that was recommended'),
			url: z.string().describe('The url of the media that was recommended')
		}),
	})
});

export const recoWorkflows = [recoSentWorkflow, recoCompletedWorkflow];
