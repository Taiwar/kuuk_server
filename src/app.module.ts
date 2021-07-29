import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from './app.controller';
import { GroupsModule } from './groups/groups.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { NotesModule } from './notes/notes.module';
import { RecipesModule } from './recipes/recipes.module';
import { StepsModule } from './steps/steps.module';

@Module({
  imports: [
    IngredientsModule,
    StepsModule,
    NotesModule,
    GroupsModule,
    RecipesModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL'),
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
