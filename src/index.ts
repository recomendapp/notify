import 'dotenv/config';
import App from './app';
import SubscriberController from './api/v1/subscriber/subscriber.controller';
import FollowerController from './api/v1/follower/follower.controller';
import FriendController from './api/v1/friend/friend.controller';
import IndexController from './api/v1';
// Recos
import RecoMovieController from './api/v1/reco/movie/reco.movie.controller';
import RecoTvSeriesController from './api/v1/reco/tv_series/reco.tv_series.controller';

const app = new App([
	new IndexController(),
	new SubscriberController(),
	// Recos
	new RecoMovieController(),
	new RecoTvSeriesController(),
	// Follow
	new FollowerController(),
	new FriendController(),
]);

app.listen();
