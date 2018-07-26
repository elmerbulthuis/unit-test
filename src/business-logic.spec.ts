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
