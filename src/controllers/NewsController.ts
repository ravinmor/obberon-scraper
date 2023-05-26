import { Request, Response } from "express";
import { NewsService } from "../services/NewsService";

export class NewsController {
  async getLastNewsEstadao(request: Request, response: Response) {
    const service = new NewsService();

    const result = await service.getLastNewsEstadao();

    return response.json(result);
  }

  async getLastNewsG1(request: Request, response: Response) {
    const service = new NewsService();

    const result = await service.getLastNewsG1();

    return response.json(result);
  }

  async getLastNewsValorEconomico(request: Request, response: Response) {
    const service = new NewsService();

    const result = await service.getLastNewsValorEconomico();

    return response.json(result);
  }

  async getLastNewsRevistaOeste(request: Request, response: Response) {
    const service = new NewsService();

    const result = await service.getLastNewsRevistaOeste();

    return response.json(result);
  }

  async getLastNewsJovemPan(request: Request, response: Response) {
    const service = new NewsService();

    const result = await service.getLastNewsJovemPan();

    return response.json(result);
  }
}
