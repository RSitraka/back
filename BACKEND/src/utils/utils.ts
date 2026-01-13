import fs from 'fs'

async function ft_delete(path: string) {
	try {
		await fs.promises.rm(path);
	} catch (err) {
		console.error(err);
	}
}

export { ft_delete }