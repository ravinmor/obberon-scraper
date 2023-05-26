import { Request, Response } from "express";
import { NewsScraperService } from "../services/NewsScraperService";

export class NewsScraperController {
  async scrapNewsEstadao(request: Request, response: Response) {
    const { url } = request.body;
    const service = new NewsScraperService();

    const result = await service.scrapNewsEstadao(url);

    return response.json(result);
  }
  async scrapNewsG1(request: Request, response: Response) {
    const { url } = request.body;
    const service = new NewsScraperService();

    const result = await service.scrapNewsG1(url);

    return response.json(result);
  }
  async scrapNewsValorEconomico(request: Request, response: Response) {
    const { url } = request.body;
    const service = new NewsScraperService();

    const result = await service.scrapNewsValorEconomico(url);

    return response.json(result);
  }
  async scrapNewsRevistaOeste(request: Request, response: Response) {
    const { url } = request.body;
    const service = new NewsScraperService();

    const result = await service.scrapNewsRevistaOeste(url);

    return response.json(result);
  }
  async scrapNewsJovemPan(request: Request, response: Response) {
    const { url } = request.body;
    const service = new NewsScraperService();

    const result = await service.scrapNewsJovemPan(url);

    return response.json(result);
  }
  async scrapNewsListEstadao(request: Request, response: Response) {
    const { url } = request.body;
    const service = new NewsScraperService();

    const result = await service.scrapNewsListEstadao();

    return response.json(result);
  }
  async scrapNewsListG1(request: Request, response: Response) {
    const { url } = request.body;
    const service = new NewsScraperService();

    const result = await service.scrapNewsListG1();

    return response.json(result);
  }
  async scrapNewsListValorEconomico(request: Request, response: Response) {
    const { url } = request.body;
    const service = new NewsScraperService();

    const result = await service.scrapNewsListValorEconomico();

    return response.json(result);
  }
  async scrapNewsListRevistaOeste(request: Request, response: Response) {
    const { url } = request.body;
    const service = new NewsScraperService();

    const result = await service.scrapNewsListRevistaOeste();

    return response.json(result);
  }
  async scrapNewsListJovemPan(request: Request, response: Response) {
    const service = new NewsScraperService();

    const result = await service.scrapNewsListJovemPan();

    return response.json(result);
  }
}
