import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createStalls = mutation({
	args: {
		stalls: v.array(
			v.object({
				name: v.optional(v.string()),
				salerId: v.optional(v.string()),
				salerName: v.optional(v.string()),
				items: v.array(
					v.object({
						name: v.optional(v.string()),
						price: v.optional(v.number()),
					}),
				),
			}),
		),
	},
	handler: async (ctx, args) => {
		// const identity = await ctx.auth.getUserIdentity();

		const { stalls } = args;

		// Insert in a loop. This is efficient because Convex queues all the changes
		// to be executed in a single transaction when the mutation ends.
		for (const stall of stalls) {
			const id = await ctx.db.insert("stall", {
				name: stall.name || "",
				salerId: stall.salerId || "",
				salerName: stall.salerName || "",
			});

			for (const item of stall.items) {
				const stallItemId = await ctx.db.insert("stallItem", {
					name: item.name || "",
					price: item.price || 0,
					stallId: id,
				});
			}
		}
	},
});

export const deleteAll = mutation({
	args: {},
	handler: async (ctx, args) => {
		const stall = await ctx.db.query("stall").collect();
		const stallItem = await ctx.db.query("stallItem").collect();

		await Promise.all(
			stall.map((d) => {
				return ctx.db.delete(d._id);
			}),
		);

		await Promise.all(
			stallItem.map((d) => {
				return ctx.db.delete(d._id);
			}),
		);

		return true;
	},
});

export const get = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("stall").collect();
	},
});

export const list = query({
	args: { paginationOpts: paginationOptsValidator },
	handler: async (ctx, args) => {
		const foo = await ctx.db
			.query("stall")
			.order("desc")
			.paginate(args.paginationOpts);
		return foo;
	},
});
