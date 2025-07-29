// import type nodeZlib from "node:zlib";
export const codes = {
	"0": "Z_OK",
	"1": "Z_STREAM_END",
	"2": "Z_NEED_DICT",
	Z_OK: 0,
	Z_STREAM_END: 1,
	Z_NEED_DICT: 2,
	Z_ERRNO: -1,
	Z_STREAM_ERROR: -2,
	Z_DATA_ERROR: -3,
	Z_MEM_ERROR: -4,
	Z_BUF_ERROR: -5,
	Z_VERSION_ERROR: -6,
	"-1": "Z_ERRNO",
	"-2": "Z_STREAM_ERROR",
	"-3": "Z_DATA_ERROR",
	"-4": "Z_MEM_ERROR",
	"-5": "Z_BUF_ERROR",
	"-6": "Z_VERSION_ERROR"
};
