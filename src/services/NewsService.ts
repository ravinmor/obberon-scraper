import * as puppeteer from "puppeteer";
import { PuppeteerService } from "./PuppeteerService";
import axios from "axios";
import ApiPocketBase from "./ApiPockeBase";
import { ESTADAO_ID, G1_ID, JOVEM_PAN_ID, VALOR_ECONOMICO_ID } from "../resources/newsSitesIds";


export class NewsService {
  async getLastNewsEstadao(): Promise<any> {
    const size = 60;
    const url = `https://www.estadao.com.br/pf/api/v3/content/fetch/story-feed-query?query=%7B%22body%22%3A%22%7B%5C%22query%5C%22%3A%7B%5C%22bool%5C%22%3A%7B%5C%22must%5C%22%3A%5B%7B%5C%22term%5C%22%3A%7B%5C%22type%5C%22%3A%5C%22story%5C%22%7D%7D%2C%7B%5C%22term%5C%22%3A%7B%5C%22revision.published%5C%22%3A1%7D%7D%2C%7B%5C%22nested%5C%22%3A%7B%5C%22path%5C%22%3A%5C%22taxonomy.sections%5C%22%2C%5C%22query%5C%22%3A%7B%5C%22bool%5C%22%3A%7B%5C%22must%5C%22%3A%5B%7B%5C%22regexp%5C%22%3A%7B%5C%22taxonomy.sections._id%5C%22%3A%5C%22.*economia.*%5C%22%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%7D%22%2C%22included_fields%22%3A%22_id%2Ctype%2Csubtype%2Ccreated_date%2Cdisplay_date%2Cfirst_publish_date%2Clast_updated_date%2Cpublish_date%2Clabel.basic%2Cheadlines.basic%2Csubheadlines.basic%2Cdescription.basic%2Ctaxonomy.primary_section%2Ctaxonomy.sections%2Ctaxonomy.tags%2Cowner%2Cpromo_items.basic%2Ccredits%2Ccanonical_url%22%2C%22offset%22%3A0%2C%22query%22%3A%22%22%2C%22resized_params%22%3A%5B%22300x200%22%2C%2290x90%22%5D%2C%22size%22%3A${size}%7D&d=743&_website=estadao`

    const dataNews = await axios.get(url)
      .then(result => {
          return result.data;
      })
      .catch(err => {
        console.log('> Fudeu');
        console.log(err);
        throw new Error();
      });

    const date = new Date();
    date.setDate(date.getDate() - 1);
    
    const lastNewsIterated = await dataNews.content_elements.map(async (item: any) => {
      const dateToCompare = new Date(item.first_publish_date);
      const pb = new ApiPocketBase();

      if(date.getDate() === dateToCompare.getDate()) {
        const lastNews = await pb.api.post('/api/collections/last_news/records', {
          news_site_id: ESTADAO_ID,
          publish_date: dateToCompare,
          title: item.headlines.basic,
          subtitle: item.subheadlines.basic,
          link: `https://www.estadao.com.br${item.canonical_url}`,
        })
        .then(resp => {
          return resp.data;
        })
        .catch(err => {
          console.log(err);
          throw new Error(err.message);
        })

        if(lastNews)
          return lastNews;
        
        return {};
      }
    }).filter(function (e: any) { return e !== undefined})

    return lastNewsIterated;
  }

  async getLastNewsG1(): Promise<any> {
    const url = `https://falkor-cda.bastian.globo.com/tenants/g1/instances/c46d078f-4753-47a0-8d87-94a9b1230dd3/posts/page/`;

    const loopArray = [ 2,3,4,5 ]

    const dataNews = await Promise.all(loopArray.map(async loop => {
      return await axios.get(`${url}${loop}`)
        .then(result => {
            return result.data.items;
        })
        .catch(err => {
          console.log('> Fudeu');
          console.log(err);
          throw new Error();
        });
    }))


    const date = new Date();
    date.setDate(date.getDate() - 1);

    return await Promise.all(dataNews.map(async (arrayPagination: any) => {
      return await arrayPagination.map(async (item: any) => {
        const dateToCompare = new Date(item.publication);
        
        const pb = new ApiPocketBase();
        if(date.getDate() === dateToCompare.getDate()) {
          const lastNews = await pb.api.post('/api/collections/last_news/records', {
            news_site_id: G1_ID,
            publish_date: dateToCompare,
            title: item.content.title,
            subtitle: item.content.summary,
            link: item.content.url,
          })
          .then(resp => {
            return resp.data;
          })
          .catch(err => {
            console.log(err);
            throw new Error(err.message);
          })

          if(lastNews)
            return lastNews;
          
          return {};
        }
      }).filter(function (e: any) { return e !== undefined})
    }))
  }

