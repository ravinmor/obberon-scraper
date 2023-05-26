import { OpenAiService } from "../services/OpenAIService";

export class OpenAiController {
  async resumeNews(request, response) {
    const { text } = request.body;
    console.log(text);

    const service = new OpenAiService();

    const result = await service.resumeNews(text);

    if (result instanceof Error) {
      return response.status(400).json(result.message);
    }

    return response.json(result);
  }
  async returnTokensAmountOfAText(request, response) {
    const { text } = request.body;
    const service = new OpenAiService();

    const result = await service.returnTokensAmountOfAText(text);

    if (result instanceof Error) {
      return response.status(400).json(result.message);
    }

    return response.json(result);
  }
}
