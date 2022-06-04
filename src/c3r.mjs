#!/usr/bin/env node
import { createServer } from "vite";
import { ViteNodeServer } from "vite-node/server";
import { ViteNodeRunner } from "vite-node/client";
import { resolve } from "path";
import { extname, basename } from "path";
import minimist from "minimist";
import { os, $ } from "zx";
const argv = minimist(process.argv.slice(2));

// create vite server
const server = await createServer();
// this is need to initialize the plugins
await server.pluginContainer.buildStart({});

// create vite-node server
const node = new ViteNodeServer(server);

// create vite-node runner
const runner = new ViteNodeRunner({
  root: server.config.root,
  base: server.config.base,
  // when having the server and runner in a different context,
  // you will need to handle the communication between them
  // and pass to this function
  fetchModule(id) {
    return node.fetchModule(id);
  },
});

// execute the file
if (argv._.length === 0) {
  throw new Error("please input file");
}
const name = argv._[0];
const inputfile = resolve(name);
const newInputFile = resolve(`${name}.tmp.ts`);

// $.verbose = false;
await $`tail -n +2 ${inputfile} > ${newInputFile}`;
await runner.executeFile(newInputFile);

// close the vite server
await server.close();
await $`rm ${newInputFile}`;
