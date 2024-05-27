type KeyValue = [string, any];
type KeyValueIterable = Iterable<KeyValue>;

export const getObjectFromIterator = (
  iterable: KeyValueIterable
): Record<string, any> => {
  return Object.fromEntries(iterable);
};
