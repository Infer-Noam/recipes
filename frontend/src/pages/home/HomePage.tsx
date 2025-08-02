import { RecipeCard } from "../../components/recipeCard/RecipeCard";
import { Box, Grid } from "@mui/material";
import { useGetRecipes } from "../../hooks/api/useGetRecipes.api";
import Styles from "./homePage.style";
import { useDeleteRecipe } from "../../hooks/api/useDeleteRecipe.api";
import { chefSrcArray } from "../../consts/chefSrcArray.const";
import type { JSX } from "react";

const HomePage = () => {
  const { data: recipes } = useGetRecipes();

  const { mutate: deleteRecipe } = useDeleteRecipe();

  const getRandomChefSrc = () => {
    const randomIndex = Math.floor(Math.random() * chefSrcArray.length);
    return chefSrcArray[randomIndex];
  };

  if (recipes) {
    return (
      <Box>
        <Grid
          container
          sx={Styles.gridContainer}
          rowSpacing={2.5}
          columnSpacing={3.5}
        >
          {recipes
            .sort(
              (a, b) =>
                new Date(a.createDate).getTime() -
                new Date(b.createDate).getTime()
            )
            .reduce<JSX.Element[]>((acc, recipe) => {
              acc.push(
                <Grid key={recipe.uuid}>
                  <RecipeCard
                    recipe={recipe}
                    deleteRecipe={() => {
                      deleteRecipe(recipe.uuid);
                    }}
                    chefAvatarSrc={getRandomChefSrc()}
                  />
                </Grid>
              );
              return acc;
            }, [])}
        </Grid>
      </Box>
    );
  } else return null;
};

export default HomePage;
