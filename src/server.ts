import * as mongoose from 'mongoose';
import { config } from './config/config';
import ExpressApp from './config/express';

let db = mongoose.connect(config.db.uri, config.db.options, (err) => {
    if (err) {
        console.error('Could not connect to MongoDB!');
        console.error(err);
    }
});


let app = new ExpressApp(db);

app.listen(config.port);