import { workflow } from "@novu/framework";
import { translationService } from "../lib/i18n";
import { NotificationTypeEnum } from "../types/type.db";
import { recoSentSchema } from "../types/notifications/schemas/reco-sent.schema";
import { recoCompletedSchema } from "../types/notifications/schemas/reco-completed.schema";

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
	payloadSchema: recoSentSchema
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
	payloadSchema: recoCompletedSchema
});

export const recoWorkflows = [recoSentWorkflow, recoCompletedWorkflow];
