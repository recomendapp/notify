import { NextFunction, Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { recoCompletedWorkflow, recoSentWorkflow } from "../../../workflows/reco.workflow";
import { recomend } from "../../../config/recomend";
import { NotificationTypeEnum } from "../../../types/type.db";

export const recoSent = async (req: Request, res: Response, next: NextFunction) => {
	const { record } = req.body;
	const { data, error: errSender } = await supabase
		.from('user_recos')
		.select('receiver:user!user_id(*),sender:user!sender_id(*)')
		.eq('id', record.id)
		.single();
	
	if (errSender || !data) {
		if (errSender)
			throw new Error(errSender.message);
		else
			throw new Error('Record not found');
	}

	const { data: media, error: errMedia } = await supabase
		.from('media')
		.select('*')
		.eq('media_id', record.media_id)
		.setHeader('language', data.receiver.language)
		.single()

	if (errMedia || !media) {
		if (errMedia)
			throw new Error(errMedia.message);
		else
			throw new Error('Media not found');
	}

	const payload = {
		id: record.id,
		type: NotificationTypeEnum.reco_sent,
		sender: {
			username: data.sender?.username!,
			avatar: data.sender?.avatar_url!
		},
		media: {
			title: media.title ?? String(media.media_id),
			url: media.url ?? ''
		}
	};
	const fcmOptions = {
		imageUrl: recomend.iconUrl[100],
		webPush: {
			fcmOptions: {
				link: media.url,
			},
		},
	};
	const apnsOptions = {
		payload: {
			data: payload,
		},
	};

	await recoSentWorkflow.trigger({
		to: record.user_id,
		payload: payload,
		overrides: {
			apns: apnsOptions,
			fcm: fcmOptions,
		},
	})

	res.send('Reco sent');
};

export const recoCompleted = async (req: Request, res: Response, next: NextFunction) => {
	const { record, old_record } = req.body;
	if (record.status !== 'completed') {
		throw new Error('Invalid status');
	}
	if (old_record.status === 'completed') {
		throw new Error('Already completed');
	}

	const { data, error: errReceiver } = await supabase
		.from('user_recos')
		.select('receiver:user!user_id(*),sender:user!sender_id(*)')
		.eq('id', record.id)
		.single();

	if (errReceiver || !data) {
		if (errReceiver)
			throw new Error(errReceiver.message);
		else
			throw new Error('Record not found');
	}

	const { data: media, error: errMedia } = await supabase
		.from('media')
		.select('*')
		.eq('media_id', record.media_id)
		.setHeader('language', data.sender.language)
		.single()
	
	if (errMedia || !media) {
		if (errMedia)
			throw new Error(errMedia.message);
		else
			throw new Error('Media not found');
	}

	const payload = {
		id: record.id,
		type: NotificationTypeEnum.reco_completed,
		receiver: {
			username: data.receiver?.username!,
			avatar: data.receiver?.avatar_url!
		},
		media: {
			title: media.title ?? String(media.media_id),
			url: media.url ?? ''
		}
	};
	const fcmOptions = {
		imageUrl: recomend.iconUrl[100],
		webPush: {
			fcmOptions: {
				link: media.url,
			},
		},
	};
	const apnsOptions = {
		payload: {
			data: payload,
		},
	};

	await recoCompletedWorkflow.trigger({
		to: record.sender_id,
		payload: payload,
		overrides: {
			apns: apnsOptions,
			fcm: fcmOptions,
		},
	})

	res.send('Reco completed');
}