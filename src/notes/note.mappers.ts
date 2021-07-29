import { NoteDTO } from '../graphql';
import { NoteBE } from './note.schema';

export default class NoteMappers {
  static BEtoDTO(noteBE: NoteBE): NoteDTO {
    return {
      id: noteBE._id,
      recipeID: noteBE.recipeID,
      name: noteBE.name,
      description: noteBE.description,
      sortNr: noteBE.sortNr,
    };
  }
}
