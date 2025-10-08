import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	stall: defineTable({
		name: v.string(),
		salerId: v.string(),
		salerName: v.string(),
	}),

	stallItem: defineTable({
		name: v.string(),
		price: v.number(),
		stallId: v.id("stall"),
	}).searchIndex("search_stall_name", {
		searchField: "name",
		filterFields: [],
		staged: false,
	}),
});
