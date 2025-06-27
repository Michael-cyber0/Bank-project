const Input = ({ type, placeholder, name, value, onChange }) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="input-field"
      />
    </div>
  );
};

export default Input;
