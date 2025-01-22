import { followerWorkflows } from "./follower.workflow";
import { friendWorkflows } from "./friend.workflow";
import { guidelistWorkflows } from "./guidelist.workflow";
import { recoWorkflows } from "./reco.workflow";

export const workflows = [
	...guidelistWorkflows,
	...recoWorkflows,
	...followerWorkflows,
	...friendWorkflows,
]