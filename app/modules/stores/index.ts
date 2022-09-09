// We use react-admin store to avoid using another store library.
// We only need a simple store storage, as developed here by react-admin, to handle preferences that are sync between reload and components.
// https://github.com/marmelab/react-admin/tree/master/packages/ra-core/src/store
// we copied the react-admin code to avoid conflicts on the store between the react-admin usage and our usage.
// You can look at the README to find out why this is a good solution for react-admin (and us) to manage the data.
export * from './localStorageStore';
export * from './memoryStore';
export * from './StoreContext';
export * from './StoreContextProvider';
export * from './StoreSetter';
export * from './types';
export * from './useStore';
export * from './useStoreContext';
export * from './useRemoveFromStore';
export * from './useResetStore';
