import { type FC } from "react";
import Styles from "./recipeIngredientsTable.style";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TextField,
  Autocomplete,
  Paper,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Button,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  AccordionActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  type RecipeIngredientDetails,
  type RecipeIngredient as RecipeIngredientModel,
} from "../../../../../shared/types/recipeIngredient.type";
import { type Ingredient as IngredientModel } from "../../../../../shared/types/ingredient.type";
import { MeasurementUnit } from "../../../../../shared/enums/measurement-unit.enum";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { v4 as uuidv4 } from "uuid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller, type Control } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import type { RecipeDetails } from "@shared/types/recipe.type";

type RecipeIngredientsTableProps = {
  ingredients: IngredientModel[];
  control: Control<RecipeDetails, unknown, RecipeDetails>;
  recipeUuid: String;
};

export const RecipeIngredientsTable: FC<RecipeIngredientsTableProps> = ({
  ingredients,
  control,
  recipeUuid,
}) => {
  const setRecipeIngredient = (
    updatedFields: Partial<RecipeIngredientModel>,
    value: RecipeIngredientDetails[],
    onChange: (...event: any[]) => void,
    uuid?: string
  ) => {
    onChange(
      value.map((ri) => (ri.uuid === uuid ? { ...ri, ...updatedFields } : ri))
    );
  };

  const CustomTableCell: FC<{ label: string }> = ({ label }) => (
    <TableCell sx={Styles.centerAlign}>
      <Typography variant="subtitle1" sx={Styles.labelTypography}>
        {label}
      </Typography>
    </TableCell>
  );

  const {
    formState: { errors },
  } = useFormContext();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Controller
      name="ingredients"
      control={control}
      render={({
        field: { value: recipeIngredients, onChange: setRecipeIngredients },
        fieldState: { error },
      }) => (
        <Box>
          <Accordion defaultExpanded={!isXs}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography component="span">Ingredients</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {recipeIngredients.length > 0 && (
                <TableContainer component={Paper}>
                  <Table sx={Styles.container} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <CustomTableCell label="Ingredient" />
                        <CustomTableCell label="Amount" />
                        <CustomTableCell label="Measurement unit" />
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recipeIngredients.map((ri, index) => {
                        const amountError =
                          Array.isArray(errors.ingredients) &&
                          errors.ingredients[index]?.amount;

                        const measurementUnitError =
                          Array.isArray(errors.ingredients) &&
                          errors.ingredients[index]?.measurementUnit;

                        const ingredientError =
                          Array.isArray(errors.ingredients) &&
                          errors.ingredients[index]?.ingredient;

                        return (
                          <TableRow
                            key={ri.uuid}
                            sx={Styles.recipeIngredientTableRow}
                          >
                            <TableCell sx={Styles.centerAlign}>
                              <Box sx={Styles.ingredientAutocompleteBox}>
                                <Autocomplete
                                  sx={Styles.ingredientAutocomplete}
                                  value={
                                    ingredients.find(
                                      (i) => i.uuid === ri.ingredient?.uuid
                                    )?.name ?? ""
                                  }
                                  onChange={(
                                    _: any,
                                    newValue: string | null
                                  ) => {
                                    if (!newValue) return;

                                    const ingredientIndex =
                                      ingredients.findIndex(
                                        (i) => i.name === newValue
                                      );

                                    if (ingredientIndex === -1) return;

                                    setRecipeIngredient(
                                      {
                                        ingredient:
                                          ingredients[ingredientIndex],
                                      },
                                      recipeIngredients,
                                      setRecipeIngredients,
                                      ri.uuid
                                    );
                                  }}
                                  options={ingredients.map((i) => i.name)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={!!ingredientError}
                                      helperText={
                                        ingredientError?.message &&
                                        "Ingredient is required"
                                      }
                                    />
                                  )}
                                />
                              </Box>
                            </TableCell>
                            <TableCell sx={Styles.centerAlign}>
                              <TextField
                                type="number"
                                value={ri?.amount}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (value >= 0 && value <= 99) {
                                    setRecipeIngredient(
                                      { amount: value },
                                      recipeIngredients,
                                      setRecipeIngredients,
                                      ri.uuid
                                    );
                                  }
                                }}
                                slotProps={{
                                  input: {
                                    sx: Styles.amountTextFieldInput,
                                    inputProps: {
                                      min: 0,
                                      max: 99,
                                    },
                                  },
                                }}
                                variant="outlined"
                                error={!!amountError}
                                helperText={
                                  amountError?.message &&
                                  "Valid amount is required"
                                }
                              />
                            </TableCell>
                            <TableCell sx={Styles.centerAlign}>
                              <Select
                                sx={Styles.measurementUnitSelect}
                                value={ri.measurementUnit}
                                onChange={(e) => {
                                  setRecipeIngredient(
                                    {
                                      measurementUnit: e.target.value,
                                    },
                                    recipeIngredients,
                                    setRecipeIngredients,
                                    ri.uuid
                                  );
                                }}
                                error={!!measurementUnitError}
                              >
                                {Object.values(MeasurementUnit).map(
                                  (m, index) => (
                                    <MenuItem key={index} value={m}>
                                      {m}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  setRecipeIngredients(
                                    recipeIngredients.filter(
                                      (recipeIngredient) =>
                                        ri.uuid !== recipeIngredient.uuid
                                    )
                                  )
                                }
                              >
                                <RemoveIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow></TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </AccordionDetails>
            <AccordionActions>
              <Button
                onClick={() =>
                  setRecipeIngredients([
                    ...recipeIngredients,
                    { uuid: uuidv4(), recipe: { uuid: recipeUuid } },
                  ])
                }
                startIcon={<AddIcon />}
              >
                Add ingredient
              </Button>
            </AccordionActions>
          </Accordion>
          {error && (
            <Typography color="error" variant="caption" sx={Styles.error}>
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};
