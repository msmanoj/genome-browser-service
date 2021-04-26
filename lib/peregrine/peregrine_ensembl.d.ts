/* tslint:disable */
/* eslint-disable */
/**
*/
export function main(): void;
/**
*/
export function init_panic_hook(): void;
/**
* @param {string} stick_id
*/
export function set_stick(stick_id: string): void;
/**
* @param {any} message
*/
export function receive_message(message: any): void;
/**
* @param {number} pos
*/
export function set_x(pos: number): void;
/**
* @param {number} bp_per_screen
*/
export function set_bp_per_screen(bp_per_screen: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly main: () => void;
  readonly init_panic_hook: () => void;
  readonly set_stick: (a: number, b: number) => void;
  readonly receive_message: (a: number) => void;
  readonly set_x: (a: number) => void;
  readonly set_bp_per_screen: (a: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hdcce7b55225956a9: (a: number, b: number) => void;
  readonly _dyn_core__ops__function__Fn__A_B___Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hd9f62d3bae441d65: (a: number, b: number, c: number, d: number) => void;
  readonly _dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h6652aee071b1b33a: (a: number, b: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h8d340687c1cd9253: (a: number, b: number, c: number) => void;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
