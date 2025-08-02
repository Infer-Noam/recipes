import { MigrationInterface, QueryRunner } from "typeorm";

const DB_SCHEMA = process.env.DB_SCHEMA;

export class AddNullableConstraintsForRecipeNameAndImageUrl1753602865327
  implements MigrationInterface
{
  name = "AddNullableConstraintsForRecipeNameAndImageUrl1753602865327";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${DB_SCHEMA}."recipe" ADD CONSTRAINT "CHK_d3968e209d5ff7cc9eac3671ac" CHECK ("name" != '' AND "image_url" != '')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${DB_SCHEMA}."recipe" DROP CONSTRAINT "CHK_d3968e209d5ff7cc9eac3671ac"`
    );
  }
}
