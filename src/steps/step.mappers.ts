import { StepDTO } from '../graphql';
import { StepBE } from './step.schema';

export default class StepMappers {
  static BEtoDTO(stepBE: StepBE): StepDTO {
    return {
      id: stepBE._id,
      name: stepBE.name,
      description: stepBE.description,
      picture: stepBE.picture,
      sortNr: stepBE.sortNr,
      group: stepBE.group,
    };
  }
}
