import {
	cleanEnv, str,
} from 'envalid';
  
function validateEnv() {
	cleanEnv(process.env, {
		API_KEY: str(),
		NOVU_SECRET_KEY: str(),
		SUPABASE_URL: str(),
		SUPABASE_SERVICE_ROLE_KEY: str(),
		NOVU_PROVIDER_ID_FCM: str(),
		NOVU_PROVIDER_ID_EXPO: str(),
		NOVU_PROVIDER_ID_APNS: str(),
	});
}
  
export default validateEnv;