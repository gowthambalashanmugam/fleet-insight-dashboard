import { Injectable } from '@angular/core';
import { SEED_VEHICLES, SEED_TRIPS, SEED_ALERTS } from '../data/seed-data';

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  private readonly DB_NAME = 'fleet-pulse-db';
  private readonly DB_VERSION = 3;
  private readonly ready: Promise<IDBDatabase>;

  constructor() {
    this.ready = this.initDb();
  }

  private initDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this browser'));
        return;
      }
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;
        // Fall-through switch for versioned migrations
        switch (oldVersion) {
          case 0:
            db.createObjectStore('vehicles', { keyPath: 'id' });
            db.createObjectStore('trips', { keyPath: 'id' });
            db.createObjectStore('alerts', { keyPath: 'id' });
            break;
          case 1: {
            // v2: Clear alerts store to re-seed with updated schema (title field added)
            const tx1 = (event.target as IDBOpenDBRequest).transaction!;
            const alertStore1 = tx1.objectStore('alerts');
            alertStore1.clear();
            break;
          }
          case 2: {
            // v3: Force re-seed alerts with complete data (title + rich messages)
            const tx2 = (event.target as IDBOpenDBRequest).transaction!;
            const alertStore2 = tx2.objectStore('alerts');
            alertStore2.clear();
            break;
          }
        }
      };

      request.onsuccess = async (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        try {
          await this.seedStoreIfEmpty(db, 'vehicles', SEED_VEHICLES);
          await this.seedStoreIfEmpty(db, 'trips', SEED_TRIPS);
          await this.seedStoreIfEmpty(db, 'alerts', SEED_ALERTS);
          resolve(db);
        } catch (err) {
          reject(err);
        }
      };

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
      };
    });
  }

  private seedStoreIfEmpty(db: IDBDatabase, storeName: string, data: unknown[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const countReq = store.count();
      countReq.onsuccess = () => {
        if (countReq.result > 0) {
          resolve(); // Store already has data, skip seeding
          return;
        }
        // Store is empty, seed it
        const writeTx = db.transaction(storeName, 'readwrite');
        const writeStore = writeTx.objectStore(storeName);
        for (const record of data) {
          writeStore.put(record);
        }
        writeTx.oncomplete = () => resolve();
        writeTx.onerror = () => reject(new Error(`Failed to seed ${storeName}: ${writeTx.error?.message}`));
      };
      countReq.onerror = () => reject(new Error(`Failed to count ${storeName}: ${countReq.error?.message}`));
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.ready;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(new Error(`getAll failed on ${storeName}: ${request.error?.message}`));
    });
  }

  async getById<T>(storeName: string, id: string): Promise<T | undefined> {
    const db = await this.ready;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(new Error(`getById failed on ${storeName}: ${request.error?.message}`));
    });
  }

  async put<T>(storeName: string, record: T): Promise<IDBValidKey> {
    const db = await this.ready;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(record);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`put failed on ${storeName}: ${request.error?.message}`));
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    const db = await this.ready;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`delete failed on ${storeName}: ${request.error?.message}`));
    });
  }
}
