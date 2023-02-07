/**
 * @author Matthew Caruana Galizia <m@m.cg>
 * @license MIT: http://mattcg.mit-license.org/
 * @copyright Copyright (c) 2013, Matthew Caruana Galizia
 */

/*jshint node:true*/

'use strict';

var index = require('language-subtag-registry/data/json/index.json');
var registry = require('language-subtag-registry/data/json/registry.json');

class Subtag {
	static ERR_NONEXISTENT = 1;
	static ERR_TAG = 2;

	/**
	 * @param {string} subtag
	 * @param {string} type
	 */
	constructor (subtag, type) {
		var types, i, record;

		// Lowercase for consistency (case is only a formatting convention, not a standard requirement).
		subtag = subtag.toLowerCase();
		type = type.toLowerCase();

		function error (code, message) {
			var err;

			err = new Error(message);
			err.code = code;
			err.subtag = subtag;
			throw err;
		};

		types = index[subtag];
		if (!types) {
			error(Subtag.ERR_NONEXISTENT, 'Non-existent subtag \'' + subtag + '\'.');
		}

		i = types[type];
		if (!i && 0 !== i) {
			error(Subtag.ERR_NONEXISTENT, 'Non-existent subtag \'' + subtag + '\' of type \'' + type + '\'.');
		}

		record = registry[i];
		if (!record.Subtag) {
			error(Subtag.ERR_TAG, '\'' + subtag + '\' is a \'' + type + '\' tag.');
		}

		this.data = { subtag, record, type };
	}

	type () {
		return this.data.type;
	}

	descriptions () {
		// Every record has one or more descriptions (stored as an array).
		return this.data.record.Description;
	}

	preferred () {
		var type, preferred = this.data.record['Preferred-Value'];

		if (preferred) {
			type = this.data.type;
			if (type === 'extlang') {
				type = 'language';
			}

			return new Subtag(preferred, type);
		}

		return null;
	}

	script () {
		var script = this.data.record['Suppress-Script'];

		if (script) {
			return new Subtag(script, 'script');
		}

		return null;
	}

	scope () {
		return this.data.record.Scope || null;
	}

	deprecated () {
		return this.data.record.Deprecated || null;
	}

	added () {
		return this.data.record.Added;
	}

	comments () {
		// Comments don't always occur for records, so switch to an empty array if missing.
		return this.data.record.Comments || [];
	}

	format () {
		var subtag = this.data.subtag;

		switch (this.data.type) {
			case 'region':
				return subtag.toUpperCase();
			case 'script':
				return subtag[0].toUpperCase() + subtag.slice(1);
		}

		return subtag;
	}

	toString () {
		return this.format();
	}
}

module.exports = Subtag;
