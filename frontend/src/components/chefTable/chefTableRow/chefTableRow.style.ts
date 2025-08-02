import type { SxProps } from "@mui/material";

const chefTableRow: SxProps = {
  "&:last-child td, &:last-child th": { border: 0 },
};

const firstNameTextField: SxProps = { width: "100px" };

const lastNameTextField: SxProps = { width: "100px" };

const emailTextField: SxProps = { width: "230px" };

const phoneTextField: SxProps = { width: "120px" };

export default {
  chefTableRow,
  firstNameTextField,
  lastNameTextField,
  emailTextField,
  phoneTextField,
};