  async getLastNewsValorEconomico(): Promise<any> {
    const url = `https://falkor-cda.bastian.globo.com/tenants/valor/instances/b21b39cb-404c-4e68-8880-c943abcfd58b/posts/page/`;

    const loopArray = [ 2,3,4,5,6,7,8,9,10 ]

    const dataNews = await Promise.all(loopArray.map(async loop => {
      return await axios.get(`${url}${loop}`)
        .then(result => {
            return result.data.items;
        })
        .catch(err => {
          console.log('> Fudeu');
          console.log(err);
          throw new Error();
        });
    }))

    const date = new Date();
    date.setDate(date.getDate() - 1);

    return await Promise.all(dataNews.map(async (arrayPagination: any) => {
      return await arrayPagination.map(async (item: any) => {
        const dateToCompare = new Date(item.publication);
        
        const pb = new ApiPocketBase();
        if(date.getDate() === dateToCompare.getDate()) {
          const lastNews = await pb.api.post('/api/collections/last_news/records', {
            news_site_id: VALOR_ECONOMICO_ID,
            publish_date: dateToCompare,
            title: item.content.title,
            subtitle: item.content.summary,
            link: item.content.url,
          })
          .then(resp => {
            return resp.data;
          })
          .catch(err => {
            console.log(err);
            throw new Error(err.message);
          })
          
          if(lastNews)
            return lastNews;
          
          return {};
        }
      }).filter(function (e: any) { return e !== undefined})
    }))
  }

  async getLastNewsRevistaOeste(): Promise<any> {
    const url = `https://revistaoeste.com/economia/`

    const newsSelectors = {
      articleSelector: 'article.grid',
      publishDateSelector: 'span > time',
      titleSelector: 'a.card-post__title > h2',
      subtitleSelector: 'a.card-post__title > p',
      linkSelector: 'a.card-post__title'
    }

    const puppeteerService = new PuppeteerService();
    
    const browser = await puppeteer.launch({ headless: true });
    const { page, _browser } = await puppeteerService.instantiatePuppeteerNewPage(browser, url);

    await page.setViewport({
      width: 542,
      height: 865,
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: true,
    });

    await page.waitForSelector(newsSelectors.articleSelector);
    const newsData = await page.evaluate((selectors: any) => {
      const newsArticles = [... document.querySelectorAll(selectors.articleSelector)];

      return newsArticles.map(article => {
        const publish_date = article.querySelector(selectors.publishDateSelector);
        const title        = article.querySelector(selectors.titleSelector);
        const subtitle     = article.querySelector(selectors.subtitleSelector);
        const link         = article.querySelector(selectors.linkSelector);

        if(publish_date) {
          const date = new Date();
          date.setDate(date.getDate() - 1);

          const monthNames = {
            janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
            julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
          };
          
          // Split the string into its date and time components
          const [datePart, timePart] = publish_date.innerText.split(' - ');
          
          // Extract the day, month, and year from the date component
          const [day, monthName, year] = datePart.split(' ');
          
          // Convert the month name to its corresponding number
          if(monthName){
            const month = monthNames[monthName.toLowerCase()];
            
            // Create a new Date object with the extracted values (month is zero-based)
            const dataToCompare = new Date(year, month, day);

            if(date.getDate() === dataToCompare.getDate()) {
              const year = dataToCompare.getFullYear();
              const month = String(dataToCompare.getMonth() + 1).padStart(2, '0');
              const day = String(dataToCompare.getDate()).padStart(2, '0');
              const hours = String(dataToCompare.getHours()).padStart(2, '0');
              const minutes = String(dataToCompare.getMinutes()).padStart(2, '0');
              const seconds = String(dataToCompare.getSeconds()).padStart(2, '0');

              // Formatar a data no novo padrão "2023-05-14T13:00:01.089Z"
              const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;

              return {
                news_site_id: 'l9ldw2czkzn0u87',
                publish_date: formattedDate,
                title: title ? title.innerText : '',
                subtitle: subtitle ? subtitle.innerText : '',
                link: link ? link.href : undefined
              }
            }
          }
        }
      }).filter(function (e) { return e !== undefined })
    }, newsSelectors);

    return await newsData.map(async item => {
      const pb = new ApiPocketBase();
      const lastNews = await pb.api.post('/api/collections/last_news/records', item)
        .then(resp => {
          return resp.data;
        })
        .catch(err => {
          console.log(err);
          throw new Error(err.message);
        });

      if(lastNews)  
        return lastNews;
      
      return {};
    })
  }

