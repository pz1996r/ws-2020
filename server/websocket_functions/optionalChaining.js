module.exports = function optionalChaining(fn) {
  if (typeof fn !== "function")
    throw new Error("OptionalChaining require function as argument !!!");
  try {
    return fn();
  } catch (e) {
    return undefined;
  }
};
