import { PuppeteerService } from "./PuppeteerService";
import { Cluster } from "puppeteer-cluster";
import { load } from 'cheerio';
import axios, { AxiosResponse } from "axios";


import ApiPocketBase from "./ApiPockeBase";
import time from "../utils/time";
import {
  ESTADAO_ID,
  G1_ID,
  JOVEM_PAN_ID,
  REVISTA_OESTE_ID,
  VALOR_ECONOMICO_ID
} from "../resources/newsSitesIds"
import {
  ESTADAO_CONTENT_SELECTOR,
  G1_CONTENT_SELECTOR,
  JOVEM_PAN_CONTENT_SELECTOR,
  REVISTA_OESTE_CONTENT_SELECTOR,
  VALOR_ECONOMICO_CONTENT_SELECTOR
} from "../resources/newsSitesContentSelectors";
import { OpenAiService } from "./OpenAIService";

interface ClusterInterface {
  page: any,
  data: {
    url: string
  }
}

const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
];

const proxies = [
  ['http','137.184.232.148','80'],
  ['http','41.169.72.4','8090'],
  ['http','139.99.237.62','80'],
  ['http','102.38.31.8','80'],
  ['http','149.56.185.20','80'],
  ['http','103.117.192.14','80'],
  ['http','143.110.232.177','80'],
  ['http','161.35.70.249','3128'],
  ['http','103.141.143.102','41516'],
  ['http','98.32.177.204','80'],
  ['http','212.51.144.107','80'],
  ['http','186.121.235.220','8080'],
  ['http','103.69.108.78','8191'],
  ['http','194.233.77.110','1111'],
  ['http','146.182.6.51','3129'],
  ['http','95.217.209.170','8080'],
];

export class NewsScraperService {
  async scrapNewsEstadao({ page, data: { url } }: ClusterInterface): Promise<any> {
    const puppService = new PuppeteerService();
    const pageConfigured = await puppService.configureNewPage(page);

    const content = await new Promise(async function (resolve, reject) {
      console.log('> Starting content extraction');
      const [ httpsResponse, CDPElement, content ] = await Promise.all([
        await pageConfigured.goto(url, { waitUntil:["load", "networkidle2"] }),
        await pageConfigured.waitForSelector(ESTADAO_CONTENT_SELECTOR),
        await new Promise (async (resolve, reject) => {
          try {
            const content = await pageConfigured.$eval(ESTADAO_CONTENT_SELECTOR, (el: HTMLElement) => el.innerText)
            resolve(content);
          } catch (error) {
            reject(error)
          }
        })
      ]);

      console.log('> Content extracted');
      resolve(content);
    })

    pageConfigured.close();

    const pb = new ApiPocketBase();
    const news = await pb.api.post('/api/collections/news_content/records', {
      content: content,
      news_site_id: ESTADAO_ID,
      link: url
    })
      .then(resp => {
        return resp.data;
      })
      .catch(err => {
        console.log(err);
        throw new Error(err.message);
      });

    if(news){ 
      return news;
    }

    return content;
  }

  async scrapNewsG1({ page, data: { url }}: ClusterInterface): Promise<any> {
    const puppService = new PuppeteerService();
    const pageConfigured = await puppService.configureNewPage(page);

    const content = await new Promise(async function (resolve, reject) {
      console.log('> Starting content extraction');
      const [ httpsResponse, CDPElement, content ] = await Promise.all([
        await pageConfigured.goto(url, { waitUntil:["load", "networkidle2"] }),
        await pageConfigured.waitForSelector(G1_CONTENT_SELECTOR),
        await new Promise (async (resolve, reject) => {
          try {
            const content = await pageConfigured.$eval(G1_CONTENT_SELECTOR, (el: HTMLElement) => el.innerText)
            resolve(content);
          } catch (error) {
            reject(error)
          }   
        })
      ]);

      console.log('> Content extracted');
      resolve(content);
    })

    pageConfigured.close();

    const pb = new ApiPocketBase();
    const news = await pb.api.post('/api/collections/news_content/records', {
      content: content,
      news_site_id: G1_ID,
      link: url
    })
      .then(resp => {
        return resp.data;
      })
      .catch(err => {
        console.log(err);
        throw new Error(err.message);
      });


    if(news) { 
      return news;
    }

    return content;
  }

