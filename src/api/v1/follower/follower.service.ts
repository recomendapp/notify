import { NextFunction, Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { followerAcceptedWorkflow, followerCreatedWorkflow, followerRequestWorkflow } from "../../../workflows/follower.workflow";
import { PostgrestError } from "@supabase/supabase-js";
import { recomend } from "../../../config/recomend";

export const followerCreated = async (req: Request, res: Response, next: NextFunction) => {
	const { record } = req.body;
	const { data, error: errFollower } = await supabase
		.from('user_follower')
		.select('sender:user!user_id(*)')
		.eq('id', record.id)
		.single();
	
	if (errFollower || !data) {
		if (errFollower)
			throw new Error(errFollower.message);
		else
			throw new Error('Record not found');
	}

	if (record.is_pending) {
		await followerRequestWorkflow.trigger({
			to: record.followee_id,
			payload: {
				id: record.id,
				sender: {
					username: data.sender.username!,
					avatar: data.sender.avatar_url!
				}
			},
			overrides: {
				fcm: {
					imageUrl: recomend.iconUrl[100],
					webPush: {
						fcmOptions: {
							link: `/@${data.sender.username}`,
						},
				  	},
				},
			},
		});

		res.send('Follower request sent');
	} else {
		await followerCreatedWorkflow.trigger({
			to: record.followee_id,
			payload: {
				id: record.id,
				sender: {
					username: data.sender.username!,
					avatar: data.sender.avatar_url!
				}
			},
			overrides: {
				fcm: {
					imageUrl: recomend.iconUrl[100],
					webPush: {
						fcmOptions: {
							link: `/@${data.sender.username}`,
						},
				  	},
				},
			},
		});

		res.send('Follower notfication sent');
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