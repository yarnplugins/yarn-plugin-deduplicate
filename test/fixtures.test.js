const childProcess = require("child_process");
const { promises: fs, readdirSync } = require("fs");
const os = require("os");
const path = require("path");
const rimraf = require("rimraf");

describe("fixtures", () => {
	const fixtureDirPath = path.resolve(__dirname, "./fixtures/");

	test.each(readdirSync(fixtureDirPath))("fixture %s", async fixtureName => {
		const fixturePath = path.join(fixtureDirPath, fixtureName);
		const tmpdir = path.join(
			os.tmpdir(),
			`yarn-deduplicate-test-${fixtureName}`
		);
		const yarnCmd = path.join(tmpdir, "yarn.js");

		// prepare
		rimraf.sync(tmpdir);
		await fs.mkdir(tmpdir);
		await copyDir(fixturePath, tmpdir);
		await fs.copyFile(
			path.resolve(__dirname, "../.yarn/releases/yarn-2.x.cjs"),
			yarnCmd
		);
		await fs.copyFile(
			path.resolve(__dirname, "../bundles/@yarnpkg/plugin-deduplicate.js"),
			path.join(tmpdir, "yarn-deduplicate.js")
		);
		await fs.writeFile(
			path.join(tmpdir, ".yarnrc.yml"),
			`
plugins:
  - yarn-deduplicate.js

yarnPath: yarn.js`,
			{ encoding: "utf8" }
		);
		childProcess.execSync(`git init`, { cwd: tmpdir });
		childProcess.execSync(`git config user.name "jest"`, { cwd: tmpdir });
		childProcess.execSync(`git config user.email "jest@example.com"`, {
			cwd: tmpdir
		});
		childProcess.execSync(`git add -A`, { cwd: tmpdir });
		childProcess.execSync(`git commit -m "Initial commit"`, { cwd: tmpdir });

		const { error, stdout, stderr } = childProcess.spawnSync(
			process.execPath,
			[yarnCmd, `deduplicate`],
			{
				cwd: tmpdir,
				env: {
					PATH: process.env.PATH,
					// see https://github.com/yarnpkg/berry/blob/master/packages/acceptance-tests/pkg-tests-core/sources/utils/makeTemporaryEnv.ts#L45-L57
					// copied from https://github.com/yarnpkg/berry/blob/1d98fe7d9ec67aba890cb1209c834a39ca3eba94/packages/acceptance-tests/pkg-tests-core/sources/utils/makeTemporaryEnv.ts#L45-L57
					YARN_ENABLE_COLORS: "0",
					YARN_ENABLE_INLINE_BUILDS: "false",
					YARN_ENABLE_PROGRESS_BARS: "false",
					YARN_ENABLE_TIMERS: "false"
				}
			}
		);
		expect(error).toBe(undefined);
		expect(stdout.toString("utf8")).toMatchSnapshot();
		expect(stderr.toString("utf8")).toMatchSnapshot();

		// yarn's .pnp file has 0644 under windows but 0755 under unix
		// We don't care about those changes her.
		await fs.chmod(path.join(tmpdir, ".pnp.js"), 0o755);
		const diff = childProcess
			.execSync(`git diff --patch`, { cwd: tmpdir })
			.toString("utf8");

		expect(diff).toMatchSnapshot();
	});
});

async function copyDir(source, destination) {
	const files = await fs.readdir(source);
	return Promise.all(
		files
			.map(fileName => {
				return path.join(source, fileName);
			})
			.map(async filePath => {
				const stats = await fs.stat(filePath);
				if (stats.isDirectory()) {
					await fs.mkdir(path.join(destination, path.basename(filePath)));
					return copyDir(
						filePath,
						path.join(destination, path.basename(filePath))
					);
				}

				return fs.copyFile(
					filePath,
					path.join(destination, path.basename(filePath))
				);
			})
	);
}

async function folderMatches(left, right) {
	// ignore extraneous files from right (these are cli/plugin binaries and the cache)
	const files = await fs.readdir(left);
}
