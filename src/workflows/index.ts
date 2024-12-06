import { followerWorkflows } from "./follower.workflow";
import { guidelistWorkflows } from "./guidelist.workflow";

export const workflows = [
	...guidelistWorkflows,
	...followerWorkflows,
]