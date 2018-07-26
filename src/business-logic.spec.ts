import { ok } from "assert";
import * as test from "blue-tape";
import { TestContext } from "./test-context";

test("bll.addItem", async t => {
    const testContext = await TestContext.create();
    const { dal, bll } = testContext;
    try {
        const id = await bll.addItem("testing item", 1);

        const row = await dal.selectItem(id);
        t.deepEqual(row, {
            id,
            name: "testing item",
            price: 100,
        });
    }
    finally {
        await testContext.dispose();
    }
});

test("bll.removeItem", async t => {
    const testContext = await TestContext.create();
    const { dal, bll } = testContext;
    try {
        await bll.removeItem(3);

        const rows = await dal.selectAllItems();
        t.equal(rows.length, 3);
    }
    finally {
        await testContext.dispose();
    }
});

test("bll.getItem", async t => {
    const testContext = await TestContext.create();
    const { dal, bll } = testContext;
    try {
        const item = await bll.getItem(3);

        t.deepEqual(item, {
            id: 3,
            name: "test three",
            price: 1.20,
            vat: 0.228,
        });
    }
    finally {
        await testContext.dispose();
    }
});

test("bll.itemList", async t => {
    const testContext = await TestContext.create();
    const { dal, bll } = testContext;
    try {
        const list = await bll.itemList();

        t.equal(list.length, 4);
        list.reduce((previousItem, item) => {
            t.ok(previousItem.name < item.name);
            return item;
        });
    }
    finally {
        await testContext.dispose();
    }
});
