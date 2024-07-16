import { Database, MongoClient } from "https://deno.land/x/mongo/mod.ts";

class DatabaseClient {
    private client = new MongoClient();
    // @ts-ignore
    private db: Database;

    async connect(uri: string) {
        try {
            this.db =  await this.client.connect(uri);
            console.log('Database connected')
        } catch(e) {
            console.log(e)
        }
       
    }

    async initializeDatabase(collections: { [key: string]: string }) {
        if (!this.db) return;
       
        for (const [collectionName, jsonFilePath] of Object.entries(collections)) {
            const collection = this.db.collection(collectionName);
            const count = await collection.countDocuments();
            
            if (count === 0) {
                console.log('Initialize database collection: ', collectionName)
                const data = await Deno.readTextFile(jsonFilePath);
                const documents = JSON.parse(data);
                
                if (Array.isArray(documents)) {
                    await collection.insertMany(documents);
                } else {
                    await collection.insertOne(documents);
                }
            }
        }
        
    }

    async findOne<T>(collectionName: string, filter: any) {
        if (!this.db) return null
        const collection = this.db?.collection(collectionName);
        return await collection.findOne(filter) as Promise<T>;
    }

    async findAll<T>(collectionName: string, filter: any = {}) {
        if (!this.db) return null
        const collection = this.db.collection(collectionName);
        return await collection.find(filter) as unknown as T[];
    }

    async insertOne(collectionName: string, data: any) {
        if (!this.db) return null
        const collection = this.db.collection(collectionName);
        const { $oid } = await collection.insertOne(data);
        return $oid;
    }

    async updateOne(collectionName: string, filter: any, update: any) {
        if (!this.db) return null
        const collection = this.db.collection(collectionName);
        return await collection.updateOne(filter, update);
    }

    async deleteOne(collectionName: string, filter: any) {
        if (!this.db) return null
        const collection = this.db.collection(collectionName);
        return await collection.deleteOne(filter);
    }
}

export const dbClient = new DatabaseClient()