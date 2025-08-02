import { useDeleteChef } from "../../hooks/api/useDeleteChef.api";
import { useGetChefs } from "../../hooks/api/useGetChefs.api";
import { useSaveChef } from "../../hooks/api/useSaveChef.api";
import ChefTable from "../../components/chefTable/ChefTable";
import { type FC } from "react";
import { isAxiosError } from "axios";
import swal from "sweetalert";
import BackdropLoading from "../../components/backdropLoading/BackdropLoading";
import CentralErrorAlert from "../../components/centralErrorAlert/CentralErrorAlert";

const ChefPage: FC = () => {
  const { data: chefs, isLoading } = useGetChefs();

  const displayError = (err: unknown) => {
    let text = "";
    if (isAxiosError(err))
      text = err.response?.data?.message || "Something went wrong";
    else text = "Something went wrong";
    swal("Error", text, "error");
  };

  const { mutateAsync: deleteChef } = useDeleteChef(displayError, (data) => {
    swal("Success", data.message, "success");
  });
  const { mutateAsync: saveChef } = useSaveChef(displayError, (data) => {
    swal("Success", data.message, "success");
  });

  if (isLoading) return <BackdropLoading />;

  if (chefs) {
    return (
      <ChefTable chefs={chefs} deleteChef={deleteChef} saveChef={saveChef} />
    );
  }

  return <CentralErrorAlert text="Something went wrong..." />;
};

export default ChefPage;
