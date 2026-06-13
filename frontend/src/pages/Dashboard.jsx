import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ProgressBar from "../../components/ProgressBar";
import NotesPanel from "../../components/NotesPanel";
import CertificateButton from "../../components/CertificateButton";

function Dashboard() {
  const progress = 80;

  return (
    <>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6">
          <h1 className="text-3xl mb-5">
            Dashboard
          </h1>

          <ProgressBar progress={progress} />

          <div className="mt-6">
            <NotesPanel />
          </div>

          {progress === 100 && (
            <div className="mt-4">
              <CertificateButton />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;