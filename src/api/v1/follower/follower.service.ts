import { NextFunction, Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { followerAcceptedWorkflow, followerCreatedWorkflow, followerRequestWorkflow } from "../../../workflows/follower.workflow";
import { recomend } from "../../../config/recomend";
import { NotificationTypeEnum } from "../../../types/type.db";

export const followerCreated = async (req: Request, res: Response, next: NextFunction) => {
	const { record } = req.body;
	const { data, error: errFollower } = await supabase
		.from('user_follower')
		.select('sender:user!user_id(*)')
		.eq('id', record.id)
		.single();

	if (errFollower || !data) {
		throw new Error(errFollower?.message ?? 'Record not found');
	}

	const commonPayload = {
		id: record.id,
		type: NotificationTypeEnum.follower_created,
		sender: {
			username: data.sender.username!,
			avatar: data.sender.avatar_url!
		}
	};

	const fcmOptions = {
		imageUrl: recomend.iconUrl[100],
		webPush: {
			fcmOptions: {
				link: `/@${data.sender.username}`,
			},
		},
	};

	if (record.is_pending) {
		await followerRequestWorkflow.trigger({
			to: record.followee_id,
			payload: {
				...commonPayload,
				type: NotificationTypeEnum.follower_request,
			},
			overrides: {
				fcm: fcmOptions,
			},
		});

		res.send('Follower request sent');
	} else {
		await followerCreatedWorkflow.trigger({
			to: record.followee_id,
			payload: commonPayload,
			overrides: {
				fcm: fcmOptions,
			},
		});

		res.send('Follower notification sent');
	}
};

export const followerAccepted = async (req: Request, res: Response, next: NextFunction) => {
	const { record, old_record } = req.body;
	if (!(old_record.is_pending && !record.is_pending)) {
		throw new Error('Notify only when follower request is accepted');
	}
	const { data, error: errFollower } = await supabase
		.from('user_follower')
		.select('followee:user!followee_id(*)')
		.eq('id', record.id)
		.single();
	
	if (errFollower || !data) {
		if (errFollower)
			throw new Error(errFollower.message);
		else
			throw new Error('Record not found');
	}

	await followerAcceptedWorkflow.trigger({
		to: record.user_id,
		payload: {
			id: record.id,
			type: NotificationTypeEnum.follower_accepted,
			sender: {
				username: data.followee.username!,
				avatar: data.followee.avatar_url!
			}
		},
		overrides: {
			fcm: {
				imageUrl: recomend.iconUrl[100],
				webPush: {
					fcmOptions: {
						link: `/@${data.followee.username}`,
					},
			  	},
			},
		},
	});

	res.send('Follower accepted');
}