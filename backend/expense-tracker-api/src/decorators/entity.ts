// when target is a class, it will define a new method on the class prototype

export function Entity() {
  return function (target: any) {
    target.prototype.deserialize = function () {
        const instance = new target();
        Object.assign(instance, this);
        return instance;
    };
  };
}