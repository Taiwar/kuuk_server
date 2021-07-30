import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteBE, NoteMongoSchema } from './note.schema';
import { NotesService } from './notes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NoteBE.name, schema: NoteMongoSchema }]),
  ],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
