import {
  type ChangeEvent,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
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

type RecipeIngredientsTableProps = {
  recipeIngredients: DraftRecipeIngredient[];
  ingredients: IngredientModel[];
  setRecipeIngredients: Dispatch<SetStateAction<DraftRecipeIngredient[]>>;
};

export const RecipeIngredientsTable: FC<RecipeIngredientsTableProps> = ({
  recipeIngredients,
  ingredients,
  setRecipeIngredients,
}) => {
  const setRecipeIngredient = (
    updatedFields: Partial<RecipeIngredientModel>,
    uuid?: string
  ) => {
    setRecipeIngredients((prev) =>
      prev.map((recipeIngredient) =>
        recipeIngredient.uuid === uuid
          ? { ...recipeIngredient, ...updatedFields }
          : recipeIngredient
      )
    );
  };

  const onAmountChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    uuid: string
  ) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 99) {
      setRecipeIngredient({ amount: value }, uuid);
    }
  };

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Accordion defaultExpanded={!isXs}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="span">Ingredients</Typography>
      </AccordionSummary>
      <AccordionDetails>
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
                  <TableCell align="center">
                    <Box sx={Styles.ingredientAutocompleteBox}>
                      <Autocomplete
                        sx={Styles.ingredientAutocomplete}
                        value={
                          ingredients.find(
                            (i) => i.uuid === recipeIngredient.ingredient?.uuid
                          )?.name ?? ""
                        }
                        onChange={(_: any, newValue: string | null) => {
                          if (!newValue) return;

                          const ingredientIndex = ingredients.findIndex(
                            (ingredient) => ingredient.name === newValue
                          );
                          if (ingredientIndex === -1) return;

                          setRecipeIngredient(
                            {
                              ingredient: ingredients[ingredientIndex],
                            },
                            recipeIngredient.uuid
                          );
                        }}
                        options={ingredients.map(
                          (ingredient) => ingredient.name
                        )}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={recipeIngredient?.amount ?? 0}
                      onChange={(e) => onAmountChange(e, recipeIngredient.uuid)}
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
                  <TableCell align="center">
                    <Select
                      sx={Styles.measurementUnitSelect}
                      value={recipeIngredient.measurementUnit}
                      onChange={(e) => {
                        setRecipeIngredient(
                          {
                            measurementUnit: e.target.value,
                          },
                          recipeIngredient.uuid
                        );
                      }}
                    >
                      {Object.values(MeasurementUnit).map(
                        (measurementUnit, index) => (
                          <MenuItem key={index} value={measurementUnit}>
                            {measurementUnit}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setRecipeIngredients((prev) =>
                          prev.filter((p) => recipeIngredient.uuid !== p.uuid)
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
      </AccordionDetails>
      <AccordionActions>
        <Button
          onClick={() =>
            setRecipeIngredients((prev) => [...prev, { uuid: uuidv4() }])
          }
          startIcon={<AddIcon />}
        >
          Add ingredient
        </Button>
      </AccordionActions>
    </Accordion>
  );
};
