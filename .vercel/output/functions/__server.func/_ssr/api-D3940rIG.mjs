import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BXSyzxH0.mjs";
import { D as _enum, F as object, O as any, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { i as createSsrRpc } from "./router-CQvOUc1D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D3940rIG.js
var getBootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1d6bb4f0e270a32a5bf9e3bb6caa9c0ee9a8ec0309c035580a78d8c74458f71c"));
var renameMe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ name: string().trim().min(1).max(40) })).handler(createSsrRpc("8e972f5f77b98a4e58b67076964735f99b75f8e27f1be5080e08e041d2d4fbfb"));
var createWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ name: string().trim().min(1).max(40) })).handler(createSsrRpc("0a2c59ead85978d1e62875a7161de68a22e678853f79ce62a4ac6bfd0f258099"));
var joinWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ code: string().trim().min(4).max(12) })).handler(createSsrRpc("37bc124b1f1af306161a9824ac9261c29ad44688018410e7bf18f859b88fa0dd"));
var listMessages = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("670b0c0555328227b81b46a193cd5f45d1fbeb41f1e5ced45e95db7fb2476dfa"));
var sendMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	body: string().trim().min(1).max(4e3),
	kind: _enum([
		"text",
		"file",
		"report"
	]).default("text"),
	refId: string().nullable().optional()
})).handler(createSsrRpc("053954e82c986ac7796898193f9c2c1fa3068615c49fc19b9bc58d6a6419f3d2"));
var listFolders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cb3c05c6c573fcd9a8ed820195d75e4e5cf974996f87c27c0b362c69785ee7c8"));
var createFolder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ name: string().trim().min(1).max(40) })).handler(createSsrRpc("b036eb017c7663e07780ea9f8cec1da2d74e0eb63a417e76df736196e2e2b4c4"));
var listDocuments = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ folderId: number().nullable().optional() }).optional()).handler(createSsrRpc("13ce1eb0a32ad8e6af010d846fb36e91528e9abf5e36fb9c985ac6c89bac9a71"));
var getDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(createSsrRpc("967e453e8e7f9b3e5f860f6232edcffda144941897e4d0c69234a51749970cf7"));
var saveDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number().optional(),
	folderId: number().nullable().optional(),
	title: string().trim().min(1).max(120),
	kind: _enum([
		"note",
		"web",
		"image",
		"file",
		"board"
	]),
	content: string().max(9e5),
	mime: string().max(120).nullable().optional()
})).handler(createSsrRpc("5c4b55f6d1bdff08f970b09f8ac13df77e16d8953d45728384ec031acccf9fe4"));
var deleteDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(createSsrRpc("b157876d9a6ef48ea2d7c9686b4745a5f01d9b8d2613e8dfcf32048fd6ef0e3b"));
var listReports = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7a270e08e1388422957b0cd9cc31f864a4993fd9526c0d9d42acd57bfad3ac22"));
var saveReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number().optional(),
	title: string().trim().min(1).max(120),
	workDate: string().min(8).max(10),
	summary: string().max(4e3),
	nextPlan: string().max(2e3),
	hours: string().max(12).nullable().optional(),
	items: array(object({
		task: string().trim().min(1).max(200),
		status: _enum([
			"done",
			"doing",
			"blocked",
			"wait"
		]),
		note: string().max(400)
	})).max(40)
})).handler(createSsrRpc("e8bff06d452226181a4a6ec65d648ae7bb8e7dc83b0bf843daa24a1553b22335"));
var deleteReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(createSsrRpc("57d08d45500fe1e97743c11cc4a763ec7ac7de4b570c69b6cc1afaf5b21ce5b0"));
var getBoard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f36fa7c781c0d7d9d28ffe3f9803c5ccaad2a494cd851f9fb74dcaa99c1a6996"));
var saveBoard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	strokes: array(any()).max(800),
	notes: array(any()).max(80)
})).handler(createSsrRpc("9f44c0bd4cfee7fb86eefbe628c4d49599857052140187d274100515c20cddfb"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4303ff2527037c84f7e30b270e3f6e8a6118e8bf6a13e0e3f4d48144dd33a3ab"));
var logBoardActivity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ detail: string().max(120) })).handler(createSsrRpc("04dd56879c6716215c5a4dab7c0297d74c44748c663f615e9b61f5a5d4b830ba"));
//#endregion
export { saveDocument as _, getBoard as a, getDocument as c, listFolders as d, listMessages as f, saveBoard as g, renameMe as h, deleteReport as i, joinWorkspace as l, logBoardActivity as m, createWorkspace as n, getBootstrap as o, listReports as p, deleteDocument as r, getDashboard as s, createFolder as t, listDocuments as u, saveReport as v, sendMessage as y };
