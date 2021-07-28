import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddNoteInput, NoteDTO, UpdateNoteInput } from '../graphql';
import NoteMappers from './note.mappers';
import { NoteBE } from './note.schema';

@Injectable()
export class NotesService {
  private logger: Logger = new Logger('NotesService');

  constructor(
    @InjectModel(NoteBE.name)
    private readonly noteModel: Model<NoteBE>,
  ) {}

  public async findOneById(id: string): Promise<NoteDTO> {
    return NoteMappers.BEtoDTO(await this.noteModel.findById(id));
  }

  public async create(addNoteInput: AddNoteInput): Promise<NoteDTO> {
    const newNoteBE = await new this.noteModel({
      recipeID: addNoteInput.recipeID,
      name: addNoteInput.name,
      description: addNoteInput.description,
      group: addNoteInput.group,
    });
    await newNoteBE.save();
    return NoteMappers.BEtoDTO(newNoteBE);
  }

  public async update(updateNoteInput: UpdateNoteInput): Promise<NoteDTO> {
    const update: UpdateNoteInput = {
      id: updateNoteInput.id,
      name: updateNoteInput.name ?? undefined,
      description: updateNoteInput.description ?? undefined,
      sortNr: updateNoteInput.sortNr ?? undefined,
      group: updateNoteInput.group ?? undefined,
    };
    const noteBE = await this.noteModel.findByIdAndUpdate(update.id, update, {
      new: true,
      omitUndefined: true,
    });

    if (!noteBE) {
      throw new NotFoundException(`Note #${updateNoteInput.id} not found`);
    }

    return NoteMappers.BEtoDTO(noteBE);
  }

  public async delete(id: string): Promise<boolean> {
    const deleteResult = await this.noteModel.findByIdAndDelete(id);
    return deleteResult !== null;
  }

  async getAll(): Promise<NoteDTO[]> {
    return (await this.noteModel.find()).map((i) => NoteMappers.BEtoDTO(i));
  }

  async getAllNames(): Promise<string[]> {
    return (await this.noteModel.find().select('name').exec()).map(
      (i) => i.name,
    );
  }

  async findAllByRecipeID(id: string): Promise<NoteDTO[]> {
    return (await this.noteModel.find({ recipeID: id })).map((i) =>
      NoteMappers.BEtoDTO(i),
    );
  }
}
