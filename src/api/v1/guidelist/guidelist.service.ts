import { NextFunction, Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { guidelistCompletedWorkflow, guidelistSentWorkflow } from "../../../workflows/guidelist.workflow";
import { PostgrestError } from "@supabase/supabase-js";

export const guidelistSent = async (req: Request, res: Response, next: NextFunction) => {
	const { record } = req.body;
	const { data, error: errSender } = await supabase
		.from('user_movie_guidelist')
		.select('receiver:user_id(*),sender:sender_id(*)')
		.eq('id', record.id)
		.single() as { data: any, error: PostgrestError | null };
	
	if (errSender || !data) {
		if (errSender)
			throw new Error(errSender.message);
		else
			throw new Error('Record not found');
	}

	const { data: movie, error: errMovie } = await supabase
		.from('movie')
		.select('title')
		.eq('id', record.movie_id)
		.setHeader('language', data.receiver.language)
		.single();

	if (errMovie || !movie) {
		if (errMovie)
			throw new Error(errMovie.message);
		else
			throw new Error('Movie not found');
	}

	await guidelistSentWorkflow.trigger({
		to: record.user_id,
		payload: {
			sender: {
				username: data.sender?.username!,
				avatar: data.sender?.avatar_url!
			},
			movie: {
				title: movie?.title!
			}
		}
	})

	res.send('Guidelist sent');
};

export const guidelistCompleted = async (req: Request, res: Response, next: NextFunction) => {
	const { record, old_record } = req.body;
	if (record.status !== 'completed') {
		throw new Error('Invalid status');
	}
	if (old_record.status === 'completed') {
		throw new Error('Already completed');
	}

	const { data, error: errReceiver } = await supabase
		.from('user_movie_guidelist')
		.select('receiver:user_id(*),sender:sender_id(*)')
		.eq('id', record.id)
		.single() as { data: any, error: PostgrestError | null };

	if (errReceiver || !data) {
		if (errReceiver)
			throw new Error(errReceiver.message);
		else
			throw new Error('Record not found');
	}

	const { data: movie, error: errMovie } = await supabase
		.from('movie')
		.select('title')
		.eq('id', record.movie_id)
		.setHeader('language', data.sender.language)
		.single();
	
	if (errMovie || !movie) {
		if (errMovie)
			throw new Error(errMovie.message);
		else
			throw new Error('Movie not found');
	}

	await guidelistCompletedWorkflow.trigger({
		to: record.sender_id,
		payload: {
			receiver: {
				username: data.receiver?.username!,
				avatar: data.receiver?.avatar_url!
			},
			movie: {
				title: movie?.title!
			}
		}
	})

	res.send('Guidelist completed');
}