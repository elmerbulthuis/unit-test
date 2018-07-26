import * as test from "blue-tape";
import { TestContext } from "./test-context";

test("dal.insertItem", async t => {
    const testContext = await TestContext.create();
    const { dal } = testContext;
    try {
        await dal.insertItem("testing item", 10);

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

test("dal.deleteItem", async t => {
    const testContext = await TestContext.create();
    const { dal } = testContext;
    try {
        await dal.deleteItem(2);

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

test("dal.selectItem", async t => {
    const testContext = await TestContext.create();
    const { dal } = testContext;
    try {
        const row = await dal.selectItem(2);

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

test("dal.selectAllItems", async t => {
    const testContext = await TestContext.create();
    const { dal } = testContext;
    try {
        const rows = await dal.selectAllItems();

        t.deepEqual(rows.length, 4);
    }
    finally {
        await testContext.dispose();
    }
});
