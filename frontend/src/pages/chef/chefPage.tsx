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
  const { data: chefs } = useGetChefs();
  const { mutate: deleteChef } = useDeleteChef();
  const { mutateAsync: saveChef, error, isError } = useSaveChef();

  const [message, setMessage] = useState<string | undefined>(undefined);

  if (chefs) {
    return (
      <Box>
        <ChefTable
          chefs={chefs}
          deleteChef={(uuid) => {
            deleteChef(uuid);
            setMessage(undefined);
          }}
          saveChef={async (chefDetails) => {
            setMessage(undefined);
            await saveChef(chefDetails)
              .then((response) => setMessage(response.message))
              .catch((err) => {
                if (isAxiosError(err)) setMessage(err.response?.data.message);
                else setMessage(error?.message);
              });
          }}
        />
        {message && (
          <Alert sx={Styles.alert} severity={isError ? "error" : "success"}>
            <AlertTitle>{isError ? "Error" : "Success"}</AlertTitle>
            {message}
          </Alert>
        )}
      </Box>
    );
  }

  return <CentralErrorAlert text="Something went wrong..." />;
};

export default ChefPage;
