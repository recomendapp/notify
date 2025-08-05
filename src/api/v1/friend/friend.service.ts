import { NextFunction, Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { recomend } from "../../../config/recomend";
import { friendCreatedWorkflow } from "../../../workflows/friend.workflow";
import { NotificationTypeEnum } from "../../../types/type.db";

export const friendCreated = async (req: Request, res: Response, next: NextFunction) => {
	const { record } = req.body;
	const { data, error: errFriend } = await supabase
		.from('user_friend')
		.select('friend:user!friend_id(*)')
		.eq('id', record.id)
		.single();
	
	if (errFriend || !data) {
		if (errFriend)
			throw new Error(errFriend.message);
		else
			throw new Error('Record not found');
	}

	await friendCreatedWorkflow.trigger({
		to: record.user_id,
		payload: {
			id: record.id,
			type: NotificationTypeEnum.friend_created,
			friend: {
				username: data.friend.username!,
				avatar: data.friend.avatar_url!
			}
		},
		overrides: {
			fcm: {
				imageUrl: recomend.iconUrl[100],
				webPush: {
					fcmOptions: {
						link: `/@${data.friend.username}`,
					},
				},
			},
		},
	});

	res.send('Friend notification sent');
};
