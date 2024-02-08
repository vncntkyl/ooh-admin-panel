import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function NavigateBack() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigates back to the previous location
  };

  return (
    <button
      onClick={goBack}
      className="text-xs xl:text-sm underline flex items-center"
    >
      <MdKeyboardArrowLeft />
      Back
    </button>
  );
}

export default NavigateBack;
