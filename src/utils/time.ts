import { getCustomRepository } from "typeorm";

export default {
    async getYesterday() {
        const date = new Date();
        date.setDate(date.getDate() - 1);

        return date;
    }
}