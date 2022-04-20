/**
 * @property text : text
 * 
 * @Cow
 * @property f : cow name
 * @property r : random selection
 * 
 * @Face
 * @property T : Tongue
 * @property e : eyes
 * 
 * @Modes
 * @property b : borg 
 * @property d : dead
 * @property g : greedy
 * @property p : paranoia
 * @property s : stoned
 * @property t : tired
 * @property w : wired
 * @property y : youthful
 */
export interface IOptions {
    text: string,
    // cow
    f?: string, // cow name
    r?: boolean, // random mode
    // face
    e?: string, // eyes
    T?: string, // tongue
    // modes
    b?: boolean, // borg 
    d?: boolean, // dead
    g?: boolean, // greedy
    p?: boolean, // paranoia
    s?: boolean, // stoned
    t?: boolean, // tired
    w?: boolean, // wired
    y?: boolean, // youthful
}

type callback_type = (error: NodeJS.ErrnoException, cow_names: string[]) => void;

/**
 * @param callback
 * @returns a list of cow names from the cows folder without the .cow extension.
 * @example
 * ```
 * function get_cows(error: NodeJS.ErrnoException, cow_names: Array<string>): void {
 *    if (error) {
 *        console.log(`Error getting cow names: ${error.message}`);
 *    }
 *    else if (cow_names) {
 *        console.log(`Number of cows available: ${cow_names.length}`);
 *    }
 *  }
 * 
 * cowsay.list(get_cows);
 * ```
 */
export function list(callback: callback_type): Promise<string[]>;

/**
 * @param options
 * ## Face :
 * Either choose a mode (set the value as true) **_or_**
 * set your own defined eyes and tongue to `e` and `T`.
 * - ### `e` : eyes
 * - ### `T` : tongue
 * 
 * ## Cow :
 * Either specify a cow name (e.g. "fox") **_or_**
 * set the value of `r` to true which selects a random cow.
 * - ### `r` : random selection
 * - ### `f` : cow name - from `cows` folder
 * 
 * ## Modes :
 * Modes are just ready-to-use faces, here's their list:
 * - #### `b` : borg
 * - #### `d` : dead      
 * - #### `g` : greedy
 * - #### `p` : paranoia
 * - #### `s` : stoned
 * - #### `t` : tired
 * - #### `w` : wired
 * - #### `y` : youthful
 * 
 * @example
 * ```
 * // custom cow and face
 * cowsay.say({
 *     text: 'Hello world!',
 *     e: '^^', // eyes
 *     T: 'U ', // tongue
 *     f: 'USA' // name of the cow from `cows` folder
 * })
 * 
 * // using a random cow
 * cowsay.say({
 *     text: 'Hello world!',
 *     e: 'xx', // eyes
 *     r: true, // random mode - use a random cow.
 * })
 * 
 * // using a mode
 * cowsay.say({
 *     text: 'Hello world!',
 *     y: true, // using y mode - youthful mode
 * })
 * ```
 */
export function say(options: IOptions): string;

/**
 * @param options
 * ## Face :
 * Either choose a mode (set the value as true) **_or_**
 * set your own defined eyes and tongue to `e` and `T`.
 * - ### `e` : eyes
 * - ### `T` : tongue
 * 
 * ## Cow :
 * Either specify a cow name (e.g. "fox") **_or_**
 * set the value of `r` to true which selects a random cow.
 * - ### `r` : random selection
 * - ### `f` : cow name - from `cows` folder
 * 
 * ## Modes :
 * Modes are just ready-to-use faces, here's their list:
 * - #### `b` : borg
 * - #### `d` : dead      
 * - #### `g` : greedy
 * - #### `p` : paranoia
 * - #### `s` : stoned
 * - #### `t` : tired
 * - #### `w` : youthful
 * - #### `y` : wired
 * 
 * @example
 * ```
 * // custom cow and face
 * cowsay.think({
 *     text: 'Hello world!',
 *     e: '^^', // eyes
 *     T: 'U ', // tongue
 *     f: 'USA' // name of the cow from `cows` folder
 * })
 * 
 * // using a random cow
 * cowsay.think({
 *     text: 'Hello world!',
 *     e: 'xx', // eyes
 *     r: true, // random mode - use a random cow.
 * })
 * 
 * // using a mode
 * cowsay.think({
 *     text: 'Hello world!',
 *     y: true, // using y mode - youthful mode
 * })
 * ```
 */
export function think(options: IOptions): string;
