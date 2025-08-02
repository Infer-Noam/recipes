import { useGetIngredients } from "../../hooks/api/useGetIngredients.api";
import { useGetChefs } from "../../hooks/api/useGetChefs.api";
import { Box } from "@mui/material";
import { Recipe } from "../../components/recipe/recipe";
import { v4 as uuidv4 } from "uuid";
const RecipeCreationPage = () => {
  const { data: ingredients } = useGetIngredients();
  const { data: chefs } = useGetChefs();

  const uuid = uuidv4();
  if (ingredients && chefs) {
    return (
      <Box>
        <Recipe
          chefs={chefs}
          ingredients={ingredients}
          uuid={uuid}
          initialRecipe={undefined}
        ></Recipe>
      </Box>
    );
  } else return null;
};

export default RecipeCreationPage;
