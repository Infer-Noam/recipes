import { IconButton, TableCell, TableRow, TextField } from "@mui/material";
import type { ChefDetails } from "@shared/types/chef.type";
import { useEffect, useState, type FC } from "react";
import Styles from "./chefTableRow.style";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from "@mui/icons-material/Remove";

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
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);

  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const changed =
      firstName !== initialFirstName ||
      lastName !== initialLastName ||
      email !== initialEmail ||
      phone !== initialPhone;
    setHasChanged(changed);
  }, [
    firstName,
    lastName,
    email,
    phone,
    initialFirstName,
    initialLastName,
    initialEmail,
    initialPhone,
  ]);

  return (
    <TableRow sx={Styles.chefTableRow}>
      <TableCell align="center">
        {
          <IconButton onClick={deleteChef}>
            <RemoveIcon />
          </IconButton>
        }
      </TableCell>
      <TableCell align="center">
        <TextField
          sx={Styles.firstNameTextField}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          variant="outlined"
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          sx={Styles.lastNameTextField}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          variant="outlined"
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          sx={Styles.emailTextField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          sx={Styles.phoneTextField}
          value={phone}
          onChange={(e) => {
            const value = e.target.value;
            !isNaN(Number(value)) &&
              value.length <= 10 &&
              setPhone(e.target.value);
          }}
          variant="outlined"
        />
      </TableCell>

      <TableCell>
        {hasChanged && (
          <IconButton
            onClick={() =>
              saveChef({
                uuid,
                firstName,
                lastName,
                email,
                phone,
              })
            }
          >
            <CheckIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ChefTableRow;
