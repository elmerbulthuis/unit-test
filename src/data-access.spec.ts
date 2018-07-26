import * as test from "blue-tape";
import { TestContext } from "./test-context";

test("addItem", async t => {
    const testContext = await TestContext.create();
    const { dal } = testContext;
    try {
        await dal.addItem("testing item", 10);

        const { count } = await dal.one(
            `SELECT COUNT(*) AS count FROM item`,
            [],
        );
        t.equal(count, 5);

    }
    finally {
        await testContext.dispose();
    }
});

test("removeItem", async t => {
    const testContext = await TestContext.create();
    const { dal } = testContext;
    try {
        await dal.removeItem(2);

        const { count } = await dal.one(
            `SELECT COUNT(*) AS count FROM item`,
            [],
        );
        t.equal(count, 3);
    }
    finally {
        await testContext.dispose();
    }
});

test("getItem", async t => {
    const testContext = await TestContext.create();
    const { dal } = testContext;
    try {
        const row = await dal.getItem(2);

        t.deepEqual(row, {
            id: 2,
            name: "test two",
            price: 725,
        });
    }
    finally {
        await testContext.dispose();
    }
});

test("allItems", async t => {
    const testContext = await TestContext.create();
    const { dal } = testContext;
    try {
        const rows = await dal.allItems();

        t.deepEqual(rows.length, 4);
    }
    finally {
        await testContext.dispose();
    }
});