  async scrapNewsValorEconomico({ page, data: { url }}: ClusterInterface): Promise<any> {
    const puppService = new PuppeteerService();
    const pageConfigured = await puppService.configureNewPage(page);

    const content = await new Promise(async function (resolve, reject) {

      console.log('> Starting content extraction');
      const [ httpsResponse, CDPElement, content  ] = await Promise.all([
        await pageConfigured.goto(url, { waitUntil:["load", "networkidle2"] }),
        await pageConfigured.waitForSelector(VALOR_ECONOMICO_CONTENT_SELECTOR),
        await new Promise (async (resolve, reject) => {
          try {
            const content = await pageConfigured.$eval(VALOR_ECONOMICO_CONTENT_SELECTOR, (el: HTMLElement) => el.innerText)
            resolve(content);
          } catch (error) {
            reject(error);
          }   
        })
      ]);

      console.log('> Content extracted');
      resolve(content);
    })

    pageConfigured.close();

    const pb = new ApiPocketBase();
    const news = await pb.api.post('/api/collections/news_content/records', {
      content: content,
      news_site_id: VALOR_ECONOMICO_ID,
      link: url
    })
      .then(resp => {
        return resp.data;
      })
      .catch(err => {
        console.log(err);
        throw new Error(err.message);
      });


    if(news){ 
      return news;
    }

    return content;
  }

  async scrapNewsRevistaOeste({ page, data: { url }}: ClusterInterface): Promise<any> {
    const puppService = new PuppeteerService();
    const pageConfigured = await puppService.configureNewPage(page);

    const content = await new Promise(async function (resolve, reject) {
      
      console.log('> Starting content extraction')
      const [ httpsResponse, CDPElement, content ] = await Promise.all([
        await pageConfigured.goto(url, { waitUntil:["load", "networkidle2"] }),
        await pageConfigured.waitForSelector(REVISTA_OESTE_CONTENT_SELECTOR),
        new Promise (async (resolve, reject) => {
          try {
            const content = await pageConfigured.$eval(REVISTA_OESTE_CONTENT_SELECTOR, (el: HTMLElement) => el.innerText)
            resolve(content);
          } catch (error) {
            reject(error)
          }
        })
      ])

      console.log('> Content extracted')
      resolve(content);
    })

    pageConfigured.close();

    const pb = new ApiPocketBase();
    const news = await pb.api.post('/api/collections/news_content/records', {
      content: content,
      news_site_id: REVISTA_OESTE_ID,
      link: url
    })
      .then(resp => {
        return resp.data;
      })
      .catch(err => {
        console.log(err);
        throw new Error(err.message);
      });


    if(news){ 
      return news;
    }

    return content;
  }

  async scrapNewsJovemPan({ page, data: { url }}: ClusterInterface): Promise<any> {
    const pid = process.pid;

    const content = await new Promise(async function (resolve, reject) {
      const puppService = new PuppeteerService();
      const pageConfigured = await puppService.configureNewPage(page);

      console.log('> Starting content extraction')
      const [ httpsResponse, CDPElement, content ] = await Promise.all([
        await pageConfigured.goto(url, { waitUntil:["load", "networkidle2"] }),
        await pageConfigured.waitForSelector(JOVEM_PAN_CONTENT_SELECTOR),
        new Promise (async (resolve, reject) => {
          try {
            const content = await pageConfigured.$eval(JOVEM_PAN_CONTENT_SELECTOR, (el: HTMLElement) => el.innerText)
            resolve(content);
          } catch (error) {
            reject(error)
          }   
        })
      ])

      pageConfigured.close();
      console.log('> Content extracted')
      resolve(content);
    })

    const pb = new ApiPocketBase();
    const news = await pb.api.post('/api/collections/news_content/records', {
      content: content,
      news_site_id: JOVEM_PAN_ID,
      link: url
    })
      .then(resp => {
        return resp.data;
      })
      .catch(err => {
        console.log(err);
        throw new Error(err.message);
      });


    if(news){ 
      return news;
    }

    return content;
  }

  async scrapNewsListEstadaoOld() {
    const pid = process.pid;
    const pb = new ApiPocketBase();

    const data = await pb.api.get('/api/collections/last_news/records', { 
      filter: {
        news_site_id: ESTADAO_ID,
        publish_date: time.getYesterday()
      }
    }).then((response: any)  => {
      return response.data
    })

    try {
      const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
        puppeteerOptions: {
          args: minimal_args,
          headless: true
        }
      });
  
      await cluster.task(this.scrapNewsEstadao);
  
      for (const item of data.items) {
        if(item.link){
          await cluster.queue({ url: item.link });
        }
      }
  
