import chalk from 'chalk';
import esbuild from 'esbuild';
import postcss from 'esbuild-postcss';

/**
 * PostCSS
 *
 * Compile PostCSS
 * @param {string} src
 * @param {object} options
 */
export default function (src, options = {}) {
	this.src = src;
	this.options = options;
	this.meta = null;

	this.compile = async () => {
		console.log(chalk.cyan(`🟢 Compiling PostCSS from ${this.src}`));

		// Set a default destination if none is provided
		let dest = this.options?.dest || null;
		if (!dest) {
			dest = this.src.replace('src', 'dist');
		}

		try {
			let result = await esbuild.build({
				entryPoints: [this.src],
				minify: this.options?.minify || false,
				outdir: dest,
				plugins: [postcss(this.options?.extensions || ['.postcss', '.css'])],
				metafile: true,
			});

			this.meta = {
				src: this.src,
				dest,
				inputs: result.metafile.inputs,
				outputs: result.metafile.outputs,
				errors: result.errors.length ? result.errors : null,
				warnings: result.warnings.length ? result.warnings : null,
			};
		} catch (error) {
			console.log(chalk.red(`🔴 Error compiling PostCSS: ${error}`));
			this.meta = {
				src: this.src,
				dest,
				inputs: null,
				errors: [error],
				warnings: null,
			};
		}
	};

	return this;
}
