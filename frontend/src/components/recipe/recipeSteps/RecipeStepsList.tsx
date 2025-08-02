import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import type { FC } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import Styles from "./recipeStepsList.style";
import type { RecipeInputs } from "../recipe";
import { Controller, type Control } from "react-hook-form";

type RecipeStepsListProps = {
  control: Control<RecipeInputs, any, RecipeInputs>;
};
const RecipeStepsList: FC<RecipeStepsListProps> = ({ control }) => {
  const setStep = (
    index: number,
    steps: string[],
    newStep: string,
    onChange: (...event: any[]) => void
  ) => {
    onChange(steps.map((step, i) => (index === i ? newStep : step)));
  };

  const addStep = (steps: string[], onChange: (...event: any[]) => void) => {
    onChange([...steps, ""]);
  };

  const removeStep = (
    index: number,
    steps: string[],
    onChange: (...event: any[]) => void
  ) => {
    onChange(steps.filter((_, i) => index !== i));
  };

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Controller
      name="steps"
      control={control}
      rules={{
        required: "At least one step is required",
        validate: {
          minSteps: (value) =>
            value.length >= 1 || "Recipe must have at least one step",
          noEmptySteps: (value) =>
            value.every((step) => step.trim().length > 0) ||
            "All steps must have content",
          maxSteps: (value) =>
            value.length <= 20 || "Recipe cannot have more than 20 steps",
        },
      }}
      render={({
        field: { value: steps, onChange },
        fieldState: { error },
      }) => (
        <Box>
          <Accordion defaultExpanded={!isXs}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography component="span">Steps</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {steps.map((step, index) => {
                  return (
                    <ListItem key={index}>
                      <ListItemText sx={Styles.textField}>
                        <TextField
                          multiline
                          fullWidth
                          id="outlined-basic"
                          label={`Step ${index + 1}`}
                          variant="outlined"
                          value={step}
                          onChange={(e) =>
                            setStep(index, steps, e.target.value, onChange)
                          }
                        />
                      </ListItemText>
                      <ListItemIcon>
                        <IconButton
                          onClick={() => removeStep(index, steps, onChange)}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </ListItemIcon>
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
            <AccordionActions>
              <Button
                onClick={() => addStep(steps, onChange)}
                startIcon={<AddIcon />}
              >
                Add step
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

export default RecipeStepsList;
