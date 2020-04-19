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

		// prepare
		rimraf.sync(tmpdir);
		await fs.mkdir(tmpdir);
		await copyDir(fixturePath, tmpdir);
		await fs.copyFile(
			path.resolve(__dirname, "../.yarn/releases/yarn-2.0.0-rc.32.js"),
			path.join(tmpdir, "yarn.js")
		);
		await fs.copyFile(
			path.resolve(__dirname, "../bundles/@yarnpkg/plugin-deduplicate.js"),
			path.join(tmpdir, "yarn-deduplicate.js")
		);
		await fs.writeFile(
			path.join(tmpdir, ".yarnrc.yml"),
			`
enableTimers: false
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
		childProcess.execSync(`git commit -m 'Initial commit'`, { cwd: tmpdir });

		const { stdout, stderr } = childProcess.spawnSync(`yarn`, [`deduplicate`], {
			cwd: tmpdir
		});
		expect(stderr.toString("utf8")).toMatchSnapshot("stderr");
		expect(stdout.toString("utf8")).toMatchSnapshot("stdout");
		const gitDiff = childProcess
			.execSync(`git diff --patch`, { cwd: tmpdir })
			.toString("utf8");
		expect(gitDiff).toMatchSnapshot("git-diff");
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
