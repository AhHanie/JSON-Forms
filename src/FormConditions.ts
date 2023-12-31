import FormState from "./FormState";
import { FormConditionsResult, FormSchemaElement } from "./types";

class FormConditions {
  static async evaluate(
    element: FormSchemaElement,
    form: FormState
  ): Promise<FormConditionsResult> {
    const conditions = element.conditions;

    let visible = true;
    let required = false;

    if (element.visible !== undefined) {
      visible = element.visible;
    }
    if (element.required !== undefined) {
      required = element.required;
    }

    if (!conditions) {
      return { required, visible };
    }

    for (const condition of conditions) {
      const expressionResult = await form.getWithJsonata(condition.when);
      if (expressionResult) {
        switch (condition.action) {
          case "Not Required":
            required = false;
            break;
          case "Not Visible":
            visible = false;
            break;
          case "Required":
            required = true;
            break;
          case "Visible":
            visible = true;
            break;
        }
      }
    }
    return { required, visible };
  }
}

export default FormConditions;
