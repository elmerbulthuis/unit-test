import { DataAccessLayer, ItemRow } from "./data-access";

export interface ItemModel {
    id: number;
    name: string;
    price: number;
    vat: number;
}

export class BusinessLogicLayer {

    public constructor(
        private dal: DataAccessLayer,
    ) {
    }

    public async addItem(name: string, price: number) {
        const { dal } = this;
        const id = await dal.insertItem(name, price * 100);
        return id;
    }

    public async removeItem(id: number) {
        const { dal } = this;
        await dal.deleteItem(id);
    }

    public async getItem(id: number) {
        const { dal } = this;
        const row = await dal.selectItem(id);
        return itemRowToModel(row);
    }

    public async allItems() {
        const { dal } = this;
        const rows = await dal.selectAllItems();
        return rows.
            sort((a, b) => {
                if (a.name > b.name) return +1;
                if (a.name < b.name) return -1;
                return 0;
            }).
            map(itemRowToModel);
    }

}

function itemRowToModel(row: ItemRow | null) {
    if (row === null) return null;

    const model: ItemModel = {
        id: row.id,
        name: row.name,
        price: row.price / 100,
        vat: 19 * (row.price / 100) / 100,
    };

    return model;
}
