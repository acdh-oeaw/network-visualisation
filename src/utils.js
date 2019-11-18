const toObj = (arr = {}) =>
  Array.isArray(arr)
    ? arr.reduce((acc, type) => {
        if (type.id) {
          acc[type.id] = type
        }
        return acc
      }, {})
    : arr

export const mergeTypes = (oldObj, newObj) => ({
  nodes: {
    ...toObj(oldObj.nodes),
    ...toObj(newObj.nodes),
  },
  edges: {
    ...toObj(oldObj.edges),
    ...toObj(newObj.edges),
  },
})
