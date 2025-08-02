import { type FC, useState } from "react";
import {
  type RecipeDetails,
  type Recipe as RecipeModel,
} from "../../../../shared/types/recipe.type";
import { type Chef as ChefModel } from "../../../../shared/types/chef.type";
import { type Ingredient as IngredientModel } from "../../../../shared/types/ingredient.type";
import { RecipeIngredientsTable } from "./recipeIngredientTable/RecipeIngredientsTable";
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Tooltip,
  Grid,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";
import Styles from "./recipe.style";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RecipeStepsList from "./recipeSteps/RecipeStepsList";
import { useNavigate } from "react-router-dom";
import type { DraftRecipeIngredient } from "./recipeIngredientTable/draftRecipeIngredient.type";
import type { SaveRecipeRes } from "@shared/http-types/recipe/saveRecipe.http-type";
import type { MutateOptions } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

export type RecipeInputs = {
  name: string;
  steps: string[];
  chef: ChefModel;
  recipeIngredients: DraftRecipeIngredient[];
  description: string;
  imageUrl: string;
};

type RecipeProps = {
  recipe: RecipeModel;
  chefs: ChefModel[];
  ingredients: IngredientModel[];
  deleteRecipe: () => void;
  saveRecipe: (
    variables: RecipeDetails,
    options?:
      | MutateOptions<SaveRecipeRes, Error, RecipeDetails, unknown>
      | undefined
  ) => Promise<SaveRecipeRes>;
  saveError: Error | null;
};

export const Recipe: FC<RecipeProps> = ({
  recipe: {
    uuid,
    name: initialName,
    chef: initialChef,
    description: initialDescription,
    imageUrl: initialImageUrl,
    steps: initialSteps,
    ingredients: initialIngredients,
  },
  chefs,
  ingredients,
  deleteRecipe,
  saveRecipe,
  saveError,
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<RecipeInputs>({
    defaultValues: {
      name: initialName,
      chef: initialChef,
      description: initialDescription,
      imageUrl: initialImageUrl,
      steps: initialSteps,
      recipeIngredients: initialIngredients,
    },
  });

  const { chef, imageUrl } = watch();
  const [errorText, setErrorText] = useState<string | undefined>(undefined);

  const onSubmit: SubmitHandler<RecipeInputs> = async ({
    name,
    chef,
    description,
    imageUrl,
    steps,
    recipeIngredients,
  }) => {

    const recipeDetails: RecipeDetails = {
      uuid,
      name,
      chef,
      description,
      imageUrl,
      steps,
      ingredients: recipeIngredients.map((ri) => ({
        uuid: ri.uuid,
        recipe: { uuid },
        ingredient: { uuid: ri!.ingredient!.uuid! },
        amount: ri!.amount!,
        measurementUnit: ri!.measurementUnit!,
      })),
    };

    try {
      const response = await saveRecipe(recipeDetails);
      if (response.recipe) {
        navigate(-1);
      } else {
        setErrorText(saveError?.message || "Failed to save recipe");
      }
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={Styles.gridContainer}>
        <Grid size={{ xs: 6, lg: 3.5, xl: 6 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Recipe name"
            variant="outlined"
            {...register("name", { required: true, maxLength: 20 })}
            error={!!errors.name}
            helperText={errors.name && "Recipe name is required"}
          />
        </Grid>
        <Grid size={{ xs: 6, lg: 4.5, xl: 6 }}>
          <Controller
            name="chef"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Tooltip
                arrow
                placement="right"
                title={
                  <Box component="span">
                    <Typography>{`Email: ${chef?.email || ""}`}</Typography>
                    <Typography>{`Phone number: ${
                      chef?.phone || ""
                    }`}</Typography>
                  </Box>
                }
              >
                <Autocomplete
                  options={chefs}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  value={value || null}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chef"
                      error={!!errors.chef}
                      helperText={errors.chef && "Chef is required"}
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value.uuid
                  }
                />
              </Tooltip>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 8, xl: 6 }}>
          <TextField
            fullWidth
            multiline
            id="outlined-basic"
            label="Short description"
            variant="outlined"
            {...register("description", { required: false })}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8, xl: 6 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Image url"
            variant="outlined"
            {...register("imageUrl", {
              required: true,
              pattern: /https?:\/\/[^\/\s]+\/[^\/\s]/i,
            })}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={"Open image"}
                      onClick={() => window.open(imageUrl)}
                      edge="end"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl && "Valid image URL is required"}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 8, xl: 6 }}>
          <RecipeStepsList control={control} />
        </Grid>
        <Grid size={{ xs: 12, lg: 8, xl: 6 }}>
          <RecipeIngredientsTable ingredients={ingredients} control={control} />
        </Grid>

        <Grid size={{ xs: 4, md: 3, lg: 4.1, xl: 3 }}>
          <Button fullWidth variant="outlined" size="large" type="submit">
            Save
          </Button>
        </Grid>

        <Grid size={{ xs: 4, md: 3, lg: 4.1, xl: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => {
              deleteRecipe();
              navigate(-1);
            }}
          >
            Delete
          </Button>
        </Grid>

        {errorText && (
          <Grid size={{ xs: 8, md: 6.5, lg: 4, xl: 6.5 }}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorText}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
