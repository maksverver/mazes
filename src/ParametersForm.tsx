import React from 'react';
import { MazeDescription } from './maze-defs';
import { defaultParameterValues, defaultType, MazeTypeMap, mazeTypes } from './maze-types';
import './ParametersForm.css';

function mapValues<T, V1, V2>(
  obj: {[K in keyof T]: V1},
  transform: (v: V1) => V2,
): {[K in keyof T]: V2} {
  const result: {[K in keyof T]?: V2} = {};
  for (const k in obj) {
    result[k] = transform(obj[k]);
  }
  return result as {[K in keyof T]: V2};
}

function valuesToString<T>(o: T): {[k in keyof T]: string} {
  return mapValues(o,  (v) => String(v));
}

function valuesToNumber<T>(o: T): {[k in keyof T]: number} {
  return mapValues(o,  (v) => Number(v));
}

type MazeTypeSelectProps = {
  options: MazeTypeMap,
  type: string,
  onTypeChange: (value: string) => void,
};

class MazeTypeSelect extends React.Component<MazeTypeSelectProps> {
  constructor(props: MazeTypeSelectProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.onTypeChange(e.target.value);
  }

  render() {
    return (
      <select value={this.props.type} onChange={this.handleChange}>
        {Object.entries(this.props.options).map(([name, def]) =>
            <option key={name} value={name}>{def.label}</option>)}
      </select>
    );
  }
}

function Parameter(props: {label: string, children: React.ReactNode}) {
  return (
    <div className="parameter">
      <label>
        <div className="label">{props.label}</div>
        {props.children}
      </label>
    </div>
  );
}

type ParametersFormProps = {
  onChange: (type: string, parameterValues: MazeDescription) => void,
};

type ParametersFormState = {
  type: string,
  paramValues: {[name: string]: string},
};

class ParametersForm extends React.Component<ParametersFormProps, ParametersFormState> {
  constructor(props: ParametersFormProps) {
    super(props);
    const defaultValues = defaultParameterValues[defaultType];
    this.state = {
      type: defaultType,
      paramValues: valuesToString(defaultValues),
    };
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTypeChange(type: string) {
    const values = defaultParameterValues[type];
    this.props.onChange(type, values);
    this.setState({
      type: type,
      paramValues: valuesToString(values),
    });
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.onChange(this.state.type, valuesToNumber(this.state.paramValues));
  }

  handleParamChange(name: string, value: string) {
    this.setState((state) => ({paramValues: {...state.paramValues, [name]: value}}));
  }

  render() {
    const paramDefs = mazeTypes[this.state.type].parameters;
    const paramValues = this.state.paramValues;
    return (
      <form className="ParametersForm" onSubmit={this.handleSubmit}>
        <Parameter label="Type:">
          <MazeTypeSelect
              options={mazeTypes}
              type={this.state.type}
              onTypeChange={this.handleTypeChange} />
        </Parameter>
        <div id="type-specific-parameters">
        {
          Object.entries(paramDefs).map(([name, parameter]) =>
            <Parameter key={name} label={parameter.label}>
              <input
                type="number"
                value={paramValues[name]}
                onChange={e => this.handleParamChange(name, e.target.value)}
                min={parameter.minValue}
                max={parameter.maxValue}
                required/>
            </Parameter>)
        }
      </div>
        <Parameter label="">
          <button>Generate</button>
        </Parameter>
      </form>
    );
  }
}

export default ParametersForm;
