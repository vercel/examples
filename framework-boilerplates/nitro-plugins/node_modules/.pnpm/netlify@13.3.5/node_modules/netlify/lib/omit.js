export default function omit(obj, keys) {
    const shallowCopy = { ...obj };
    for (const key of keys) {
        delete shallowCopy[key];
    }
    return shallowCopy;
}
