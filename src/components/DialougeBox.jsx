const DialogueBox = ({ character, text }) => {
  return (
    <div className="bg-white p-6 rounded-t-lg shadow-sm border-2 border-b-0 border-gray-200">
      <h3 className="font-bold text-blue-600 mb-2 uppercase tracking-wide text-sm">
        {character}
      </h3>
      <p className="text-gray-800 text-xl leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export default DialogueBox;