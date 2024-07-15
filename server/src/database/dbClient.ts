import { Database, MongoClient } from "https://deno.land/x/mongo/mod.ts";

export class DatabaseClient {
    private client = new MongoClient();
    // @ts-ignore
    private db: Database;
    constructor(dbUri: string) {
        this.connect(dbUri)
    }

    async connect(uri: string) {
        try {
            this.db =  await this.client.connect(uri);
        } catch(e) {
            console.log(e)
        }
       
    }

    async initDatabaseFromJsonFile(data: any) {
        console.log(data)
        const { missions, flightObjectTypes } = data;
        

        const missionsCollection = this.db.collection("missions");
        const missionsInsertResult = await missionsCollection.insertMany(missions);
        console.log(`Inserted ${missionsInsertResult.insertedCount} documents into missions collection`);

        const flightObjectTypesCollection = this.db.collection("flightObjectTypes");
        const flightObjectTypesInsertResult = await flightObjectTypesCollection.insertMany(flightObjectTypes);
        console.log(`Inserted ${flightObjectTypesInsertResult.insertedCount} documents into flightObjectTypes collection`);
    }

    async findOne(collectionName: string, filter: any) {
        if (!this.db) return null
        const collection = this.db?.collection(collectionName);
        return await collection.findOne(filter);
    }

    async findAll(collectionName: string, filter: any = {}) {
        if (!this.db) return null
        const collection = this.db.collection(collectionName);
        return await collection.find(filter);
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
