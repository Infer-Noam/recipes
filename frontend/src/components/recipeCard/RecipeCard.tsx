import { useState, type FC } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Styles from "./recipeCard.style";
import { type Recipe as RecipeModel } from "../../../../shared/types/recipe.type";
import { type RecipeIngredient as RecipeIngredientModel } from "../../../../shared/types/recipeIngredient.type";
import { useNavigate } from "react-router-dom";
import { RecipeMenu } from "./recipeCardMenu/RecipeCardMenu";

type RecipeCardProps = {
  recipe: RecipeModel;
  deleteRecipe: () => void;
  chefAvatarSrc: string;
};

export const RecipeCard: FC<RecipeCardProps> = ({
  recipe: { uuid, name, imageUrl, chef, description, createDate, ingredients },
  deleteRecipe,
  chefAvatarSrc,
}) => {
  const formatIngredients = (ingredients: RecipeIngredientModel[]) =>
    ingredients.map((ri, index) => (
      <Typography variant="body2" key={index}>
        {`${ri.amount} ${ri.measurementUnit} of ${ri.ingredient.name}`}
      </Typography>
    ));

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Card variant="outlined" sx={Styles.card}>
        <CardHeader
          avatar={
            <Avatar
              alt={`${chef.firstName} ${chef.lastName}`}
              src={chefAvatarSrc}
              sx={Styles.chefAvatar}
            />
          }
          action={
            <IconButton aria-label="more" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={name}
          subheader={`By ${chef.firstName} ${chef.lastName}`}
        />
        <CardMedia
          component="img"
          height="200px"
          image={imageUrl}
          alt={`An image of ${name}`}
        />
        <CardContent>
          <Typography variant="body2" sx={Styles.descriptionTypography}>
            {description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Typography variant="body2">
            {new Date(createDate).toDateString()}
          </Typography>
          <Tooltip
            sx={Styles.tooltip}
            title={
              <Box component="span">
                <Typography variant="subtitle1">Ingredients</Typography>
                {formatIngredients(ingredients)}
              </Box>
            }
            arrow
          >
            <IconButton aria-label="ingredients">
              <FormatListBulletedIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
      <RecipeMenu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        onDelete={deleteRecipe}
        onView={() => navigate(`recipe/${uuid}`)}
      />
    </>
  );
};
