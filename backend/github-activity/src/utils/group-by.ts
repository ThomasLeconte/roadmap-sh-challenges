export function groupBy<T extends Object>(key: string, array: T[] | undefined): Map<string, T[]> {
    const result = new Map<any, T[]>();
    if(!array) throw new Error("Array is undefined!");

    const getValueByKey = (key: string, object: T) => {
        if(key) {
            if(object.hasOwnProperty(key)) {
                return (object as any)[key];
            } else {
                throw new Error(`Object of type "${object.constructor.name}" does not have "${key}" property !`)
            }
        } else {
            throw new Error("Key is null!")
        }
    }

    array.forEach(e => {
        let keyTree = key.split(".");
        let value = e;
        while(keyTree.length > 1) {
            const key = keyTree.shift();
            if(!key) throw new Error("Key not found!")
            value = getValueByKey(key, value);
        }

        value = getValueByKey(keyTree[0], value)

        if(!result.has(value)) result.set(value, []);
        result.get(value)?.push(e);
    })

    return result;
}