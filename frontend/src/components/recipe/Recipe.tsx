import { useMemo, type FC } from "react";
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
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSaveRecipe } from "../../hooks/api/useSaveRecipe.api";
import { useDeleteRecipe } from "../../hooks/api/useDeleteRecipe.api";
import { isAxiosError } from "axios";
import swal from "sweetalert";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecipeDetailsSchema } from "../../../../shared/validation/recipeDetailsSchema.validation";

type RecipeProps = {
  uuid: string;
  initialRecipe: RecipeDetails | undefined;
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

  const methods = useForm<RecipeDetails>({
    defaultValues: initialRecipe ?? {
      uuid,
      name: "",
      chef: undefined,
      description: "",
      imageUrl: "",
      steps: [],
      ingredients: [],
    },
    resolver: zodResolver(RecipeDetailsSchema),
  });

  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = methods;

  const allValues = watch();

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

  const chef = useMemo(
    () => chefs.find((c) => c.uuid === allValues?.chef?.uuid),
    [allValues?.chef?.uuid]
  );

  return (
    <FormProvider {...methods}>
      <Grid container spacing={2} sx={Styles.gridContainer}>
        <Grid size={{ xs: 6, lg: 3.5, xl: 6 }}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                sx={Styles.nameTextField}
                label="Recipe name"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name && "Recipe name is required"}
              />
            )}
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
                  getOptionLabel={(option) => {
                    const chef = chefs.find((c) => c.uuid === option.uuid);
                    return `${chef?.firstName} ${chef?.lastName}`;
                  }}
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
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                label="Short description"
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8, xl: 6 }}>
          <Controller
            name="imageUrl"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Image url"
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Open image"
                          onClick={() => window.open(field.value)}
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
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 8, xl: 6 }}>
          <RecipeStepsList control={control} />
        </Grid>
        <Grid size={{ xs: 12, lg: 8, xl: 6 }}>
          <RecipeIngredientsTable
            ingredients={ingredients}
            control={control}
            recipeUuid={uuid}
          />
        </Grid>

        <Grid size={{ xs: 4, md: 3, lg: 4.1, xl: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleSubmit(async () => await saveRecipe(allValues))}
          >
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
    </FormProvider>
  );
};
