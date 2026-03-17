function deepClone(value, weakMap = new WeakMap()) {
    // Примитивы
    if (value === null || typeof value !== 'object') {
        return value;
    }

    // Циклические ссылки
    if (weakMap.has(value)) {
        return weakMap.get(value);
    }

    // Date
    if (value instanceof Date) {
        return new Date(value);
    }

    // Map
    if (value instanceof Map) {
        const result = new Map();
        weakMap.set(value, result);
        value.forEach((v, k) => {
            result.set(deepClone(k, weakMap), deepClone(v, weakMap));
        });
        return result;
    }

    // Set
    if (value instanceof Set) {
        const result = new Set();
        weakMap.set(value, result);
        value.forEach(v => {
            result.add(deepClone(v, weakMap));
        });
        return result;
    }

    // Array
    if (Array.isArray(value)) {
        const result = [];
        weakMap.set(value, result);
        value.forEach((item, index) => {
            result[index] = deepClone(item, weakMap);
        });
        return result;
    }

    // Object с прототипом
    const proto = Object.getPrototypeOf(value);
    const result = Object.create(proto);

    weakMap.set(value, result);

    // Копируем все свойства, включая символы
    const keys = Reflect.ownKeys(value);

    keys.forEach(key => {
        const desc = Object.getOwnPropertyDescriptor(value, key);

        if (desc.get || desc.set) {
            Object.defineProperty(result, key, desc);
        } else {
            desc.value = deepClone(value[key], weakMap);
            Object.defineProperty(result, key, desc);
        }
    });

    return result;
}

module.exports = deepClone;


// ================= DEMO =================

if (require.main === module) {
    const obj = {
        name: 'Test',
        date: new Date(),
        arr: [1, { a: 2 }],
        map: new Map([[{ x: 1 }, 'value']]),
        set: new Set([1, 2, 3]),
        fn: function () { return 'hello'; },
        [Symbol('id')]: 123
    };

    obj.self = obj; // циклическая ссылка

    const clone = deepClone(obj);

    console.log('Original:', obj);
    console.log('Clone:', clone);
    console.log('Different refs:', obj !== clone);
    console.log('Nested different:', obj.arr[1] !== clone.arr[1]);
}
