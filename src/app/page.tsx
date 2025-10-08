"use client";
import React, { useState } from "react";
import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function HomePage() {
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const createStalls = useMutation(api.stall.createStalls);
	const deleteAll = useMutation(api.stall.deleteAll);
	const data = useQuery(api.stallItem.search, {
		name: search,
	});
	const [files, setFiles] = useState<FileList | null>(null);

	const sortedData = data?.sort?.((a, b) => {
		return a.price - b.price;
	});

	async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files) return;
		setFiles(files);
	}

	async function submit() {
		console.log('zjflog', files);
		const stalls: any[] = [];

		if (!files) return;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			try {
				if (!file) {
					continue;
				}
				const text = await file.text();
				const data = JSON.parse(text);

				if (!data.stallSalerId) {
					continue;
				}

				const items: any[] = [];

				for (const item of data.stallItems) {
					if (!item.name || /[^0-9]/.test(item.price)) {
						continue;
					}

					const price = Number.parseInt(item.price, 10);

					items.push({
						name: item.name || "",
						price,
					});
				}

				if (!items) {
					continue;
				}

				stalls.push({
					name: data.stallName || "",
					salerId: data.stallSalerId || "",
					salerName: data.stallSallerName || "",
					items,
				});
			} catch (err) {
				// do noting
			}
		}

		console.log('zjflog stalls', stalls);

		await createStalls({ stalls });
		console.log('success');
	}

	return (
		<main style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
			<div className="flex gap-4 mb-4">
				<input
					className="block w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					type="file"
					multiple
					onChange={handleFiles}
					accept=".json,.txt,application/json,text/plain"
				/>
				<button
					type="button"
					className="px-4 py-2 mb-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					onClick={() => {
						submit();
					}}
				>
					Submit
				</button>
				<button
					type="button"
					className="px-4 py-2 mb-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					onClick={() => {
						deleteAll();
					}}
				>
					Clean DB
				</button>
			</div>
			<div className="flex gap-4 mb-4">
				<input
					type="text"
					className="block w-full max-w-xs px-4 py-2 mb-6 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Item Name"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
				<button
					type="button"
					className="px-4 py-2 mb-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					onClick={() => {
						setSearch(searchInput);
					}}
				>
					Search
				</button>
			</div>

			<table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
				<thead className="bg-gray-100">
					<tr>
						<th className="px-3 py-2 text-left">Name</th>
						<th className="px-3 py-2 text-left">Price</th>
						<th className="px-3 py-2 text-left">Stall Name</th>
						<th className="px-3 py-2 text-left">Saler Name</th>
						<th className="px-3 py-2 text-left">Saler Id</th>
					</tr>
				</thead>
				<tbody>
					{sortedData?.map((item) => (
						<tr key={item._id} className="border-t border-gray-200">
							<td className="px-3 py-2">{item.name}</td>
							<td className="px-3 py-2">{item.price}</td>
							<td className="px-3 py-2">{item.stall.name}</td>
							<td className="px-3 py-2">{item.stall.salerName}</td>
							<td className="px-3 py-2">{item.stall.salerId}</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
}
