import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
  Check,
} from "typeorm";
import { AuditEntity } from "../audit.entity";
import { Chef } from "../chef/chef.entity";
import { RecipeIngredient } from "../recipe/recipe-ingredient/recipeIngredient.entity";

@Entity()
@Check(`"name" != '' AND "image_url" != ''`)
export class Recipe extends AuditEntity {
  @Column({ type: "varchar", length: 20 })
  name: string;

  @Column({ type: "text", array: true })
  steps: string[];

  @ManyToOne(() => Chef, (Chef) => Chef.recipes)
  @JoinColumn({
    name: "chef_uuid",
  })
  chef: Chef;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  imageUrl: string;

  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.recipe,
    {
      cascade: ["insert", "update", "remove", "soft-remove"],
      orphanedRowAction: "soft-delete",
    }
  )
  ingredients: RecipeIngredient[];
}
