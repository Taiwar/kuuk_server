import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddNoteInput,
  DeletionResponse,
  NoteDTO,
  UpdateNoteInput,
} from '../graphql';
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
    const noteBE = await this.noteModel.findById(id);
    if (!noteBE) {
      throw new NotFoundException(`Note ${id} not found`);
    }
    return NoteMappers.BEtoDTO(noteBE);
  }

  public async countInOrderGroup(
    recipeId: string,
    groupId = null,
  ): Promise<number> {
    let count: number;
    if (groupId) {
      count = await this.noteModel.countDocuments({
        groupID: groupId,
      });
    } else {
      count = await this.noteModel.countDocuments({
        recipeID: recipeId,
      });
    }
    return count;
  }

  public async create(addNoteInput: AddNoteInput): Promise<NoteDTO> {
    const newNoteBE = await new this.noteModel({
      recipeID: addNoteInput.recipeID,
      name: addNoteInput.name,
      description: addNoteInput.description,
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

  public async delete(id: string): Promise<DeletionResponse> {
    // TODO: Reorder other notes in recipe/group
    const deleteResult = await this.noteModel.findByIdAndDelete(id);
    return {
      id,
      success: deleteResult !== null,
    };
  }

  public async deleteByGroupId(groupId: string): Promise<boolean> {
    const deleteResult = await this.noteModel.deleteMany({
      groupID: groupId,
    });
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

  async findAllByGroupID(id: string): Promise<NoteDTO[]> {
    return (await this.noteModel.find({ groupID: id })).map((i) =>
      NoteMappers.BEtoDTO(i),
    );
  }
}
