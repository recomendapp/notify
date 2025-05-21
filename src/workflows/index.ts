import { followerWorkflows } from "./follower.workflow";
import { friendWorkflows } from "./friend.workflow";
import { recoWorkflows } from "./reco.workflow";

export const workflows = [
	...recoWorkflows,
	...followerWorkflows,
	...friendWorkflows,
]