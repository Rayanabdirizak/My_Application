import { useNavigate } from "react-router-dom";

function CertificateButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/certificate")}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      View Certificate
    </button>
  );
}

export default CertificateButton;