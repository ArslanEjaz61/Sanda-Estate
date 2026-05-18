import mongoose from 'mongoose';

async function check() {
    const db1 = 'mongodb://127.0.0.1:27017/sandaestatedubai';
    const db2 = 'mongodb://127.0.0.1:27017/sanda-estate-dubai';
    
    for (let uri of [db1, db2]) {
        try {
            const conn = await mongoose.createConnection(uri).asPromise();
            const count = await conn.collection('areas').countDocuments();
            console.log(`URI: ${uri} - Count: ${count}`);
            await conn.close();
        } catch (e) {
            console.log(`Error connecting to ${uri}`);
        }
    }
    process.exit(0);
}

check();
