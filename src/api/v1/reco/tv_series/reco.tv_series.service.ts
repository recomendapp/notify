import { NextFunction, Request, Response } from "express";
import { supabase } from "../../../../lib/supabase";
import { recoCompletedWorkflow, recoSentWorkflow } from "../../../../workflows/reco.workflow";
import { recomend } from "../../../../config/recomend";
import { NotificationTypeEnum } from "../../../../types/type.db";

export const recoTvSeriesSent = async (req: Request, res: Response, next: NextFunction) => {
	const { record } = req.body;
	const { data, error: errSender } = await supabase
		.from('user_recos_tv_series')
		.select('receiver:user!user_id(*),sender:user!sender_id(*)')
		.eq('id', record.id)
		.single();
	
	if (errSender || !data) {
		if (errSender)
			throw new Error(errSender.message);
		else
			throw new Error('Record not found');
	}

	const { data: tvSeries, error: errTvSeries } = await supabase
		.from('media_tv_series')
		.select('*')
		.eq('id', record.tv_series_id)
		.setHeader('language', data.receiver.language)
		.single()

	if (errTvSeries || !tvSeries) {
		if (errTvSeries)
			throw new Error(errTvSeries.message);
		else
			throw new Error('TV Series not found');
	}

	const payload = {
		id: record.id,
		type: NotificationTypeEnum.reco_sent,
		sender: {
			username: data.sender?.username!,
			avatar: data.sender?.avatar_url!
		},
		media: {
			id: tvSeries.id,
			type: 'tv_series',
			title: tvSeries.name ?? String(tvSeries.id),
			url: tvSeries.url ?? ''
		}
	};
	const fcmOptions = {
		imageUrl: recomend.iconUrl[100],
		webPush: {
			fcmOptions: {
				link: tvSeries.url,
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

export const recoTvSeriesCompleted = async (req: Request, res: Response, next: NextFunction) => {
	const { record, old_record } = req.body;
	if (record.status !== 'completed') {
		throw new Error('Invalid status');
	}
	if (old_record.status === 'completed') {
		throw new Error('Already completed');
	}

	const { data, error: errReceiver } = await supabase
		.from('user_recos_tv_series')
		.select('receiver:user!user_id(*),sender:user!sender_id(*)')
		.eq('id', record.id)
		.single();

	if (errReceiver || !data) {
		if (errReceiver)
			throw new Error(errReceiver.message);
		else
			throw new Error('Record not found');
	}

	const { data: tvSeries, error: errTvSeries } = await supabase
		.from('media_tv_series')
		.select('*')
		.eq('id', record.tv_series_id)
		.setHeader('language', data.sender.language)
		.single()

	if (errTvSeries || !tvSeries) {
		if (errTvSeries)
			throw new Error(errTvSeries.message);
		else
			throw new Error('TV Series not found');
	}

	const payload = {
		id: record.id,
		type: NotificationTypeEnum.reco_completed,
		receiver: {
			username: data.receiver?.username!,
			avatar: data.receiver?.avatar_url!
		},
		media: {
			id: tvSeries.id,
			type: 'tv_series',
			title: tvSeries.name ?? String(tvSeries.id),
			url: tvSeries.url ?? ''
		}
	};
	const fcmOptions = {
		imageUrl: recomend.iconUrl[100],
		webPush: {
			fcmOptions: {
				link: tvSeries.url,
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
};