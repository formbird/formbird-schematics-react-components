const anyWindow: any = window;
export const changedDocumentService = (anyWindow.FormbirdServiceInjector).get('ChangedDocumentService');
export const searchService = (anyWindow.FormbirdServiceInjector).get('SearchService');
export const keyValueStorageService = (anyWindow.FormbirdServiceInjector).get('KeyValueStorageService');