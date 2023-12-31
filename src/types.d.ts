import JSONForm from ".";

export type FormSchemaElement =
  | FormSchemaInput
  | FormSchemaSection
  | FormSchemaButton
  | FormSchemaCommon;

export interface FormSchemaCommon {
  key: string;
  type: string;
  visible?: boolean;
  required?: boolean;
  conditions?: FormCondition[];
  label?: string;
  style?: any;
}

export interface FormSchema {
  elements: FormSchemaElement[];
  formType: "Default" | "Wizard";
}

export type FormSchemaSection = {
  many: boolean;
  children: FormSchemaElement[];
} & FormSchemaCommon;

export type FormSchemaInput = {
  input: {
    type: "Text" | "Date" | "Time" | "DateTime" | "Select" | "RadioButton";
    multiple?: boolean;
    choices?: string[] | EnumChoice[];
  };
  readonly?: boolean;
} & FormSchemaCommon;

export type FormSchemaButton = {
  role: "AddSection" | "RemoveSection" | "NextSection" | "PreviousSection";
} & FormSchemaCommon;

export interface FormItem {
  key: string;
  value?: any;
  schemaElement: FormSchemaElement;
  children?: FormElement[];
  form: JSONForm;
  required?: boolean;
}

export type CustomRenderFunction = (
  element: FormSchemaElement,
  parentKey: string,
  state: JSONForm,
  defaultState: FormItemState
) => Promise<FormElement>;

export type FormElement = FormItem[] | FormItem;

export type onRenderChangeFn = (render: FormElement[]) => void;

export interface FormCondition {
  action: "Visible" | "Required" | "Not Visible" | "Not Required";
  when: string;
}

export interface FormItemState {
  required: boolean;
  value: any;
  schema: FormSchemaElement;
}

export type FormState = { [key: string]: FormState } | FormItemState;

export interface FormConditionsResult {
  visible: boolean;
  required: boolean;
}

export interface EnumChoice {
  label: string;
  value: string;
}
