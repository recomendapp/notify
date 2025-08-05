import { workflow } from "@novu/framework";
import { z } from 'zod';
import { translationService } from "../lib/i18n";
import { NotificationTypeEnum } from "../types/type.db";

export const followerCreatedWorkflow = workflow(NotificationTypeEnum.follower_created, async ({ payload, step, subscriber }) => {
	await step.inApp('notify-in-app', () => ({
		subject: translationService.translate('follower.created.in_app.subject', subscriber.locale),
		body: translationService.translate('follower.created.in_app.body', subscriber.locale, {
			userUsername: payload.sender.username,
		}),
		avatar: payload.sender.avatar || undefined,
		redirect: {
			url: `/@${payload.sender.username}`,
		}
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('follower.created.push.subject', subscriber.locale),
		body: translationService.translate('follower.created.push.body', subscriber.locale, {
			userUsername: payload.sender.username,
		}),
	}));
}, {
	tags: ['follower'],
	payloadSchema: z.object({
		id: z.number().int().describe('The ID of the follower record'),
		type: z.literal(NotificationTypeEnum.follower_created).describe('Type of notification'),
		sender: z.object({
			username: z.string().describe('The user who followed'),
			avatar: z
				.string()
				.nullable()
				.optional()
				.describe('The avatar of the user who followed')
		})
	})
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
			label: translationService.translate('follower.request.in_app.primary_action', subscriber.locale),
		},
		secondaryAction: {
			label: translationService.translate('follower.request.in_app.secondary_action', subscriber.locale),
		},
		data: {
			primaryAction: {
				key: 'follower_request_accept',
				id: payload.id,
			},
			secondaryAction: {
				key: 'follower_request_decline',
				id: payload.id,
			},
		}
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('follower.request.push.subject', subscriber.locale),
		body: translationService.translate('follower.request.push.body', subscriber.locale, {
			userUsername: payload.sender.username,
		}),
	}));
}, {
	tags: ['follower'],
	payloadSchema: z.object({
		id: z.number().int().describe('The ID of the follower record'),
		type: z.literal(NotificationTypeEnum.follower_request).describe('Type of notification'),
		sender: z.object({
			username: z.string().describe('The user who sent the follower request'),
			avatar: z
				.string()
				.nullable()
				.optional()
				.describe('The avatar of the user who sent the follower request')
		})
	})
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
		}
	}));

	await step.push('notify-push', () => ({
		subject: translationService.translate('follower.accepted.push.subject', subscriber.locale),
		body: translationService.translate('follower.accepted.push.body', subscriber.locale, {
			userUsername: payload.sender.username,
		}),
	}));
}, {
	tags: ['follower'],
	payloadSchema: z.object({
		id: z.number().int().describe('The ID of the follower record'),
		type: z.literal(NotificationTypeEnum.follower_accepted).describe('Type of notification'),
		sender: z.object({
			username: z.string().describe('The user who accepted the follower request'),
			avatar: z
				.string()
				.nullable()
				.optional()
				.describe('The avatar of the user who accepted the follower request')
		})
	})
});

export const followerWorkflows = [followerCreatedWorkflow, followerRequestWorkflow, followerAcceptedWorkflow];