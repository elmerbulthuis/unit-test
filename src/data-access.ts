import { resolveCname } from "dns";
import * as sqlite from "sqlite3";
import * as util from "util";

export const TooManyRowsError = new Error("too many rows");

export class DataAccessLayer {

    public constructor(
        private db: sqlite.Database,
    ) {
    }

    public async execute(
        sql: string,
        params: Array<string | number>,
    ): Promise<sqlite.RunResult> {
        return new Promise<sqlite.RunResult>((resolve, reject) => {
            const { db } = this;
            db.run(sql, params, function(this: sqlite.RunResult, err: Error) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }
    public async many<T extends object = any>(
        sql: string,
        params: Array<string | number>,
    ): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const { db } = this;
            db.all(sql, params, function(this: sqlite.Statement, err: Error, rows: T[]) {
                if (err) reject(err);
                else resolve(rows);
            });
        });

    }
    public async one<T extends object = any>(
        sql: string,
        params: Array<string | number>,
    ): Promise<T | null> {
        const rows = await this.many(sql, params);
        if (rows.length < 1) return null;
        if (rows.length > 1) throw TooManyRowsError;

        const [row] = rows;
        return row;
    }
    public async addItem(name: string, price: number) {
        const result = await this.execute(
            `
INSERT INTO item(name, price)
VALUES (?, ?);
`,
            [name, price],
        );

        return result.lastID;
    }
    public async removeItem(id: number) {
        await this.execute(
            `DELETE FROM item WHERE id = ?;`,
            [id],
        );
    }
    public async getItem(id: number) {
        const row = await this.one(
            `SELECT * FROM item WHERE id = ?;`,
            [id],
        );
        return row;
    }
    public async allItems() {
        const rows = await this.many(
            `
SELECT *
FROM item
ORDER BY name
;`,
            [],
        );
        return rows;
    }
}
