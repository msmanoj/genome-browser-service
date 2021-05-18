
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (typeof(arg) !== 'string') throw new Error('expected a string argument');

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error('expected a boolean argument');
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error('expected a number argument');
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                state.a = 0;

            }
        }
    };
    real.original = state;

    return real;
}

function logError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            let error = (function () {
                try {
                    return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
                } catch(_) {
                    return "<failed to stringify thrown value>";
                }
            }());
            console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
            throw e;
        }
    };
}
function __wbg_adapter_28(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__Fn__A_B___Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hcfe61f409c5f7ef6(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_31(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hb2dbbdb876dd984d(arg0, arg1);
}

function __wbg_adapter_34(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__ha31e3de82e8bbe3a(arg0, arg1);
}

function __wbg_adapter_37(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__ha4dadbd1d27bfb0b(arg0, arg1, addHeapObject(arg2));
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
*/
export function main() {
    wasm.main();
}

/**
*/
export function init_panic_hook() {
    wasm.init_panic_hook();
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}

let cachegetFloat32Memory0 = null;
function getFloat32Memory0() {
    if (cachegetFloat32Memory0 === null || cachegetFloat32Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory0;
}

function getArrayF32FromWasm0(ptr, len) {
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
/**
*/
export class GenomeBrowser {

    static __wrap(ptr) {
        const obj = Object.create(GenomeBrowser.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_genomebrowser_free(ptr);
    }
    /**
    */
    constructor() {
        var ret = wasm.genomebrowser_new();
        return GenomeBrowser.__wrap(ret);
    }
    /**
    */
    go() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        wasm.genomebrowser_go(this.ptr);
    }
    /**
    * @param {string} stick_id
    */
    set_stick(stick_id) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        var ptr0 = passStringToWasm0(stick_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.genomebrowser_set_stick(this.ptr, ptr0, len0);
    }
    /**
    * @param {any} message
    */
    static receive_message(message) {
        try {
            wasm.genomebrowser_receive_message(addBorrowedObject(message));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {number} bp_per_screen
    */
    set_bp_per_screen(bp_per_screen) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        wasm.genomebrowser_set_bp_per_screen(this.ptr, bp_per_screen);
    }
    /**
    * @param {number} pos
    */
    set_x(pos) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        wasm.genomebrowser_set_x(this.ptr, pos);
    }
    /**
    * @param {number} y
    */
    set_y(y) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        wasm.genomebrowser_set_y(this.ptr, y);
    }
    /**
    * @param {any} path
    */
    set_switch(path) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            _assertNum(this.ptr);
            wasm.genomebrowser_set_switch(this.ptr, addBorrowedObject(path));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {any} path
    */
    clear_switch(path) {
        try {
            if (this.ptr == 0) throw new Error('Attempt to use a moved value');
            _assertNum(this.ptr);
            wasm.genomebrowser_clear_switch(this.ptr, addBorrowedObject(path));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {Function} f
    */
    set_message_reporter(f) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        wasm.genomebrowser_set_message_reporter(this.ptr, addHeapObject(f));
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('peregrine_ensembl_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = JSON.stringify(obj === undefined ? null : obj);
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = logError(function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    });
    imports.wbg.__wbg_new_59cb74e423758ede = logError(function() {
        var ret = new Error();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_stack_558ba5917b466edd = logError(function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    });
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_new_4ceeb9be31a13059 = handleError(function(arg0) {
        var ret = new ResizeObserver(getObject(arg0));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_observe_008267f77ff4d317 = logError(function(arg0, arg1, arg2) {
        getObject(arg0).observe(getObject(arg1), getObject(arg2));
    });
    imports.wbg.__wbg_disconnect_971b038366e5c923 = logError(function(arg0) {
        getObject(arg0).disconnect();
    });
    imports.wbg.__wbg_target_5273b5acdb2003a1 = logError(function(arg0) {
        var ret = getObject(arg0).target;
        return addHeapObject(ret);
    });
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_fa4595281eb5ba83 = logError(function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        _assertBoolean(ret);
        return ret;
    });
    imports.wbg.__wbg_document_d8cce4c1031c64eb = logError(function(arg0) {
        var ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_screen_80afd023147ebceb = handleError(function(arg0) {
        var ret = getObject(arg0).screen;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_requestAnimationFrame_ef037dc409649fbf = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_clearTimeout_89646e84ae19144e = logError(function(arg0, arg1) {
        getObject(arg0).clearTimeout(arg1);
    });
    imports.wbg.__wbg_fetch_c30edd07fd98da6f = logError(function(arg0, arg1) {
        var ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_setTimeout_8462a0738ecca084 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_id_f8491cd1910f092e = logError(function(arg0, arg1) {
        var ret = getObject(arg1).id;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    });
    imports.wbg.__wbg_setid_d218dad355f902f5 = logError(function(arg0, arg1, arg2) {
        getObject(arg0).id = getStringFromWasm0(arg1, arg2);
    });
    imports.wbg.__wbg_setinnerHTML_a8b2c66f141a2b24 = logError(function(arg0, arg1, arg2) {
        getObject(arg0).innerHTML = getStringFromWasm0(arg1, arg2);
    });
    imports.wbg.__wbg_getBoundingClientRect_6c4d67366fb08e31 = logError(function(arg0) {
        var ret = getObject(arg0).getBoundingClientRect();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_getElementsByClassName_a4542b3570eefd03 = logError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getElementsByClassName(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_setAttribute_fb8737b4573a65f8 = handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    });
    imports.wbg.__wbg_append_8b963b598b2deff6 = handleError(function(arg0, arg1) {
        getObject(arg0).append(getObject(arg1));
    });
    imports.wbg.__wbg_ownerDocument_c427aca3c07c10e9 = logError(function(arg0) {
        var ret = getObject(arg0).ownerDocument;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_parentElement_61b6f4ac6a13f7a8 = logError(function(arg0) {
        var ret = getObject(arg0).parentElement;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_settextContent_00a0c562129ed7b9 = logError(function(arg0, arg1, arg2) {
        getObject(arg0).textContent = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
    });
    imports.wbg.__wbg_appendChild_9ba4c99688714f13 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_length_f45ff6decb27deb7 = logError(function(arg0) {
        var ret = getObject(arg0).length;
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_item_74246db814f56562 = logError(function(arg0, arg1) {
        var ret = getObject(arg0).item(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_newwitheventinitdict_0434b84bf09a1cfe = handleError(function(arg0, arg1, arg2) {
        var ret = new CustomEvent(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_instanceof_Response_f893353f25f6c750 = logError(function(arg0) {
        var ret = getObject(arg0) instanceof Response;
        _assertBoolean(ret);
        return ret;
    });
    imports.wbg.__wbg_arrayBuffer_c5e630358019dfa0 = handleError(function(arg0) {
        var ret = getObject(arg0).arrayBuffer();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_json_3539b33e75140c0c = handleError(function(arg0) {
        var ret = getObject(arg0).json();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_headers_cea143192f231804 = logError(function(arg0) {
        var ret = getObject(arg0).headers;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_newwithstrandinit_18c41e1aaab4972f = handleError(function(arg0, arg1, arg2) {
        var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_signal_564fb4b932a62647 = logError(function(arg0) {
        var ret = getObject(arg0).signal;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_new_b25ae9c0ad6843ae = handleError(function() {
        var ret = new AbortController();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_abort_9c58ad5988ed06e1 = logError(function(arg0) {
        getObject(arg0).abort();
    });
    imports.wbg.__wbg_rangeMin_13f71896dbc8a611 = logError(function(arg0) {
        var ret = getObject(arg0).rangeMin;
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_rangeMax_4eb66fc6ad81524f = logError(function(arg0) {
        var ret = getObject(arg0).rangeMax;
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_precision_25b8caab2e83fb7c = logError(function(arg0) {
        var ret = getObject(arg0).precision;
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_body_52b3f453148fd124 = logError(function(arg0) {
        var ret = getObject(arg0).body;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_createElement_695120dd76150487 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_getElementById_aeb1b7331ed88a97 = logError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_instanceof_WebGlRenderingContext_bf4c1c161cce63d8 = logError(function(arg0) {
        var ret = getObject(arg0) instanceof WebGLRenderingContext;
        _assertBoolean(ret);
        return ret;
    });
    imports.wbg.__wbg_bufferData_1e028cc0639f0264 = logError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);
    });
    imports.wbg.__wbg_texImage2D_3456049636c02bbf = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4 >>> 0, arg5 >>> 0, getObject(arg6));
    });
    imports.wbg.__wbg_uniformMatrix4fv_af0611029b3e44bd = logError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).uniformMatrix4fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    });
    imports.wbg.__wbg_activeTexture_ccd864030355beba = logError(function(arg0, arg1) {
        getObject(arg0).activeTexture(arg1 >>> 0);
    });
    imports.wbg.__wbg_attachShader_176dfde48c626eb8 = logError(function(arg0, arg1, arg2) {
        getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
    });
    imports.wbg.__wbg_bindBuffer_aff83e0a72ebe9c6 = logError(function(arg0, arg1, arg2) {
        getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
    });
    imports.wbg.__wbg_bindTexture_3c4cdd29edc870f9 = logError(function(arg0, arg1, arg2) {
        getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));
    });
    imports.wbg.__wbg_clear_4026459dc218d806 = logError(function(arg0, arg1) {
        getObject(arg0).clear(arg1 >>> 0);
    });
    imports.wbg.__wbg_clearColor_3feff7be5983725c = logError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).clearColor(arg1, arg2, arg3, arg4);
    });
    imports.wbg.__wbg_compileShader_b154f866a37ef240 = logError(function(arg0, arg1) {
        getObject(arg0).compileShader(getObject(arg1));
    });
    imports.wbg.__wbg_createBuffer_9cd00017c8012ded = logError(function(arg0) {
        var ret = getObject(arg0).createBuffer();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_createProgram_1dc1d5b4f815c74e = logError(function(arg0) {
        var ret = getObject(arg0).createProgram();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_createShader_a568ae9716cf79bd = logError(function(arg0, arg1) {
        var ret = getObject(arg0).createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_createTexture_9165d6614a3f8c26 = logError(function(arg0) {
        var ret = getObject(arg0).createTexture();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_deleteBuffer_287a76188dc8034e = logError(function(arg0, arg1) {
        getObject(arg0).deleteBuffer(getObject(arg1));
    });
    imports.wbg.__wbg_deleteTexture_a7db85bee4afb217 = logError(function(arg0, arg1) {
        getObject(arg0).deleteTexture(getObject(arg1));
    });
    imports.wbg.__wbg_disableVertexAttribArray_f526235bb5b7cec4 = logError(function(arg0, arg1) {
        getObject(arg0).disableVertexAttribArray(arg1 >>> 0);
    });
    imports.wbg.__wbg_drawArrays_d02840b07073ba40 = logError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
    });
    imports.wbg.__wbg_drawElements_567b7125cfe5debf = logError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
    });
    imports.wbg.__wbg_enable_8c08778f17ea82d3 = logError(function(arg0, arg1) {
        getObject(arg0).enable(arg1 >>> 0);
    });
    imports.wbg.__wbg_enableVertexAttribArray_19841ca8c10ee785 = logError(function(arg0, arg1) {
        getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
    });
    imports.wbg.__wbg_getAttribLocation_3cbba362123e3451 = logError(function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).getAttribLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_getParameter_5b0bd9e1395151d6 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).getParameter(arg1 >>> 0);
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_getProgramInfoLog_b3af1c1f2f050ac5 = logError(function(arg0, arg1, arg2) {
        var ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    });
    imports.wbg.__wbg_getProgramParameter_15c77e6ded344978 = logError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_getShaderInfoLog_62bc93f21372bbdb = logError(function(arg0, arg1, arg2) {
        var ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    });
    imports.wbg.__wbg_getShaderParameter_b652420e47ea83c3 = logError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_getShaderPrecisionFormat_4a993a2fa187427c = logError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getShaderPrecisionFormat(arg1 >>> 0, arg2 >>> 0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_getUniformLocation_0e74513fa8e0fcef = logError(function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).getUniformLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_linkProgram_0a51f6ca8e067ba7 = logError(function(arg0, arg1) {
        getObject(arg0).linkProgram(getObject(arg1));
    });
    imports.wbg.__wbg_scissor_53f081ef55d3977d = logError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).scissor(arg1, arg2, arg3, arg4);
    });
    imports.wbg.__wbg_shaderSource_9f03812e74c7504e = logError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3));
    });
    imports.wbg.__wbg_texParameteri_26de60b40766928f = logError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    });
    imports.wbg.__wbg_uniform1f_2780bb2450c61e08 = logError(function(arg0, arg1, arg2) {
        getObject(arg0).uniform1f(getObject(arg1), arg2);
    });
    imports.wbg.__wbg_uniform1i_6a282c117216b6ef = logError(function(arg0, arg1, arg2) {
        getObject(arg0).uniform1i(getObject(arg1), arg2);
    });
    imports.wbg.__wbg_uniform2f_2c62de1e5acc87da = logError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).uniform2f(getObject(arg1), arg2, arg3);
    });
    imports.wbg.__wbg_uniform3f_f4534fac81a7ced0 = logError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).uniform3f(getObject(arg1), arg2, arg3, arg4);
    });
    imports.wbg.__wbg_uniform4f_5362c07e328ab255 = logError(function(arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).uniform4f(getObject(arg1), arg2, arg3, arg4, arg5);
    });
    imports.wbg.__wbg_useProgram_9174cae30cc67e4d = logError(function(arg0, arg1) {
        getObject(arg0).useProgram(getObject(arg1));
    });
    imports.wbg.__wbg_vertexAttribPointer_f1d73baac9e3b6e9 = logError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    });
    imports.wbg.__wbg_viewport_f89fe7da7b1e24e2 = logError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).viewport(arg1, arg2, arg3, arg4);
    });
    imports.wbg.__wbg_error_c81c8d172df3cb18 = logError(function(arg0) {
        console.error(getObject(arg0));
    });
    imports.wbg.__wbg_log_8485ead621ceded9 = logError(function(arg0) {
        console.log(getObject(arg0));
    });
    imports.wbg.__wbg_warn_eb158fa0859088bf = logError(function(arg0) {
        console.warn(getObject(arg0));
    });
    imports.wbg.__wbg_instanceof_HtmlElement_1557ca12085328d3 = logError(function(arg0) {
        var ret = getObject(arg0) instanceof HTMLElement;
        _assertBoolean(ret);
        return ret;
    });
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_fbca10ed951560f3 = logError(function(arg0) {
        var ret = getObject(arg0) instanceof CanvasRenderingContext2D;
        _assertBoolean(ret);
        return ret;
    });
    imports.wbg.__wbg_setfillStyle_1b068f8d99084158 = logError(function(arg0, arg1) {
        getObject(arg0).fillStyle = getObject(arg1);
    });
    imports.wbg.__wbg_setfont_7d7b206c4c017729 = logError(function(arg0, arg1, arg2) {
        getObject(arg0).font = getStringFromWasm0(arg1, arg2);
    });
    imports.wbg.__wbg_settextBaseline_8b1e14b450792a03 = logError(function(arg0, arg1, arg2) {
        getObject(arg0).textBaseline = getStringFromWasm0(arg1, arg2);
    });
    imports.wbg.__wbg_fillRect_c642f5e276c8398f = logError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillRect(arg1, arg2, arg3, arg4);
    });
    imports.wbg.__wbg_fillText_aee0d6016521a3b2 = handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
    });
    imports.wbg.__wbg_measureText_2a4b2ca71061d96c = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).measureText(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_addEventListener_9b66d58c2a9ba39a = handleError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    });
    imports.wbg.__wbg_dispatchEvent_859a7b8f200d5965 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).dispatchEvent(getObject(arg1));
        _assertBoolean(ret);
        return ret;
    });
    imports.wbg.__wbg_removeEventListener_e24bf386768929ee = handleError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    });
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_c9f334afe4eed430 = logError(function(arg0) {
        var ret = getObject(arg0) instanceof HTMLCanvasElement;
        _assertBoolean(ret);
        return ret;
    });
    imports.wbg.__wbg_setwidth_41b2497107faaff7 = logError(function(arg0, arg1) {
        getObject(arg0).width = arg1 >>> 0;
    });
    imports.wbg.__wbg_setheight_e15cb9243262e701 = logError(function(arg0, arg1) {
        getObject(arg0).height = arg1 >>> 0;
    });
    imports.wbg.__wbg_getContext_d277f710e8035242 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_width_bad8f2ac9b85aea1 = handleError(function(arg0) {
        var ret = getObject(arg0).width;
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_height_aa026a1b3ce6ae72 = handleError(function(arg0) {
        var ret = getObject(arg0).height;
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_width_119bed3a2ce049d1 = logError(function(arg0) {
        var ret = getObject(arg0).width;
        return ret;
    });
    imports.wbg.__wbg_height_89c0ee2a7b144330 = logError(function(arg0) {
        var ret = getObject(arg0).height;
        return ret;
    });
    imports.wbg.__wbg_set_54139e722a2749ff = handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    });
    imports.wbg.__wbg_width_979b596f39ba8319 = logError(function(arg0) {
        var ret = getObject(arg0).width;
        return ret;
    });
    imports.wbg.__wbg_get_40375c2067f479fc = logError(function(arg0, arg1) {
        var ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_length_8f15bbb4ecbf7e33 = logError(function(arg0) {
        var ret = getObject(arg0).length;
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_newnoargs_179d393e4626fcf7 = logError(function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_call_8487a9f580e47219 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_call_b5c358098632d7b2 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_now_07cc70e02e812d79 = logError(function() {
        var ret = Date.now();
        return ret;
    });
    imports.wbg.__wbg_new_b0b535e7b597e9c1 = logError(function() {
        var ret = new Object();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_then_c95977e365944fff = logError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_globalThis_a2669bee93faee43 = handleError(function() {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_self_eeabd9085c04fc17 = handleError(function() {
        var ret = self.self;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_window_f110c13310da2c8f = handleError(function() {
        var ret = window.window;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_global_a5584d717f4d6761 = handleError(function() {
        var ret = global.global;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_new_139e70222494b1ff = logError(function(arg0) {
        var ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_newwithbyteoffsetandlength_836859e5deb44d3f = logError(function(arg0, arg1, arg2) {
        var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_slice_41b1e2e12fabc528 = logError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).slice(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_length_2cfa674c2a529bc1 = logError(function(arg0) {
        var ret = getObject(arg0).length;
        _assertNum(ret);
        return ret;
    });
    imports.wbg.__wbg_set_d771848e3c7935bb = logError(function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    });
    imports.wbg.__wbg_newwithbyteoffsetandlength_a20c8edf0fedac40 = logError(function(arg0, arg1, arg2) {
        var ret = new Uint16Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_newwithbyteoffsetandlength_7b9a415096aef9c1 = logError(function(arg0, arg1, arg2) {
        var ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_buffer_e35e010c3ba9f945 = logError(function(arg0) {
        var ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_random_69f01e50b30c8d0a = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');
    imports.wbg.__wbg_set_c1d44124a051a5e7 = handleError(function(arg0, arg1, arg2) {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        _assertBoolean(ret);
        return ret;
    });
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'number' ? obj : undefined;
        if (!isLikeNone(ret)) {
            _assertNum(ret);
        }
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        _assertNum(ret);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        var ret = debugString(getObject(arg1));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_rethrow = function(arg0) {
        throw takeObject(arg0);
    };
    imports.wbg.__wbindgen_memory = function() {
        var ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper11595 = logError(function(arg0, arg1, arg2) {
        var ret = makeClosure(arg0, arg1, 297, __wbg_adapter_28);
        return addHeapObject(ret);
    });
    imports.wbg.__wbindgen_closure_wrapper11597 = logError(function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 295, __wbg_adapter_31);
        return addHeapObject(ret);
    });
    imports.wbg.__wbindgen_closure_wrapper11599 = logError(function(arg0, arg1, arg2) {
        var ret = makeClosure(arg0, arg1, 290, __wbg_adapter_34);
        return addHeapObject(ret);
    });
    imports.wbg.__wbindgen_closure_wrapper12533 = logError(function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 341, __wbg_adapter_37);
        return addHeapObject(ret);
    });

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    wasm.__wbindgen_start();
    return wasm;
}

export default init;

