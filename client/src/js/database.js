import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
// putDb
export const putDb = async (content) => {
const db = await openDB('jate', 1);
// might need to take out return.
return await db.transaction('jate', 'readwrite').objectStore('jate').put({id:1, value:content});
}


// TODO: Add logic for a method that gets all the content from the database
// getDb
export const getDb = async () => {
const db = await openDB('jate', 1);
return await db.transaction('jate','readonly').objectStore('jate').getAll().value;
}

initdb();
