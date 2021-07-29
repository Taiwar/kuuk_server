import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { NotesModule } from '../notes/notes.module';
import { StepsModule } from '../steps/steps.module';
import { GroupBE, GroupMongoSchema } from './group.schema';
import { GroupsService } from './groups.service';

@Module({
  imports: [
    IngredientsModule,
    StepsModule,
    NotesModule,
    MongooseModule.forFeature([
      { name: GroupBE.name, schema: GroupMongoSchema },
    ]),
  ],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
