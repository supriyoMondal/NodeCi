const Page = require('./helpers/page');

let page;


beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
})

afterEach(async () => {
    await page.close();
})

test("login", async () => {
    await page.login();
})

describe('when logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    })
    test('can see blog create form', async () => {
        const label = await page.getContentsOf('.title label');
        expect(label).toEqual('Blog Title');
    })

    describe('using valid input', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'test title')
            await page.type('.content input', 'test content')
            await page.click('button.teal.btn-flat');
        })
        test('submitting takes user to review screen', async () => {
            const text = await page.getContentsOf('form h5');
            expect(text).toEqual("Please confirm your entries")
        })
        test('submitting saving adds blogs to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            const titleText = await page.getContentsOf('.card-title');
            const contentText = await page.getContentsOf('p');

            expect(titleText).toEqual('test title')
            expect(contentText).toEqual('test content')
        })

    })


    describe('using in valid inputs', async () => {
        beforeEach(async () => {
            await page.click('button.teal.btn-flat');
        })
        test("Form showa a error message", async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentsError = await page.getContentsOf('.content .red-text');
            expect(titleError).toEqual("You must provide a value");
            expect(contentsError).toEqual("You must provide a value");
        })
    })

})
describe('when not logged in', async () => {
    test.only('User cannot create blog posts', async () => {
        let res = await page.post('/api/blog', { title: "test", content: "test" });
        expect(res.error).toEqual("You must log in!")
    })
    test('no list of blogs', async () => {
        let res = await page.get('/api/blogs');
        expect(res.error).toEqual("You must log in!")
    })

})