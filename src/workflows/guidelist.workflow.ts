import { workflow } from "@novu/framework";
import i18next from "i18next";
import { z } from 'zod';

export const guidelistSentWorkflow = workflow('guidelist_sent', async ({ payload, step, subscriber }) => {
	const inAppResponse = await step.inApp('notify', (controls) => ({
		subject: i18next.t('guidelist.sent.subject', { lng: subscriber.locale, userUsername: payload.sender.username }),
		body: i18next.t('guidelist.sent.body', { lng: subscriber.locale, movieTitle: payload.movie.title }),
		avatar: payload.sender.avatar,
	}));
}, {
	payloadSchema: z.object({
		sender: z.object({
			username: z.string().describe('The user who sent the guidelist'),
			avatar: z.string().describe('The avatar of the user who sent the guidelist')
		}),
		movie: z.object({
			title: z.string().describe('The movie that was recommended')
		}),
	})
});

export const guidelistCompletedWorkflow = workflow('guidelist_completed', async ({ payload, step, subscriber }) => {
	const inAppResponse = await step.inApp('notify', () => ({
		subject: i18next.t('guidelist.completed.subject', { lng: subscriber.locale, userUsername: payload.receiver.username }),
		body: i18next.t('guidelist.completed.body', { lng: subscriber.locale, movieTitle: payload.movie.title }),
		avatar: payload.receiver.avatar,
	}));
}, {
	payloadSchema: z.object({
		receiver: z.object({
			username: z.string().describe('The user who received the guidelist'),
			avatar: z.string().describe('The avatar of the user who received the guidelist')
		}),
		movie: z.object({
			title: z.string().describe('The movie that was recommended')
		}),
	})
});
