import { query } from "./_generated/server";
import { v } from "convex/values";

async function getResultWithStall<T1 = any, T2 = any>(ctx: T1, item: T2) {
	const stall = await ctx?.db?.get?.(item?.stallId);

	return {
		...item,
		stall,
	};
}

export const search = query({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		const { name } = args;
		let search = ctx.db.query("stallItem");

		if (name) {
			// @ts-ignore
			search = search.withSearchIndex("search_stall_name", (q) =>
				q.search("name", args.name),
			);
		}

		const result = await search.collect();

		const resultWithStall = await Promise.all(
			result.map((item) => getResultWithStall(ctx, item)),
		);

		return resultWithStall;
	},
});
