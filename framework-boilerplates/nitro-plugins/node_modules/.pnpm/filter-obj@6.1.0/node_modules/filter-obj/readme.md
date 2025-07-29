# filter-obj

> Filter object keys and values into a new object

## Install

```sh
npm install filter-obj
```

## Usage

```js
import {includeKeys, excludeKeys} from 'filter-obj';

const object = {
	foo: true,
	bar: false
};

const newObject = includeKeys(object, (key, value) => value === true);
//=> {foo: true}

const newObject2 = includeKeys(object, ['bar']);
//=> {bar: false}

const newObject = excludeKeys(object, (key, value) => value === true);
//=> {bar: false}

const newObject3 = excludeKeys(object, ['bar']);
//=> {foo: true}
```

## API

### includeKeys(source, filter)
### includeKeys(source, keys)
### excludeKeys(source, filter)
### excludeKeys(source, keys)

#### source

Type: `object`

The source object to filter properties from.

#### filter

Type: `(sourceKey: string | symbol, sourceValue: unknown, source: object) => boolean`

A predicate function that determines whether a property should be filtered.

#### keys

Type: `Array<string | symbol> | Set<string | symbol>`

An array or [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) of property keys to be filtered.

## Related

- [map-obj](https://github.com/sindresorhus/map-obj) - Map object keys and values into a new object