      await cluster.idle();
      await cluster.close();
    } catch (error) {
      console.error(`${pid} has broken! ${error.stack}`)
    }
    return {}
  }

  async scrapNewsListG1Old() {
    const pid = process.pid;
    const pb = new ApiPocketBase();

    const data = await pb.api.get('/api/collections/last_news/records', {
      filter: {
        news_site_id: G1_ID,
        publish_date: time.getYesterday()
      }
    }).then((response: any)  => {
      return response.data
    })
    
    try {
      const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
        puppeteerOptions: {
          args: minimal_args
        }
      });
  
      await cluster.task(this.scrapNewsG1);
  
      for (const item of data.items) {
        if(item.link){
          await cluster.queue({ url: item.link });
        }
      }
  
      await cluster.idle();
      await cluster.close();
    } catch (error) {
      console.error(`${pid} has broken! ${error.stack}`)
    }
    return {}
  }

  async scrapNewsListValorEconomicoOld() {
    const pid = process.pid;
    const pb = new ApiPocketBase();

    const data = await pb.api.get('/api/collections/last_news/records', { 
      filter: {
        news_site_id: VALOR_ECONOMICO_ID,
        publish_date: time.getYesterday()
      }
    }).then((response: any)  => {
      return response.data
    })
    
    try {
      const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2
      });
  
      await cluster.task(this.scrapNewsValorEconomico);
  
      for (const item of data.items) {
        if(item.link){
          await cluster.queue({ url: item.link });
        }
      }
  
      await cluster.idle();
      await cluster.close();
    } catch (error) {
      console.error(`${pid} has broken! ${error.stack}`)
    }
    return {}
  }

  async scrapNewsListRevistaOesteOld() {
    const pid = process.pid;
    const pb = new ApiPocketBase();

    const data = await pb.api.get('/api/collections/last_news/records', {
      filter: {
        news_site_id: REVISTA_OESTE_ID,
        publish_date: time.getYesterday()
      }
    }).then((response: any)  => {
      return response.data
    })

    try {
      const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
        puppeteerOptions: {
          args: minimal_args
        }
      });
  
      await cluster.task(this.scrapNewsRevistaOeste);
  
      for (const item of data.items) {
        if(item.link){
          await cluster.queue({ url: item.link });
        }
      }
  
      await cluster.idle();
      await cluster.close();
    } catch (error) {
      console.error(`${pid} has broken! ${error.stack}`)
    }
    return {}
  }

  async scrapNewsListJovemPanOld() {
    const pid = process.pid;
    const pb = new ApiPocketBase();

    const data = await pb.api.get('/api/collections/last_news/records', { 
      filter: {
        news_site_id: JOVEM_PAN_ID,
        publish_date: time.getYesterday()
      }
    }).then((response: any)  => {
      return response.data
    })
    
    try {
      const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
        puppeteerOptions: {
          args: minimal_args
        }
      });
  
      await cluster.task(this.scrapNewsJovemPan);
  
      for (const item of data.items) {
        if(item.link){
          await cluster.queue({ url: item.link });
        }
      }
  
      await cluster.idle();
      await cluster.close();
    } catch (error) {
      console.error(`${pid} has broken! ${error.stack}`)
    }
    return {}
  }




  async requestNewsSite(
    url: string,
    userAgent: string,
    proxy: any,
    selector: string,
    id: string,
    retryCount = 0
  ): Promise<boolean> {
    try {
      const response: any = await axios.get(url, {
        headers: {
          'User-Agent': userAgent,
        },
        // proxy: {
        //   protocol: proxy[0],
        //   host: proxy[1],
        //   port: proxy[2],
        // },
        // timeout: 3000,
      })
      
      console.log('> Url:', url);
  
      const $ = load(response.data);
      const content: string = $(selector).text();
  

      const pb = new ApiPocketBase();
      await pb.api.post('/api/collections/news_content/records', {
        news_site_id: id,
        content: content,
        link: url
      }).then((resp: any) => {
          return true;
      }).catch((error: any) => {
          throw new Error(error);
      });

      console.log('<> Data Saved.')
      return true;
    } catch (error) {
      console.error('Erro:', error.message);
      if (retryCount < 4) {
        console.log('> Tring again...');
        const randomProxy: string[] = proxies[Math.floor(Math.random() * proxies.length)];
        const randomUserAgent: string = userAgents[Math.floor(Math.random() * userAgents.length)];
        await this.requestNewsSite(url, randomUserAgent, randomProxy, selector, id, retryCount + 1);
      } else {
        console.log('> Maximum number of retries exceeded.');
        return false;
      }
    }
  }

  async scrapNewsListEstadao() {
    const pb = new ApiPocketBase();

    const data = await pb.api.get('/api/collections/last_news/records', { 
      filter: {
        news_site_id: ESTADAO_ID,
        publish_date: time.getYesterday()
      }
    }).then((response: any)  => {
      return response.data
    })
    
    const main = async ( url: string ): Promise<boolean> =>  {
      const randomProxy: string[] = proxies[Math.floor(Math.random() * proxies.length)];
      const randomUserAgent: string = userAgents[Math.floor(Math.random() * userAgents.length)];
      return await this.requestNewsSite(url, randomUserAgent, randomProxy, ESTADAO_CONTENT_SELECTOR, ESTADAO_ID);
    }
    
    let result = []
    for (const item of data.items) {
      if(item.link){
        result.push(await main(item.link).catch((error) => {
          console.log('Error:')
          console.error(error)
          return false;
        }));
      }
    }
    return result;
  }

  async scrapNewsListG1() {
    const pb = new ApiPocketBase();

    const data = await pb.api.get('/api/collections/last_news/records', { 
      filter: {
        news_site_id: G1_ID,
        publish_date: time.getYesterday()
      }
    }).then((response: any)  => {
      return response.data
    })
    
    const main = async ( url: string ): Promise<boolean> =>  {
      const randomProxy: string[] = proxies[Math.floor(Math.random() * proxies.length)];
      const randomUserAgent: string = userAgents[Math.floor(Math.random() * userAgents.length)];
      return await this.requestNewsSite(url, randomUserAgent, randomProxy, G1_CONTENT_SELECTOR, G1_ID);
    }
    
    let result = []
    for (const item of data.items) {
      if(item.link){
        result.push(await main(item.link).catch((error) => {
          console.log('Error:')
          console.error(error)
          return false;
        }));
      }
    }
    return result;
  }

  async scrapNewsListValorEconomico() {
    const pb = new ApiPocketBase();

    const data = await pb.api.get('/api/collections/last_news/records', { 
      filter: {
        news_site_id: VALOR_ECONOMICO_ID,
        publish_date: time.getYesterday()
      }
    }).then((response: any)  => {
      return response.data
    })
    
    const main = async ( url: string ): Promise<boolean> =>  {
      const randomProxy: string[] = proxies[Math.floor(Math.random() * proxies.length)];
      const randomUserAgent: string = userAgents[Math.floor(Math.random() * userAgents.length)];
      return await this.requestNewsSite(url, randomUserAgent, randomProxy, VALOR_ECONOMICO_CONTENT_SELECTOR, VALOR_ECONOMICO_ID);
    }
    
    let result = []
    for (const item of data.items) {
      if(item.link){
        result.push(await main(item.link).catch((error) => {
          console.log('Error:')
          console.error(error)
          return false;
        }));
      }
    }

    return result;
  }

  async scrapNewsListRevistaOeste() {
    const pb = new ApiPocketBase();

    const data = await pb.api.get('/api/collections/last_news/records', { 
      filter: {
        news_site_id: REVISTA_OESTE_ID,
        publish_date: time.getYesterday()
      }
    }).then((response: any)  => {
      return response.data
    })
    
    const main = async ( url: string ): Promise<boolean> =>  {
      const randomProxy: string[] = proxies[Math.floor(Math.random() * proxies.length)];
      const randomUserAgent: string = userAgents[Math.floor(Math.random() * userAgents.length)];
      return await this.requestNewsSite(url, randomUserAgent, randomProxy, REVISTA_OESTE_CONTENT_SELECTOR, REVISTA_OESTE_ID);
    }
    
    let result = []
    for (const item of data.items) {
      if(item.link){
        result.push(await main(item.link).catch((error) => {
          console.log('Error:')
          console.error(error)
          return false;
        }));
      }
    }
    return result;
  }

  async scrapNewsListJovemPan() {
    const pb = new ApiPocketBase();

    const data = await pb.api.get('/api/collections/last_news/records', { 
      filter: {
        news_site_id: JOVEM_PAN_ID,
        publish_date: time.getYesterday()
      }
    }).then((response: any)  => {
      return response.data
    })
    
    const main = async ( url: string ): Promise<boolean> =>  {
      const randomProxy: string[] = proxies[Math.floor(Math.random() * proxies.length)];
      const randomUserAgent: string = userAgents[Math.floor(Math.random() * userAgents.length)];
      return await this.requestNewsSite(url, randomUserAgent, randomProxy, JOVEM_PAN_CONTENT_SELECTOR, JOVEM_PAN_ID);
    }
    
    let result = []
    for (const item of data.items) {
      if(item.link){
        result.push(await main(item.link).catch((error) => {
          console.log('Error:')
          console.error(error)
          return false;
        }));
      }
    }
    return result;
  }

}
