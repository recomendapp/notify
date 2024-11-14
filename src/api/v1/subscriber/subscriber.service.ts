import { NextFunction, Request, Response } from "express";
import { novu } from "../../../lib/novu";
import DBInvalidTableError from "../../../errors/DBInvalidTableError";
import { PushProviderIdEnum } from "@novu/node";

/* ------------------------------- Subscriber ------------------------------- */

export const insertSubscriber = async (req: Request, res: Response, next: NextFunction) => {
  const { schema, table, record } = req.body;

	const schemaTable = `${schema}.${table}`;
	const subscriberId = record.id;

	if (schemaTable === 'auth.users') {
		await novu.subscribers.identify(subscriberId, {
			email: record.email,
			phone: record.phone,
		});
		res.send('Subscriber created');
	} else if (schemaTable === 'public.user') {
		await novu.subscribers.update(subscriberId, {
			avatar: record.avatar_url,
			data: {
				username: record.username,
				full_name: record.full_name,
			},
			locale: record.language,
		});
		res.send('Subscriber updated');
	} else {
		throw new DBInvalidTableError(schemaTable);
	}
}

export const deleteSubscriber = async (req: Request, res: Response, next: NextFunction) => {
	  const { schema, table, record } = req.body;

	const schemaTable = `${schema}.${table}`;
	const subscriberId = record.id;

	if (schemaTable === 'auth.users') {
		await novu.subscribers.delete(subscriberId);
		res.send('Subscriber deleted');
	} else {
		throw new DBInvalidTableError(schemaTable);
	}
}

export const updateSubscriber = async (req: Request, res: Response, next: NextFunction) => {
	const { schema, table, record } = req.body;

	const schemaTable = `${schema}.${table}`;
	const subscriberId = record.id;

	if (schemaTable === 'auth.users') {
		await novu.subscribers.update(subscriberId, {
			email: record.email,
			phone: record.phone,
		});
		res.send('Subscriber updated');
	} else if (schemaTable === 'public.user') {
		await novu.subscribers.update(subscriberId, {
			avatar: record.avatar_url,
			data: {
				username: record.username,
				full_name: record.full_name,
			},
			locale: record.language,
		});
		res.send('Subscriber updated');
	} else {
		throw new DBInvalidTableError(schemaTable);
	}
}

/* -------------------------------------------------------------------------- */

/* --------------------------------- Tokens --------------------------------- */

export const manageFcmTokens = async (user_id: string, tokens: any[]) => {
	await novu.subscribers.setCredentials(
		user_id,
		PushProviderIdEnum.FCM,
		{
			deviceTokens: tokens.map((token) => token.token),
		},
		process.env.NOVU_PROVIDER_ID_FCM
	)
};

/* -------------------------------------------------------------------------- */