const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory')
class CustomPage {

    constructor(page, browser) {
        this.page = page;
        this.browser = browser
    }

    get(path) {
        return this.page.evaluate(
            (_path) => {
                return fetch(_path, {
                    method: "GET",
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
            }, path)
    }
    post(path, data) {
        return this.page.evaluate(
            (_path, _data) => {

                return fetch(_path, {
                    method: "POST",
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_data)
                }).then(res => res.json())

            }, path, data)
    }

    async getContentsOf(selector) {
        return await this.page.$eval(selector, el => el.innerHTML);
    }
    close() {
        this.browser.close();
    }
    async login() {
        const { session, sig } = sessionFactory();
        await this.page.setCookie({ name: "session", value: session });
        await this.page.setCookie({ name: "session.sig", value: sig });
        await this.page.goto('localhost:3000/blogs');
        let matcher = 'a[href="/auth/logout"]';
        await this.page.waitFor(matcher);
    }

    static async build() {
        const browser = await puppeteer.launch({
            headless: false
        })
        const page = await browser.newPage();
        const customPage = new CustomPage(page, browser);

        return new Proxy(customPage, {
            get: function (target, property) {
                return customPage[property] || page[property] || browser[property];
            }
        })
    }


}

module.exports = CustomPage;