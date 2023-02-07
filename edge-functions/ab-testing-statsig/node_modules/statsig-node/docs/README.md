<a name="statsig"></a>

## statsig

The global statsig class for interacting with gates, configs, experiments configured in the statsig developer console. Also used for event logging to view in the statsig console, or for analyzing experiment impacts using pulse.

**Kind**: global constant

- [statsig](#statsig)
  - [.initialize(secretKey, [options])](#statsig.initialize) ⇒ <code>Promise.&lt;void&gt;</code>
  - [.checkGate(user, gateName)](#statsig.checkGate) ⇒ <code>Promise.&lt;boolean&gt;</code>
  - [.getConfig(user, configName)](#statsig.getConfig) ⇒ [<code>Promise.&lt;DynamicConfig&gt;</code>](#DynamicConfig)
  - [.getExperiment(user, experimentName)](#statsig.getExperiment) ⇒ [<code>Promise.&lt;DynamicConfig&gt;</code>](#DynamicConfig)
  - [.logEvent(user, eventName, value, metadata)](#statsig.logEvent)
  - [.shutdown()](#statsig.shutdown)

<a name="statsig.initialize"></a>

### statsig.initialize(secretKey, [options]) ⇒ <code>Promise.&lt;void&gt;</code>

Initializes the statsig server SDK. This must be called before checking gates/configs or logging events.

**Kind**: static method of [<code>statsig</code>](#statsig)  
**Returns**: <code>Promise.&lt;void&gt;</code> - - a promise which rejects only if you fail to provide a proper SDK Key  
**Throws**:

- Error if a Server Secret Key is not provided

| Param     | Type                                           | Default         | Description                                                                                                                                               |
| --------- | ---------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| secretKey | <code>string</code>                            |                 | The secret key for this project from the statsig console. Secret keys should be kept secure on the server side, and not used for client-side integrations |
| [options] | [<code>StatsigOptions</code>](#StatsigOptions) | <code>{}</code> | manual sdk configuration for advanced setup                                                                                                               |

<a name="statsig.checkGate"></a>

### statsig.checkGate(user, gateName) ⇒ <code>Promise.&lt;boolean&gt;</code>

Check the value of a gate configured in the statsig console

**Kind**: static method of [<code>statsig</code>](#statsig)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - The value of the gate for the user. Gates are off (return false) by default  
**Throws**:

- Error if initialize() was not called first
- Error if the gateName is not provided or not a non-empty string

| Param    | Type                                     | Description                           |
| -------- | ---------------------------------------- | ------------------------------------- |
| user     | [<code>StatsigUser</code>](#StatsigUser) | the user to check this gate value for |
| gateName | <code>string</code>                      | the name of the gate to check         |

<a name="statsig.getConfig"></a>

### statsig.getConfig(user, configName) ⇒ [<code>Promise.&lt;DynamicConfig&gt;</code>](#DynamicConfig)

Checks the value of a config for a given user

**Kind**: static method of [<code>statsig</code>](#statsig)  
**Returns**: [<code>Promise.&lt;DynamicConfig&gt;</code>](#DynamicConfig) - - the config for the user  
**Throws**:

- Error if initialize() was not called first
- Error if the configName is not provided or not a non-empty string

| Param      | Type                                     | Description                                |
| ---------- | ---------------------------------------- | ------------------------------------------ |
| user       | [<code>StatsigUser</code>](#StatsigUser) | the user to evaluate for the dyamic config |
| configName | <code>string</code>                      | the name of the dynamic config to get      |

<a name="statsig.getExperiment"></a>

### statsig.getExperiment(user, experimentName) ⇒ [<code>Promise.&lt;DynamicConfig&gt;</code>](#DynamicConfig)
Checks the value of a config for a given user

**Kind**: static method of [<code>statsig</code>](#statsig)  
**Returns**: [<code>Promise.&lt;DynamicConfig&gt;</code>](#DynamicConfig) - - the experiment for the user, represented by a Dynamic Config  
**Throws**:

- Error if initialize() was not called first
- Error if the experimentName is not provided or not a non-empty string


| Param | Type | Description |
| --- | --- | --- |
| user | [<code>StatsigUser</code>](#typedefs.StatsigUser) | the user to evaluate for the dyamic config |
| experimentName | <code>string</code> | the name of the experiment to get |

<a name="statsig.logEvent"></a>

### statsig.logEvent(user, eventName, value, metadata)

Log an event for data analysis and alerting or to measure the impact of an experiment

**Kind**: static method of [<code>statsig</code>](#statsig)  
**Throws**:

- Error if initialize() was not called first

| Param     | Type                                       | Description                                                                                     |
| --------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| user      | [<code>StatsigUser</code>](#StatsigUser)   | the user associated with this event                                                             |
| eventName | <code>string</code>                        | the name of the event (name = Purchase)                                                         |
| value     | <code>string</code> \| <code>number</code> | the value associated with the event (value = 10)                                                |
| metadata  | <code>Record.&lt;string, string&gt;</code> | other attributes associated with this event (metadata = {item_name: 'banana', currency: 'USD'}) |

<a name="statsig.shutdown"></a>

### statsig.shutdown()

Informs the statsig SDK that the server is closing or shutting down
so the SDK can clean up internal state

**Kind**: static method of [<code>statsig</code>](#statsig)

<a name="DynamicConfig"></a>

## DynamicConfig

Returns the data for a DynamicConfig in the statsig console via typed get functions

**Kind**: global class

- [DynamicConfig](#DynamicConfig)
  - [.get<T>([key], [defaultValue])](#DynamicConfig+get) ⇒ <code>T</code> \| <code>null</code>
  - [.getValue([key], [defaultValue])](#DynamicConfig+getValue) ⇒ <code>boolean</code> \| <code>number</code> \| <code>string</code> \| <code>object</code> \| <code>Array.&lt;any&gt;</code> \| <code>null</code>

<a name="DynamicConfig+get"></a>

### dynamicConfig.get<T>([key], [defaultValue]) ⇒ <code>T</code> \| <code>null</code>

A generic, type sensitive getter, which returns the value at the given index in the config if it matches the type of the default value,
and returns the default value otherwise

**Kind**: instance method of [<code>DynamicConfig</code>](#DynamicConfig)

| Param          | Type                                | Description                                                                                                                            |
| -------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [key]          | <code>string</code>                 | The index of the config to check                                                                                                       |
| [defaultValue] | <code>T</code> \| <code>null</code> | The default value of the parameter to return in cases where the parameter is not found or does not match the type of the default value |

<a name="DynamicConfig+getValue"></a>

### dynamicConfig.getValue([key], [defaultValue]) ⇒ <code>boolean</code> \| <code>number</code> \| <code>string</code> \| <code>object</code> \| <code>Array.&lt;any&gt;</code> \| <code>null</code>

With no parameters, returns the JSON object representing this config (or null if not found)
With a key parameter, returns the value at that index in the JSON object, or null if not found
With a key and a defaultValue, returns the value at that index, or the provided default if not found

**Kind**: instance method of [<code>DynamicConfig</code>](#DynamicConfig)

| Param          | Type                                                                                                                                             | Default       | Description                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | -------------------------------------------------------------------------------------- |
| [key]          | <code>string</code>                                                                                                                              |               | The index of the config to check                                                       |
| [defaultValue] | <code>boolean</code> \| <code>number</code> \| <code>string</code> \| <code>object</code> \| <code>Array.&lt;any&gt;</code> \| <code>null</code> | <code></code> | The default value of the parameter to return in cases where the parameter is not found |

## Input Types: StatsigUser and StatsigOptions

- [StatsigUser](#StatsigUser) : <code>Object.&lt;string, \*&gt;</code>
- [StatsigOptions](#StatsigOptions) : <code>Object.&lt;string, \*&gt;</code>

<a name="StatsigUser"></a>

### StatsigUser : <code>Object.&lt;string, \*&gt;</code>

An object of properties relating to a user

**Properties**

| Name            | Type                                                                                |
| --------------- | ----------------------------------------------------------------------------------- |
| [userID]        | <code>string</code> \| <code>number</code>                                          |
| [email]         | <code>string</code>                                                                 |
| [ip]            | <code>string</code>                                                                 |
| [userAgent]     | <code>string</code>                                                                 |
| [country]       | <code>string</code>                                                                 |
| [locale]        | <code>string</code>                                                                 |
| [appVersion]    | <code>string</code>                                                                 |
| [custom]        | <code>Object.&lt;string, (string\|number\|boolean\|Array.&lt;string&gt;)&gt;</code> |

<a name="StatsigOptions"></a>

### StatsigOptions : <code>Object.&lt;string, \*&gt;</code>

An object of properties for initializing the sdk with advanced options

**Properties**

| Name                   | Type                                                       |
| ---------------------- | ---------------------------------------------------------- |
| [api]                  | <code>string</code>                                        |
| [environment]          | <code>Object.&lt;string, string&gt;</code>                 | 
| [bootstrapValues]      | <code>string</code>                                        | 
| [rulesUpdatedCallback] | [<code>rulesUpdatedCallback</code>](#rulesUpdatedCallback) | 


**Kind**: static method of [<code>statsig</code>](#statsig)  
<a name="rulesUpdatedCallback"></a>

## rulesUpdatedCallback ⇒ <code>void</code>
Callback function to be executed when the rules have been updated.

**Kind**: global typedef  

| Param       | Type                |
| ----------- | ------------------- |
| [rulesJSON] | <code>string</code> | 
| [time]      | <code>number</code> | 