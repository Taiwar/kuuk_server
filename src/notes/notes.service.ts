import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddNoteInput,
  GroupItemDeletionResponse,
  NoteDTO,
  UpdateNoteInput,
} from '../graphql';
import {
  checkAllowedOrdering,
  reorderOrderedItems,
  reorderOrderedItemsAfterDelete,
} from '../shared/reorderingHelper';
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

  public async countInOrderGroup(groupId: string): Promise<number> {
    return this.noteModel.countDocuments({
      groupID: groupId,
    });
  }

  public async create(addNoteInput: AddNoteInput): Promise<NoteDTO> {
    const newNoteBE = await new this.noteModel({
      recipeID: addNoteInput.recipeID,
      name: addNoteInput.name,
      description: addNoteInput.description,
      groupID: addNoteInput.groupID,
      sortNr: (await this.countInOrderGroup(addNoteInput.groupID)) + 1,
    });
    await newNoteBE.save();
    return NoteMappers.BEtoDTO(newNoteBE);
  }

  public async update(updateNoteInput: UpdateNoteInput): Promise<NoteDTO> {
    const noteDTO = await this.findOneById(updateNoteInput.id);

    await checkAllowedOrdering(
      noteDTO.sortNr,
      updateNoteInput.sortNr,
      await this.countInOrderGroup(noteDTO.recipeID),
    );

    const update: UpdateNoteInput = {
      id: updateNoteInput.id,
      name: updateNoteInput.name ?? undefined,
      description: updateNoteInput.description ?? undefined,
      groupID: updateNoteInput.groupID ?? undefined,
      sortNr: updateNoteInput.sortNr ?? undefined,
    };
    const noteBE = await this.noteModel.findByIdAndUpdate(update.id, update, {
      new: true,
      omitUndefined: true,
    });

    await reorderOrderedItems(
      noteBE.id,
      noteBE.recipeID,
      this.noteModel as Model<any>,
      noteDTO.sortNr,
      updateNoteInput.sortNr,
    );

    return NoteMappers.BEtoDTO(noteBE);
  }

  public async delete(id: string): Promise<GroupItemDeletionResponse> {
    const deleteResult = await this.noteModel.findByIdAndDelete(id);
    const updateHigherNotes = await reorderOrderedItemsAfterDelete(
      deleteResult.sortNr,
      deleteResult.recipeID,
      this.noteModel as Model<any>,
    );
    return {
      id,
      groupID: deleteResult.groupID,
      success: !!updateHigherNotes,
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