  async getLastNewsJovemPan(): Promise<any> {
    const url = `https://jovempan.com.br/noticias/economia`

    const newsSelectors = {
      articleHighlightsSelector: '#main_content > div.archive.category > div > div:nth-child(2) > div.row.highlights > div',
      articleSelector: '#main_content > div.archive.category > div > div:nth-child(2) > article',
      publishDateSelector: 'div.col-xs-12.col-sm-7 > ul > li > span',
      titleSelector: 'h2 > a',
      linkSelector: 'h2 > a'
    }

    const puppeteerService = new PuppeteerService();
    
    const browser = await puppeteer.launch({ headless: true });
    const { page, _browser } = await puppeteerService.instantiatePuppeteerNewPage(browser, url);

    await page.setViewport({
      width: 542,
      height: 865,
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      // isMobile: true,
    });

    // await page.waitForSelector(newsSelectors.articleSelector);
    const newsData = await page.evaluate((selectors: any) => {
      const newsArticlesHighlights = [... document.querySelectorAll(selectors.articleHighlightsSelector)];
      const newsArticlesNormalOnes = [... document.querySelectorAll(selectors.articleSelector)];

      const newsArticles = [... newsArticlesHighlights, ... newsArticlesNormalOnes];

      return newsArticles.map(article => {
        const publish_date = article.querySelector(selectors.publishDateSelector);
        const title        = article.querySelector(selectors.titleSelector);
        const subtitle     = article.querySelector(selectors.subtitleSelector);
        const link         = article.querySelector(selectors.linkSelector);

        if(publish_date) {
          const date = new Date();
          date.setDate(date.getDate() - 1);

          const [datePart, timePart] = publish_date.innerText.split(' ');

          // Extract the day, month, and year from the date component
          const [day, month, year] = datePart.split('/');

          // Extract the hour and minute from the time component
          const [hour, minute] = timePart.replace('h', ':').split(':');

          // Create a new Date object with the extracted values
          const dataToCompare = new Date(year, month - 1, day, hour, minute);
          if(date.getDate() === dataToCompare.getDate()) {
            const year = dataToCompare.getFullYear();
            const month = String(dataToCompare.getMonth() + 1).padStart(2, '0');
            const day = String(dataToCompare.getDate()).padStart(2, '0');
            const hours = String(dataToCompare.getHours()).padStart(2, '0');
            const minutes = String(dataToCompare.getMinutes()).padStart(2, '0');
            const seconds = String(dataToCompare.getSeconds()).padStart(2, '0');

            // Formatar a data no novo padrão "2023-05-14T13:00:01.089Z"
            const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;

            return {
              publish_date: formattedDate,
              title: title ? title.innerText : '',
              subtitle: subtitle ? subtitle.innerText : '',
              link: link ? link.href : undefined
            }
          }
        }
      }).filter(function (e) { return e !== undefined })
    }, newsSelectors);

    browser.close();

    return await newsData.map(async (item: any) => {
      const pb = new ApiPocketBase();
      const lastNews = await pb.api.post('/api/collections/last_news/records', {
        ...item,
        news_site_id: JOVEM_PAN_ID
      })
        .then(resp => {
          return resp.data;
        })
        .catch(err => {
          console.log(err);
          throw new Error(err.message);
        });

      if(lastNews)  
        return lastNews;
      
      return {};
    })
  }
}
