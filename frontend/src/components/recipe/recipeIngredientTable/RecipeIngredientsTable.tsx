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
import { type RecipeIngredient as RecipeIngredientModel } from "../../../../../shared/types/recipeIngredient.type";
import { type Ingredient as IngredientModel } from "../../../../../shared/types/ingredient.type";
import { MeasurementUnit } from "../../../../../shared/enums/measurement-unit.enum";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { type DraftRecipeIngredient } from "./draftRecipeIngredient.type";
import { v4 as uuidv4 } from "uuid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomTableCell from "../../customTableCell/CustomTableCell";
import { Controller, type Control } from "react-hook-form";
import type { RecipeInputs } from "../recipe";

type RecipeIngredientsTableProps = {
  ingredients: IngredientModel[];
  control: Control<RecipeInputs, any, RecipeInputs>;
};

export const RecipeIngredientsTable: FC<RecipeIngredientsTableProps> = ({
  ingredients,
  control,
}) => {
  const setRecipeIngredient = (
    updatedFields: Partial<RecipeIngredientModel>,
    value: DraftRecipeIngredient[],
    onChange: (...event: any[]) => void,
    uuid?: string
  ) => {
    onChange(
      value.map((recipeIngredient) => (recipeIngredient.uuid === uuid ? { ...recipeIngredient, ...updatedFields } : recipeIngredient))
    );
  };

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Controller
      name="recipeIngredients"
      control={control}
      rules={{
        required: "At least one ingredient is required",
        validate: {
          minIngredients: (value) =>
            value.length >= 1 || "Recipe must have at least one ingredient",
          validIngredients: (value) => {
            const invalidIngredients = value.filter(
              (ingredient) =>
                !ingredient.ingredient?.uuid ||
                !ingredient.amount ||
                ingredient.amount <= 0 ||
                !ingredient.measurementUnit
            );
            return (
              invalidIngredients.length === 0 ||
              `${invalidIngredients.length} one or more ingredient is invalid`
            );
          },
          maxIngredients: (value) =>
            value.length <= 50 || "Recipe cannot have more than 50 ingredients",
        },
      }}
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
                      {recipeIngredients.map((recipeIngredient) => (
                        <TableRow
                          key={recipeIngredient.uuid}
                          sx={Styles.recipeIngredientTableRow}
                        >
                          <TableCell sx={Styles.centerAlign}>
                            <Box sx={Styles.ingredientAutocompleteBox}>
                              <Autocomplete
                                sx={Styles.ingredientAutocomplete}
                                value={
                                  ingredients.find(
                                    (ingredient) => ingredient.uuid === recipeIngredient.ingredient?.uuid
                                  )?.name ?? ""
                                }
                                onChange={(_: any, newValue: string | null) => {
                                  if (!newValue) return;

                                  const ingredientIndex = ingredients.findIndex(
                                    (i) => i.name === newValue
                                  );

                                  if (ingredientIndex === -1) return;

                                  setRecipeIngredient(
                                    {
                                      ingredient: ingredients[ingredientIndex],
                                    },
                                    recipeIngredients,
                                    setRecipeIngredients,
                                    recipeIngredient.uuid
                                  );
                                }}
                                options={ingredients.map((i) => i.name)}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            </Box>
                          </TableCell>
                          <TableCell sx={Styles.centerAlign}>
                            <TextField
                              type="number"
                              value={recipeIngredient?.amount}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value >= 0 && value <= 99) {
                                  setRecipeIngredient(
                                    { amount: value },
                                    recipeIngredients,
                                    setRecipeIngredients,
                                    recipeIngredient.uuid
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
                            />
                          </TableCell>
                          <TableCell sx={Styles.centerAlign}>
                            <Select
                              sx={Styles.measurementUnitSelect}
                              value={recipeIngredient.measurementUnit}
                              onChange={(e) => {
                                setRecipeIngredient(
                                  {
                                    measurementUnit: e.target.value,
                                  },
                                  recipeIngredients,
                                  setRecipeIngredients,
                                  recipeIngredient.uuid
                                );
                              }}
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
                                      recipeIngredient.uuid !== recipeIngredient.uuid
                                  )
                                )
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
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
                    { uuid: uuidv4() },
                  ])
                }
                startIcon={<AddIcon />}
              >
                Add ingredient
              </Button>
            </AccordionActions>
          </Accordion>
          {error && (
            <Typography
              color="error"
              variant="caption"
              sx={Styles.errorTypography}
            >
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};
