import { Configuration, OpenAIApi } from "openai";
import natural from 'natural';
import axios from "axios";

export class OpenAiService {
  configuration = new Configuration({ apiKey: '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' });
  openai = new OpenAIApi(this.configuration);

  async resumeNews(subject: string) {
    if (!this.configuration.apiKey) {
      return {
        error: {
          message: "OpenAI API key not configured, please follow instructions in README.md",
        }
      };
    }

    if (subject.trim().length === 0) {
      return {
        error: {
          message: "Please enter a valid subject",
        }
      };
    }

    try {
      const completion = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: await this.generateTextPrompt(subject),
        temperature: 0.10,
        max_tokens: 200
      });
      
      return completion.data.choices[0].text ;
    } catch(error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        throw new Error(error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        throw new Error(error.message);
      }
    }
  }

  async generateTextPrompt(subject: string) {
    return `Resuma em 250 caracteres pu menos a notícia:\n${subject}\nSem redundancia, sem repetir frases. Não pode ser possível identificar a origem.`;
  }

  async returnTokensAmountOfAText(text: string) {
    try {
      const response = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.10,
        max_tokens: 5000
      });
      
      return { result: response };
    } catch (error) {
      console.log(error)
      // console.error('Erro na contagem de tokens:', error);
    }
  }
}

// const service = new OpenAiService();

// const result = await service.generateAnswer(subject);
