import { relations } from "drizzle-orm/relations";
import { user, account, session, meetings, agents } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	meetings: many(meetings),
	agents: many(agents),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const meetingsRelations = relations(meetings, ({one}) => ({
	user: one(user, {
		fields: [meetings.userId],
		references: [user.id]
	}),
	agent: one(agents, {
		fields: [meetings.agentId],
		references: [agents.id]
	}),
}));

export const agentsRelations = relations(agents, ({one, many}) => ({
	meetings: many(meetings),
	user: one(user, {
		fields: [agents.userId],
		references: [user.id]
	}),
}));