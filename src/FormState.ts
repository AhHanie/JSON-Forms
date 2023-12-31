import { set, get, unset } from "lodash-es";
import jsonata from "jsonata";

import {
  FormConditionsResult,
  FormSchema,
  FormSchemaElement,
  FormSchemaSection,
  FormState as FormStateType,
} from "./types";
import {
  appendKey,
  recursivleyIterate,
  notNullOrUndefinedFilter,
} from "./utils";
import FormConditions from "./FormConditions";

class FormState {
  private state: FormStateType = {};
  private schema!: FormSchema;

  constructor(schema: FormSchema) {
    this.schema = schema;
  }

  public async addSection(sectionKey: string): Promise<void> {
    const sections = get(this.state, sectionKey);
    const firstSection = sections[0];
    sections.push({
      schema: firstSection.schema,
    });
    await this.update();
  }

  public removeSection(sectionKey: string, index: number): void {
    const section = get(this.state, sectionKey);
    section.splice(index, 1);
  }

  public async changeInputValue(
    inputKey: string,
    newValue: any
  ): Promise<void> {
    set(this.state, `${inputKey}.value`, newValue);
    await this.update();
  }

  public async update(): Promise<void> {
    for (const item of this.schema.elements) {
      await this.updateRecursive(item, "");
    }
  }

  private async updateRecursive(
    item: FormSchemaElement,
    parentKey: string
  ): Promise<void> {
    const result = await FormConditions.evaluate(item, this);
    const key = appendKey(parentKey, item.key);
    if (item.type === "Section") {
      await this.updateSection(item as FormSchemaSection, key, result);
    } else {
      const existingItem = get(this.state, key);
      if (!result.visible) {
        if (existingItem) {
          unset(this.state, key);
        }
        return;
      }

      if (!existingItem) {
        set(this.state, key, {
          required: result.required,
          schema: item,
        });
        return;
      }
    }
  }

  private async updateSection(
    section: FormSchemaSection,
    key: string,
    result: FormConditionsResult
  ): Promise<void> {
    let existingSection = get(this.state, key);
    if (!result.visible) {
      if (existingSection) {
        unset(this.state, key);
      }
      return;
    }

    if (!existingSection) {
      await this.initSection(section, key);
      existingSection = get(this.state, key);
    }

    if (section.many) {
      for (let i = 0; i < existingSection.length; i++) {
        const sectionKeyWithIndex = appendKey(key, `[${i}]`);
        for (const item of section.children) {
          await this.updateRecursive(item, sectionKeyWithIndex);
        }
      }
    } else {
      for (const item of section.children) {
        await this.updateRecursive(item, key);
      }
    }
  }

  private async initSection(
    section: FormSchemaSection,
    key: string
  ): Promise<void> {
    if (section.many) {
      set(this.state, key, []);
      set(this.state, appendKey(key, "[0]"), {
        schema: section,
      });
    } else {
      set(this.state, key, { schema: section });
    }
  }

  public get(key: string) {
    return get(this.state, key);
  }

  public async getWithJsonata(expression: string): Promise<any> {
    return await jsonata(expression).evaluate(this.state);
  }

  public getData(): any {
    const data = {};
    recursivleyIterate(this.state, function (value, key, path) {
      if (key === "value") {
        set(data, path, value);
      }
    });
    recursivleyIterate(data, function (value, key, path) {
      if (Array.isArray(value)) {
        set(data, appendKey(path, key), value.filter(notNullOrUndefinedFilter));
      }
    });
    return data;
  }
}

export default FormState;
