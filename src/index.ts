import 'dotenv/config';
import App from './app';
import SubscriberController from './api/v1/subscriber/subscriber.controller';
import GuidelistController from './api/v1/guidelist/guidelist.controller';
import FollowerController from './api/v1/follower/follower.controller';

const app = new App([
	new SubscriberController(),
	new GuidelistController(),
	new FollowerController(),
]);

app.listen();
