const Password = ({ type, placeholder, name, value, onChange }) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="password-field"
      />
    </div>
  );
};
export default Password;
