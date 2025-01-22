import { NextFunction, Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { recoCompletedWorkflow, recoSentWorkflow } from "../../../workflows/reco.workflow";
import { PostgrestError } from "@supabase/supabase-js";
import { recomend } from "../../../config/recomend";

export const recoSent = async (req: Request, res: Response, next: NextFunction) => {
	const { record } = req.body;
	const { data, error: errSender } = await supabase
		.from('user_recos')
		.select('receiver:user_id(*),sender:sender_id(*)')
		.eq('id', record.id)
		.single() as { data: any, error: PostgrestError | null };
	
	if (errSender || !data) {
		if (errSender)
			throw new Error(errSender.message);
		else
			throw new Error('Record not found');
	}

	const { data: media, error: errMedia } = await supabase
		.rpc('find_media', { media_id: record.media_id, media_type: record.media_type })
		.setHeader('language', data.receiver.language)
		.returns<any>();

	if (errMedia || !media) {
		if (errMedia)
			throw new Error(errMedia.message);
		else
			throw new Error('Media not found');
	}

	await recoSentWorkflow.trigger({
		to: record.user_id,
		payload: {
			id: record.id,
			sender: {
				username: data.sender?.username!,
				avatar: data.sender?.avatar_url!
			},
			media: {
				title: media.media_type === 'movie'
					? media.title
					: media.media_type === 'tv_serie'
					? media.name
					: media.media_type === 'person'
					? media.name
					: '', // TODO: Add more media types
				url: media.media_type === 'movie'
					? `/film/${media.slug ?? media.id}`
					: media.media_type === 'tv_serie'
					? `/serie/${media.slug ?? media.id}`
					: media.media_type === 'person'
					? `/person/${media.slug ?? media.id}`
					: '', // TODO: Add more media types
			}
		},
		overrides: {
			fcm: {
				imageUrl: recomend.iconUrl[100],
				webPush: {
					fcmOptions: {
						link: `/collection/my-recos#${record.id}`,
					},
			  	},
			},
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
		.select('receiver:user_id(*),sender:sender_id(*)')
		.eq('id', record.id)
		.single() as { data: any, error: PostgrestError | null };

	if (errReceiver || !data) {
		if (errReceiver)
			throw new Error(errReceiver.message);
		else
			throw new Error('Record not found');
	}

	const { data: media, error: errMedia } = await supabase
		.rpc('find_media', { media_id: record.media_id, media_type: record.media_type })
		.setHeader('language', data.receiver.language)
		.returns<any>();
	
	if (errMedia || !media) {
		if (errMedia)
			throw new Error(errMedia.message);
		else
			throw new Error('Media not found');
	}

	await recoCompletedWorkflow.trigger({
		to: record.sender_id,
		payload: {
			id: record.id,
			receiver: {
				username: data.receiver?.username!,
				avatar: data.receiver?.avatar_url!
			},
			media: {
				title: media.media_type === 'movie'
					? media.title
					: media.media_type === 'tv_serie'
					? media.name
					: media.media_type === 'person'
					? media.name
					: '', // TODO: Add more media types
				url: media.media_type === 'movie'
					? `/film/${media.slug ?? media.id}`
					: media.media_type === 'tv_serie'
					? `/serie/${media.slug ?? media.id}`
					: media.media_type === 'person'
					? `/person/${media.slug ?? media.id}`
					: '', // TODO: Add more media types
			}
		},
		overrides: {
			fcm: {
				imageUrl: recomend.iconUrl[100],
				webPush: {
					fcmOptions: {
						link: ``,
						// link: `/film/${record.movie_id}`,
					},
			  	},
			},
		},
	})

	res.send('Reco completed');
}