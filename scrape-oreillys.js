const puppeteer = require("puppeteer");
const chalk = require("chalk");
let fs = require("fs");

const error = chalk.bold.red;
const success = chalk.keyword("green");


(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.oreilly.com/search/?query=' +
        '&extended_publisher_data=true' +
        '&highlight=true' +
        '&include_assessments=false' +
        '&include_case_studies=true' +
        '&include_courses=true' +
        '&include_orioles=true' +
        '&include_playlists=true' +
        '&include_collections=true' +
        '&include_notebooks=true' +
        '&is_academic_institution_account=false' +
        '&source=user' +
        '&formats=book' +
        '&publishers=O%27Reilly%20Media%2C%20Inc.' +
        '&sort=date_added' +
        '&facet_json=true' +
        '&include_scenarios=true' +
        '&include_sandboxes=true' +
        '&json_facets=false' +
        '&page=0' )


    const result = await page.evaluate(() => {
        let search_results = document.querySelector('#main > div > header > section.Info--Y9eEH > h3').textContent

        const regex = /of (\d+)/i;
        let total_results = search_results.match(regex)[1]
        let total_pages = Math.ceil(total_results / 10)

        return {
            total_results,
            total_pages
        }
    })

    for (let i=0; i < 3; i++) {
        await page.goto('https://www.oreilly.com/search/?query=' +
            '&extended_publisher_data=true' +
            '&highlight=true' +
            '&include_assessments=false' +
            '&include_case_studies=true' +
            '&include_courses=true' +
            '&include_orioles=true' +
            '&include_playlists=true' +
            '&include_collections=true' +
            '&include_notebooks=true' +
            '&is_academic_institution_account=false' +
            '&source=user' +
            '&formats=book' +
            '&publishers=O%27Reilly%20Media%2C%20Inc.' +
            '&sort=date_added' +
            '&facet_json=true' +
            '&include_scenarios=true' +
            '&include_sandboxes=true' +
            '&json_facets=false' +
            '&page=0' )

        const page_results = await page.evaluate(() => {
            let search_results = document.querySelector('#main > div > header > section.Info--Y9eEH > h3').textContent

            let book_list = document.querySelector('#main > div > section > ul');

            let book_items = Array.from(book_list.children);
            let book_info = book_items.map(episode_panel => {
                let title = episode_panel.querySelector('article > div > section > section > ' +
                    'div.cardTitleWrap--33OUY > h4');
                return {"title": title.textContent, "url": title.querySelector('a').href}
            });
            return {
                book_info,
                search_results,
                total_results,
                total_pages
            }
        })
    }

    console.log(result)
    console.log(page_results)

   await browser.close()
})()