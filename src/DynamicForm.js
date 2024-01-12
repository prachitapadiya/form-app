import { useState, useRef } from "react";
import "./App.css";

function DynamicForm() {
  const [formValues, setFormValues] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({ Name: "", phoneNumber: "" });
  const [toggle, setToggle] = useState(false);
  const [ischeckboxSelected, setIsCheckboxSelected] = useState("");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [showAddOptionButton, setShowAddOptionButton] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState("");
  const inputRef = useRef();
  const selectRef = useRef();

  const loadFormConfig = (e) => {
    e.preventDefault();
    const storedConfig = localStorage.getItem("formConfig");
    if (storedConfig) {
      setFormValues(JSON.parse(storedConfig));
    }
    alert("Form Configuration loaded");
  };

  const saveFormConfig = (e) => {
    e.preventDefault();
    localStorage.setItem("formConfig", JSON.stringify(formValues));
    alert("Form Configuration saved");
  };

  const addOption = (e) => {
    e.preventDefault();
    if (newOption.trim() !== "") {
      setOptions([...options, newOption]);
      setNewOption("");
    }
    setToggle(false);
  };

  const dropDownHandler = (e) => {
    e.preventDefault();
    setShowAddOptionButton(false);
  };

  const handleChange = (e, index, value) => {
    const values = [...formValues];
    values[index].value = e.target.value;
    setFormValues(values);
    setFormData({ ...formData, [values[index].label]: e.target.value });
  };

  const handleRadioChange = (e, index, value) => {
    const values = [...formValues];
    setSelectedRadio(e.target.value);
    values[index].value = e.target.value;
    setFormValues(values);
    setFormData({ ...formData, [values[index].label]: e.target.value });
  };

  const handleAddField = (e) => {
    e.preventDefault();
    const values = [...formValues];
    values.push({
      label: inputRef.current.value || "label",
      type: selectRef.current.value || "text",
      value: "",
    });
    setFormValues(values);
    setToggle(false);
  };

  const handleDeleteField = (e, index) => {
    const values = [...formValues];
    values.splice(index, 1);
    setFormValues(values);
  };

  const addBtnClick = (e) => {
    e.preventDefault();
    setToggle(true);
  };

  const validateForm = () => {
    let errors = { Name: "", phoneNumber: "" };
    formValues.map((obj, index) => {
      if (obj.label === "Phone Number") {
        if (obj.value.length < 10) {
          errors.phoneNumber = "Phone Number should be at least of 10 digits";
        }
      }

      if (obj.label === "Name") {
        if (obj.value.length < 2) {
          errors.Name = "Name should be of at least 3 digits";
        }
      }
    });
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = validateForm();
    if (data) {
      setErrors({
        Name: data.Name,
        phoneNumber: data.phoneNumber,
      });
    }
    if (data.Name === "" && data.phoneNumber === "") {
      setSubmitting(true);
      alert("Form Submitted successfully");
    }
    console.log(
      formValues.map((val) => {
        return { [val.label]: val.value };
      })
    );
  };

  const handleChangeCheckbox = (e, index) => {
    const values = [...formValues];
    setIsCheckboxSelected(e.target.checked);
    values[index].value = e.target.checked;
    setFormValues(values);
    setFormData({ ...formData, [values[index].label]: e.target.value });
  };

  return (
    <div className="App">
      <h1 className="headerStyle">Dynamic Form Generator</h1>
      {submitting ? (
        <h2 className="success">Successfully submitted ✓</h2>
      ) : null}
      <form onSubmit={handleSubmit}>
        {formValues.map((obj, index) => (
          <div className="input-group">
            {obj.type !== "checkbox" && (
              <label className="labelClass" htmlFor={obj.label}>
                {obj.label}
              </label>
            )}
            {obj.type === "text" && (
              <div className="input">
                <input
                  type="text"
                  id={obj.label}
                  value={obj.value}
                  index={index}
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                />

                <div>
                  <button onClick={(e) => handleDeleteField(e, index)}>
                    X
                  </button>
                </div>

                {errors.Name ? (
                  <p className="error">
                    Name Should be at least 5 characters long.
                  </p>
                ) : null}
              </div>
            )}

            {obj.type === "number" && (
              <div className="input">
                <input
                  type="number"
                  id={obj.label}
                  value={obj.value}
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                />
                <div>
                  <button onClick={(e) => handleDeleteField(e, index)}>
                    X
                  </button>
                </div>
                {errors.phoneNumber ? (
                  <p className="error">
                    Phone Number should be at least 10 characters long.
                  </p>
                ) : null}
              </div>
            )}

            {obj.type === "dropdown" && (
              <div className="input" style={{ backgroundColor: "white" }}>
                <select
                  id={obj.label}
                  value={obj.value}
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                >
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div style={{ backgroundColor: "white" }}>
                  {showAddOptionButton && (
                    <div style={{ flexDirection: "column" }}>
                      <label className="labelClass">New Option:</label>
                      <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                      />
                      <button onClick={addOption}>Add Option</button>
                      <button onClick={dropDownHandler}>Done</button>
                    </div>
                  )}
                </div>
                <div style={{ backgroundColor: "#e34728" }}>
                  <button onClick={(e) => handleDeleteField(e, index)}>
                    X
                  </button>
                </div>
              </div>
            )}
            {obj.type === "checkbox" && (
              <div
                className="input"
                style={{
                  backgroundColor: "white",
                  marginLeft: "0px",
                  paddingLeft: "0px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    width: "80%",
                    float: "left",
                  }}
                >
                  <input
                    className="custom-checkbox"
                    type="checkbox"
                    id={obj.label}
                    checked={obj.value || false}
                    onChange={(e) => {
                      handleChangeCheckbox(e, index);
                    }}
                  />
                  <label className="labelClass">{obj.label}</label>
                </div>
                <div style={{ backgroundColor: "#e34728" }}>
                  <button onClick={(e) => handleDeleteField(e, index)}>
                    X
                  </button>
                </div>
              </div>
            )}
            {obj.type === "radio" && (
              <div className="input">
                <label>
                  <input
                    type="radio"
                    value="Female"
                    checked={selectedRadio === "Female"}
                    onChange={(e) => {
                      handleRadioChange(e, index, "Female");
                    }}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    value="Male"
                    checked={selectedRadio === "Male"}
                    onChange={(e) => {
                      handleChange(e, index, "Male");
                    }}
                  />
                  Male
                </label>
                <div style={{ backgroundColor: "#e34728" }}>
                  <button onClick={(e) => handleDeleteField(e, index)}>
                    X
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!toggle ? (
          <div className="center">
            <button className="add-btn" onClick={addBtnClick}>
              Add new
            </button>
          </div>
        ) : (
          <div className="dialog-box">
            <input type="text" placeholder="label" ref={inputRef} />
            <select ref={selectRef}>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="checkbox">checkbox</option>
              <option value="radio">radio</option>
              <option value="dropdown">dropdown</option>
            </select>
            <button className="add-btn" onClick={handleAddField}>
              Add
            </button>
          </div>
        )}
        <button type="submit" className="submit-btn">
          Submit
        </button>
        <button onClick={saveFormConfig}>Save Form Configuration</button>
        <button onClick={loadFormConfig}>Load Form Configuration</button>
      </form>
    </div>
  );
}
export default DynamicForm;
