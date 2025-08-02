import { type FC } from "react";
import { type RecipeDetails } from "../../../../shared/types/recipe.type";
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
} from "@mui/material";
import Styles from "./recipe.style";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RecipeStepsList from "./recipeSteps/RecipeStepsList";
import type { DraftRecipeIngredient } from "./recipeIngredientTable/draftRecipeIngredient.type";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSaveRecipe } from "../../hooks/api/useSaveRecipe.api";
import { useDeleteRecipe } from "../../hooks/api/useDeleteRecipe.api";
import { isAxiosError } from "axios";
import swal from "sweetalert";

export type RecipeInputs = {
  name: string;
  steps: string[];
  chef: ChefModel;
  ingredients: DraftRecipeIngredient[];
  description: string;
  imageUrl: string;
};

type RecipeProps = {
  uuid: string;
  initialRecipe: RecipeInputs | undefined;
  chefs: ChefModel[];
  ingredients: IngredientModel[];
};

export const Recipe: FC<RecipeProps> = ({
  uuid,
  initialRecipe,
  chefs,
  ingredients,
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<RecipeInputs>({
    defaultValues: initialRecipe ?? {
      name: "",
      chef: undefined,
      description: "",
      imageUrl: "",
      steps: [],
      ingredients: [],
    },
  });
  const { chef, imageUrl } = watch();

  const displayError = (err: unknown) => {
    let text = "";
    if (isAxiosError(err))
      text = err.response?.data?.message || "Failed to save recipe";
    else text = "Something went wrong";
    swal("Error", text, "error");
  };
  const { mutateAsync: saveRecipe } = useSaveRecipe(displayError, () => {
    navigate(-1);
  });
  const { mutate: deleteRecipe } = useDeleteRecipe(displayError, () => {
    navigate(-1);
  });

  const onSubmit: SubmitHandler<RecipeInputs> = async ({
    name,
    chef,
    description,
    imageUrl,
    steps,
    ingredients,
  }) => {
    const recipeDetails: RecipeDetails = {
      uuid,
      name,
      chef,
      description,
      imageUrl,
      steps,
      ingredients: ingredients.map((recipeIngredient) => ({
        uuid: recipeIngredient.uuid,
        recipe: { uuid },
        ingredient: { uuid: recipeIngredient!.ingredient!.uuid! },
        amount: recipeIngredient!.amount!,
        measurementUnit: recipeIngredient!.measurementUnit!,
      })),
    };

    await saveRecipe(recipeDetails);
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
              deleteRecipe(uuid);
            }}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
