import {
  FormSchemaElement,
  FormSchemaInput,
  FormItem,
  FormSchemaSection,
  FormSchemaButton,
  CustomRenderFunction,
  FormSchema,
  FormElement,
} from "./types";
import { appendKey, notNullFilter } from "./utils";
import JSONForm from "./JSONForm";
import { TYPES } from "./constants";

class FormRenderer {
  static customRenderers: { [key: string]: CustomRenderFunction } = {};

  static async render(
    formSchema: FormSchema,
    form: JSONForm
  ): Promise<FormElement[]> {
    const elements = await Promise.all(
      formSchema.elements.map((elem) => this.renderElement(elem, "", form))
    );
    return elements.filter(notNullFilter);
  }

  static async renderElement(
    element: FormSchemaElement,
    parentKey: string,
    form: JSONForm
  ): Promise<FormElement | null> {
    const key = appendKey(parentKey, element.key);
    if (!form.getStateForKey(key)) {
      return null;
    }
    switch (element.type) {
      case TYPES.INPUT:
        return this.renderInput(element as FormSchemaInput, parentKey, form);
      case TYPES.SECTION:
        return this.renderSection(
          element as FormSchemaSection,
          parentKey,
          form
        );
      case TYPES.BUTTON:
        return await this.renderButton(
          element as FormSchemaButton,
          parentKey,
          form
        );
    }
    if (element.type in this.customRenderers) {
      return this.renderCustom(element, parentKey, form);
    }
    return null;
  }

  static renderInput(
    element: FormSchemaInput,
    parentKey: string,
    form: JSONForm
  ): FormItem | null {
    if (!element.input?.type) {
      return null;
    }

    const newKey = appendKey(parentKey, element.key);
    const state = form.getStateForKey(newKey);

    return {
      key: newKey,
      schemaElement: element,
      value: state.value,
      form,
    };
  }

  static async renderSection(
    section: FormSchemaSection,
    parentKey: string,
    form: JSONForm
  ): Promise<FormItem | FormItem[]> {
    const children = section.children;
    let childrenInstances: FormSchemaElement[] = [];
    const newKey = appendKey(parentKey, section.key);

    if (section.many) {
      const sections: FormItem[] = [];
      const state = form.getStateForKey(newKey);
      if (state) {
        const len = (state as any[]).length;

        for (let i = 0; i < len; i++) {
          const keyWithIndex = appendKey(newKey, `[${i}]`);
          if (children) {
            childrenInstances = children;
            if (len === 1) {
              childrenInstances = childrenInstances.filter((child) => {
                if (child.type !== "Button") {
                  return true;
                }
                return (child as FormSchemaButton).role !== "RemoveSection";
              });
            }
            if (i < len - 1) {
              childrenInstances = childrenInstances.filter((child) => {
                if (child.type !== "Button") {
                  return true;
                }
                return (child as FormSchemaButton).role !== "AddSection";
              });
            }
          }
          const childrenElements = await Promise.all(
            childrenInstances.map((child) =>
              this.renderElement(child, keyWithIndex, form)
            )
          );
          sections.push({
            key: keyWithIndex,
            children: childrenElements.filter(notNullFilter),
            schemaElement: section,
            form,
          });
        }
      }

      return sections;
    } else {
      const childrenElements = await Promise.all(
        children.map((child) => this.renderElement(child, newKey, form))
      );
      return {
        key: newKey,
        schemaElement: section,
        children: childrenElements.filter(notNullFilter),
        form,
      };
    }
  }

  static addCustomRenderer(type: string, renderFn: CustomRenderFunction) {
    this.customRenderers[type] = renderFn;
  }

  static removeCustomRenderer(type: string) {
    delete this.customRenderers[type];
  }

  static async renderCustom(
    element: FormSchemaElement,
    parentKey: string,
    form: JSONForm
  ): Promise<FormElement> {
    const state = form.getStateForKey(appendKey(parentKey, element.key));
    return this.customRenderers[element.type](element, parentKey, form, state);
  }

  static async renderButton(
    element: FormSchemaButton,
    parentKey: string,
    form: JSONForm
  ): Promise<FormItem> {
    const newKey = appendKey(parentKey, element.key);

    return {
      key: newKey,
      schemaElement: element,
      form,
    };
  }
}

export default FormRenderer;
