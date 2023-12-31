import { FormElement, FormSchema, onRenderChangeFn } from "./types";
import FormState from "./FormState";
import FormRenderer from "./FormRenderer";
class JSONForm {
  private schema: FormSchema = { elements: [], formType: "Default" };
  private state!: FormState;
  private renderedForm!: FormElement[];
  private onRenderChange!: onRenderChangeFn;
  private activeSection: number = 0;

  constructor(schema: FormSchema, onRenderChange: onRenderChangeFn) {
    this.schema = schema;
    this.onRenderChange = onRenderChange;
  }

  public async addSection(sectionKey: string): Promise<void> {
    await this.state.addSection(sectionKey);
    await this.render();
  }

  public async removeSection(sectionKey: string, index: number): Promise<void> {
    this.state.removeSection(sectionKey, index);
    await this.render();
  }

  public async changeInputValue(
    inputKey: string,
    newValue: any
  ): Promise<void> {
    await this.state.changeInputValue(inputKey, newValue);
    await this.render();
  }

  public getStateForKey(key: string): any {
    return this.state.get(key);
  }

  public async init() {
    this.state = new FormState(this.schema);
    await this.state.update();
    await this.render();
  }

  public async nextSection(): Promise<void> {
    if (this.activeSection === this.schema.elements.length - 1) {
      return;
    }
    this.activeSection++;
    await this.render();
  }

  public async previousSection(): Promise<void> {
    if (this.activeSection === 0) {
      return;
    }
    this.activeSection--;
    await this.render();
  }

  private async render() {
    if (this.schema.formType === "Wizard") {
      this.renderedForm = await FormRenderer.render(
        {
          elements: [this.schema.elements[this.activeSection]],
          formType: "Default",
        },
        this
      );
    } else {
      this.renderedForm = await FormRenderer.render(this.schema, this);
    }
    this.onRenderChange(this.renderedForm);
  }

  public getData() {
    return this.state.getData();
  }
}

export default JSONForm;
