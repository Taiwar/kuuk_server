import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StepBE, StepMongoSchema } from './step.schema';
import { StepsService } from './steps.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StepBE.name, schema: StepMongoSchema }]),
  ],
  providers: [StepsService],
  exports: [StepsService],
})
export class StepsModule {}
