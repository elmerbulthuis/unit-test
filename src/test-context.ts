import * as sqlite from "sqlite3";
import * as util from "util";
import { DataAccessLayer } from "./data-access";

export class TestContext {

    public static async create() {
        const instance = new this();
        await instance.initialize();
        return instance;
    }

    public db = new sqlite.Database(":memory:");
    public dal = new DataAccessLayer(this.db);

    public async initialize() {
        const { dal } = this;
        await dal.execute(`
CREATE TABLE item (
    id INTEGER PRIMARY KEY ASC,
    name TEXT NOT NULL,
    price INTEGER NOT NULL
);
`, []);
        await dal.execute(`
INSERT INTO item(id, name, price)
VALUES(1, "test one", 350);
`, []);
        await dal.execute(`
INSERT INTO item(id, name, price)
VALUES(2, "test two", 725);
`, []);
        await dal.execute(`
INSERT INTO item(id, name, price)
VALUES(3, "test three", 120);
`, []);
        await dal.execute(`
INSERT INTO item(id, name, price)
VALUES(4, "test four", 250);
`, []);
    }

    public async dispose() {
        const { db } = this;
        const close = util.promisify(db.close.bind(db));
        await close();
    }
}
