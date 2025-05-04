import { defineConfig } from "serverless-aws-lambda/defineConfig";
import { vitestPlugin } from "serverless-aws-lambda-vitest";

const vitest = process.argv.includes("vitest");
const oneshot = process.argv.includes("oneshot");

export default defineConfig({
  plugins: [
    {
      name: "my-custom-plugin",
      onInit: function () {
        if (this.isDeploying || this.isPackaging) {
          // bundle "pg" which will be included into handler archive as specified at serverless.yml:9
          this.config.esbuild.entryPoints = [{ in: "pg", out: "bundled_node_modules/pg/index" }];
        }
      },
    },
    vitest &&
      vitestPlugin({
        configFile: "./vitest.e2e.config.ts",
        oneshot,
        coverage: {
          outDir: "./coverage/",
          json: true,
          badge: true,
        },
      }),
  ],
  offline: {
    port: 3000,
  },
  esbuild: {
    // customize if needed
  },
});
