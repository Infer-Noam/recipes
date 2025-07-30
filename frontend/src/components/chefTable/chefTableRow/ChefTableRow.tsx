import { IconButton, TableCell, TableRow, TextField } from "@mui/material";
import type { ChefDetails } from "@shared/types/chef.type";
import { useEffect, useState, type FC } from "react";
import Styles from "./chefTableRow.style";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from "@mui/icons-material/Remove";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChefDetailsSchema } from "../../../../../shared/validation/chefDetailsSchema.validation";

type ChefTableRowProps = {
  chef: ChefDetails;
  saveChef: (chef: ChefDetails) => void;
  deleteChef: () => void;
};

const ChefTableRow: FC<ChefTableRowProps> = ({
  chef: {
    uuid,
    firstName: initialFirstName,
    lastName: initialLastName,
    email: initialEmail,
    phone: initialPhone,
  },
  saveChef,
  deleteChef,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChefDetails>({
    defaultValues: {
      uuid,
      firstName: initialFirstName,
      lastName: initialLastName,
      email: initialEmail,
      phone: initialPhone,
    },
    resolver: zodResolver(ChefDetailsSchema),
  });

  const allValues = watch();

  const onSubmit = () => {
    saveChef({
      ...allValues,
    });
  };

  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const changed =
      allValues.firstName !== initialFirstName ||
      allValues.lastName !== initialLastName ||
      allValues.email !== initialEmail ||
      allValues.phone !== initialPhone;
    setHasChanged(changed);
  }, [
    allValues,
    initialFirstName,
    initialLastName,
    initialEmail,
    initialPhone,
  ]);

  return (
    <TableRow sx={Styles.chefTableRow}>
      <TableCell sx={Styles.centerAlign}>
        <IconButton onClick={deleteChef}>
          <RemoveIcon />
        </IconButton>
      </TableCell>
      <TableCell sx={Styles.centerAlign}>
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              sx={Styles.firstNameTextField}
              variant="outlined"
              error={!!errors.firstName}
              helperText={errors.firstName && "First name is required"}
            />
          )}
        />
      </TableCell>
      <TableCell sx={Styles.centerAlign}>
        <Controller
          name="lastName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              sx={Styles.lastNameTextField}
              variant="outlined"
              error={!!errors.lastName}
              helperText={errors.lastName && "Last name is required"}
            />
          )}
        />
      </TableCell>
      <TableCell sx={Styles.centerAlign}>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              sx={Styles.emailTextField}
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email && "Valid email is required"}
            />
          )}
        />
      </TableCell>
      <TableCell sx={Styles.centerAlign}>
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              sx={Styles.phoneTextField}
              variant="outlined"
              error={!!errors.phone}
              helperText={errors.phone && "Valid phone is required"}
            />
          )}
        />
      </TableCell>

      <TableCell>
        {hasChanged && (
          <IconButton onClick={() => handleSubmit(onSubmit)()}>
            <CheckIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ChefTableRow;
