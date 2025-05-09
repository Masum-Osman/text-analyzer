import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TextDocument } from "src/infrastructure/database/models/text.schema";

@Injectable()
export class TextService {
    constructor(
        @InjectModel('Text') 
        private readonly textModel: Model<TextDocument>,
    ){}

    async create(content: string, createdBy: string) {
        const text = new this.textModel({ content, createdBy });
        return await text.save();
    }

    async findAll() {
        return await this.textModel.find().exec();
    }

    async findById(id: string) {
        return await this.textModel.findById(id).exec();
    }

    async delete(id: string) {
        return this.textModel.findByIdAndDelete(id).exec();
    }  
}