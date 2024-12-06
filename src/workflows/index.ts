import { followerWorkflows } from "./follower.workflow";
import { friendWorkflows } from "./friend.workflow";
import { guidelistWorkflows } from "./guidelist.workflow";

export const workflows = [
	...guidelistWorkflows,
	...followerWorkflows,
	...friendWorkflows,
]