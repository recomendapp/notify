import {
	cleanEnv, str,
} from 'envalid';
  
function validateEnv() {
	cleanEnv(process.env, {
		API_KEY: str(),
		NOVU_SECRET_KEY: str(),
		SUPABASE_URL: str(),
		SUPABASE_KEY: str(),
		NOVU_PROVIDER_ID_FCM: str(),
	});
}
  
export default validateEnv;