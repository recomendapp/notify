import { workflow } from "@novu/framework";
import { translationService } from "../lib/i18n";
import { FollowerEnum, NotificationTypeEnum } from "@recomendapp/types/dist";
import { followerCreatedSchema } from "@recomendapp/types/dist/notifications/schemas/follower-created.schema";
import { followerRequestSchema } from "@recomendapp/types/dist/notifications/schemas/follower-request.schema";
import { followerAcceptedSchema } from "@recomendapp/types/dist/notifications/schemas/follower-accepted.schema";

export const followerCreatedWorkflow = workflow(NotificationTypeEnum.follower_created, async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('follower.created.in_app.subject', subscriber.locale),
		body: translationService.translate('follower.created.in_app.body', subscriber.locale, {
			userUsername: payload.sender.username,
		}),
		avatar: payload.sender.avatar || undefined,
		redirect: {
			url: `/@${payload.sender.username}`,
		},
		data: payload
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('follower.created.push.subject', subscriber.locale),
		body: translationService.translate('follower.created.push.body', subscriber.locale, {
			userUsername: payload.sender.username,
		}),
	}));
}, {
	tags: ['follower'],
	payloadSchema: followerCreatedSchema
});

export const followerRequestWorkflow = workflow(NotificationTypeEnum.follower_request, async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('follower.request.in_app.subject', subscriber.locale),
		body: translationService.translate('follower.request.in_app.body', subscriber.locale, {
			userUsername: payload.sender.username,
		}),
		avatar: payload.sender.avatar || undefined,
		redirect: {
			url: `/@${payload.sender.username}`,
		},
		primaryAction: {
			key: FollowerEnum.actions.followerRequestAccept,
			id: payload.id,
			label: translationService.translate('follower.request.in_app.primary_action', subscriber.locale),
		},
		secondaryAction: {
			key: FollowerEnum.actions.followerRequestDecline,
			id: payload.id,
			label: translationService.translate('follower.request.in_app.secondary_action', subscriber.locale),
		},
		data: payload
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('follower.request.push.subject', subscriber.locale),
		body: translationService.translate('follower.request.push.body', subscriber.locale, {
			userUsername: payload.sender.username,
		}),
	}));
}, {
	tags: ['follower'],
	payloadSchema: followerRequestSchema
});

export const followerAcceptedWorkflow = workflow(NotificationTypeEnum.follower_accepted, async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('follower.accepted.in_app.subject', subscriber.locale),
		body: translationService.translate('follower.accepted.in_app.body', subscriber.locale, {
			userUsername: payload.sender.username,
		}),
		avatar: payload.sender.avatar || undefined,
		redirect: {
			url: `/@${payload.sender.username}`,
		},
		data: payload
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('follower.accepted.push.subject', subscriber.locale),
		body: translationService.translate('follower.accepted.push.body', subscriber.locale, {
			userUsername: payload.sender.username,
		}),
	}));
}, {
	tags: ['follower'],
	payloadSchema: followerAcceptedSchema
});

export const followerWorkflows = [followerCreatedWorkflow, followerRequestWorkflow, followerAcceptedWorkflow];