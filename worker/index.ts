export default {
	async fetch(/*request, env*/) {
		// const stmt = env.DB.prepare("SELECT * FROM comments LIMIT 3");
		// const { results } = await stmt.all();

		return new Response(JSON.stringify('Hello world', null, 2), {
			headers: {
				'content-type': 'application/json',
			},
		});
	},
} satisfies ExportedHandler<Env>;
