import { NextFunction, Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { recomend } from "../../../config/recomend";
import { friendCreatedWorkflow } from "../../../workflows/friend.workflow";

export const friendCreated = async (req: Request, res: Response, next: NextFunction) => {
	const { record } = req.body;
	const { data, error: errFriend } = await supabase
		.from('user_friend')
		.select('friend:friend_id(*)')
		.eq('id', record.id)
		.single() as { data: any, error: PostgrestError | null };
	
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
			friend: {
				username: data.friend?.username!,
				avatar: data.friend?.avatar_url!
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
