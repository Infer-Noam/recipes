import { Alert, AlertTitle, Box } from "@mui/material";
import { useDeleteChef } from "../../hooks/api/useDeleteChef.api";
import { useGetChefs } from "../../hooks/api/useGetChefs.api";
import { useSaveChef } from "../../hooks/api/useSaveChef.api";
import ChefTable from "../../components/chefTable/chefTable";
import Styles from "./chefPage.style";
import { useState } from "react";
import { isAxiosError } from "axios";
import type { FC } from "react";
import CentralErrorAlert from "../../components/centralErrorAlert/CentralErrorAlert";

const ChefPage: FC = () => {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isError, setIsError] = useState<boolean>(false);

  const { data: chefs } = useGetChefs();
  const { mutateAsync: deleteChef } = useDeleteChef(
    (err) => {
      if (isAxiosError(err)) setMessage(err.response?.data.message);
      else setMessage("Something went wrong");
      setIsError(true);
    },
    (data) => {
      setMessage(data.message);
      setIsError(false);
    }
  );
  const { mutateAsync: saveChef } = useSaveChef(
    (err) => {
      if (isAxiosError(err)) setMessage(err.response?.data.message);
      else setMessage("Something went wrong");
      setIsError(true);
    },
    (data) => {
      setMessage(data.message);
      setIsError(false);
    }
  );

  type AlertInfo = {
    severity: "success" | "error";
    title: "Success" | "Error";
  };

  const errorAlert: Record<"success" | "error", AlertInfo> = {
    error: {
      severity: "error",
      title: "Error",
    },
    success: {
      severity: "success",
      title: "Success",
    },
  };

  const alert = isError ? errorAlert.error : errorAlert.success;

  if (chefs) {
    return (
      <Box>
        <ChefTable chefs={chefs} deleteChef={deleteChef} saveChef={saveChef} />
        {message && (
          <Alert sx={Styles.alert} severity={alert.severity}>
            <AlertTitle>{alert.title}</AlertTitle>
            {message}
          </Alert>
        )}
      </Box>
    );
  }

  return <CentralErrorAlert text="Something went wrong..." />;
};

export default ChefPage;
