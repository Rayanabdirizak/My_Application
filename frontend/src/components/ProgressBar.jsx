function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded-full">
      <div
        className="bg-green-500 text-white text-center rounded-full"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
}

export default ProgressBar;