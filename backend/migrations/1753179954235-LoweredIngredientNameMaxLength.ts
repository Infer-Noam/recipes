import { MigrationInterface, QueryRunner } from "typeorm";

const DB_SCHEMA = process.env.DB_SCHEMA;

export class LoweredIngredientNameMaxLength1753179954235
  implements MigrationInterface
{
  name = "LoweredIngredientNameMaxLength1753179954235";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${DB_SCHEMA}."ingredient" DROP CONSTRAINT "UQ_b6802ac7fbd37aa71d856a95d8f"`
    );
    await queryRunner.query(
      `ALTER TABLE ${DB_SCHEMA}."ingredient" DROP COLUMN "name"`
    );
    await queryRunner.query(
      `ALTER TABLE ${DB_SCHEMA}."ingredient" ADD "name" character varying(15) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE ${DB_SCHEMA}."ingredient" ADD CONSTRAINT "UQ_b6802ac7fbd37aa71d856a95d8f" UNIQUE ("name")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${DB_SCHEMA}."ingredient" DROP CONSTRAINT "UQ_b6802ac7fbd37aa71d856a95d8f"`
    );
    await queryRunner.query(
      `ALTER TABLE ${DB_SCHEMA}."ingredient" DROP COLUMN "name"`
    );
    await queryRunner.query(
      `ALTER TABLE ${DB_SCHEMA}."ingredient" ADD "name" character varying(20) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE ${DB_SCHEMA}."ingredient" ADD CONSTRAINT "UQ_b6802ac7fbd37aa71d856a95d8f" UNIQUE ("name")`
    );
  }
}
