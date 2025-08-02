import { useParams } from "react-router-dom";
import { useGetRecipeByUuid } from "../../hooks/api/useGetRecipeByUuid.api";
import { useGetIngredients } from "../../hooks/api/useGetIngredients.api";
import { useGetChefs } from "../../hooks/api/useGetChefs.api";
import { Recipe } from "../../components/recipe/recipe";
import type { FC } from "react";
import BackdropLoading from "../../components/backdropLoading/BackdropLoading";
import CentralErrorAlert from "../../components/centralErrorAlert/CentralErrorAlert";

const RecipePage: FC = () => {
  const { uuid } = useParams();

  if (!uuid) return null;

  const { data: recipe, isLoading } = useGetRecipeByUuid(uuid);
  const { data: ingredients = [] } = useGetIngredients();
  const { data: chefs = [] } = useGetChefs();

  if (isLoading) return <BackdropLoading />;

  if (recipe) {
    const {
      name,
      chef,
      description,
      imageUrl,
      steps,
      ingredients: recipeIngredients,
    } = recipe;

    return (
      <Recipe
        chefs={chefs}
        uuid={uuid}
        ingredients={ingredients}
        initialRecipe={{
          name,
          chef,
          description,
          imageUrl,
          steps,
          recipeIngredients,
        }}
      ></Recipe>
    );
  }

  return <CentralErrorAlert text="Something went wrong..." />;
};

export default RecipePage;
