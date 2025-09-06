import { NextFunction, Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { followerAcceptedWorkflow, followerCreatedWorkflow, followerRequestWorkflow } from "../../../workflows/follower.workflow";
import { recomend } from "../../../config/recomend";
import { NotificationTypeEnum } from "@recomendapp/types/dist";

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

	const payload = {
		id: record.id,
		sender: {
			id: data.sender.id,
			username: data.sender.username,
			avatar: data.sender.avatar_url
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
	const apnsOptions = {
		payload: {
			data: payload,
		},
	};

	if (record.is_pending) {
		await followerRequestWorkflow.trigger({
			to: record.followee_id,
			payload: {
				...payload,
				type: NotificationTypeEnum.follower_request,
			},
			overrides: {
				apns: apnsOptions,
				fcm: fcmOptions,
			},
		});

		res.send('Follower request sent');
	} else {
		await followerCreatedWorkflow.trigger({
			to: record.followee_id,
			payload: {
				...payload,
				type: NotificationTypeEnum.follower_created,
			},
			overrides: {
				apns: apnsOptions,
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

	const payload = {
		id: record.id,
		type: NotificationTypeEnum.follower_accepted,
		sender: {
			id: data.followee.id,
			username: data.followee.username,
			avatar: data.followee.avatar_url
		}
	};

	const fcmOptions = {
		imageUrl: recomend.iconUrl[100],
		webPush: {
			fcmOptions: {
				link: `/@${data.followee.username}`,
			},
		},
	};
	const apnsOptions = {
		payload: {
			data: payload,
		},
	};

	await followerAcceptedWorkflow.trigger({
		to: record.user_id,
		payload: payload,
		overrides: {
			apns: apnsOptions,
			fcm: fcmOptions,
		},
	});

	res.send('Follower accepted');
}