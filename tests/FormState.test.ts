import FormState from "@/FormState";
import FormConditions from "@/FormConditions";
import { FormSchemaInput, FormSchemaSection } from "@/types";

let evaluateMock = jest.spyOn(FormConditions, "evaluate");

afterAll(() => {
  evaluateMock.mockClear();
  evaluateMock.mockReset();
  evaluateMock.mockRestore();
});

it("calls form conditions evaluate when updating", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
  };

  const state = new FormState({ elements: [inputSchema], formType: "Default" });
  evaluateMock.mockResolvedValueOnce({ visible: true, required: false });
  await state.update();

  expect(evaluateMock).toHaveBeenCalled();
});

it("updates state with input schema key", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
  };

  const state = new FormState({ elements: [inputSchema], formType: "Default" });
  evaluateMock.mockResolvedValueOnce({ visible: true, required: false });
  await state.update();

  expect(state.get("test")).not.toBe(undefined);
});

it("updates state with input schema data", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
  };

  const state = new FormState({ elements: [inputSchema], formType: "Default" });
  evaluateMock.mockResolvedValueOnce({ visible: true, required: false });
  await state.update();

  const expected = {
    required: false,
    schema: inputSchema,
  };

  expect(state.get("test")).toEqual(expected);
});

it("updates state with input schema data and required flag", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
    required: true,
  };

  const state = new FormState({ elements: [inputSchema], formType: "Default" });
  evaluateMock.mockResolvedValueOnce({ visible: true, required: true });
  await state.update();

  const expected = {
    required: true,
    schema: inputSchema,
  };

  expect(state.get("test")).toEqual(expected);
});

it("updates state with single section schema key", async () => {
  const sectionSchema: FormSchemaSection = {
    key: "test",
    type: "Section",
    many: false,
    children: [],
  };

  const state = new FormState({
    elements: [sectionSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ visible: true, required: false });
  await state.update();

  expect(state.get("test")).not.toBe(undefined);
});

it("updates state with single section schema data", async () => {
  const sectionSchema: FormSchemaSection = {
    key: "test",
    type: "Section",
    many: false,
    children: [],
  };

  const state = new FormState({
    elements: [sectionSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ visible: true, required: false });
  await state.update();

  const expected = {
    schema: sectionSchema,
  };

  expect(state.get("test")).toEqual(expected);
});

it("updates state with many section schema key", async () => {
  const sectionSchema: FormSchemaSection = {
    key: "test",
    type: "Section",
    many: true,
    children: [],
  };

  const state = new FormState({
    elements: [sectionSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ visible: true, required: false });
  await state.update();

  expect(state.get("test[0]")).not.toBe(undefined);
});

it("updates state with many section schema data", async () => {
  const sectionSchema: FormSchemaSection = {
    key: "test",
    type: "Section",
    many: true,
    children: [],
  };

  const state = new FormState({
    elements: [sectionSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ visible: true, required: false });
  await state.update();

  const expected = {
    schema: sectionSchema,
  };

  expect(state.get("test[0]")).toEqual(expected);
});

it("updates state with single section schema data recursive", async () => {
  const inputSchema: FormSchemaInput = {
    key: "input",
    input: {
      type: "Text",
    },
    type: "Input",
    required: true,
  };
  const sectionSchema: FormSchemaSection = {
    key: "test",
    type: "Section",
    many: false,
    children: [inputSchema],
  };

  const state = new FormState({
    elements: [sectionSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ required: false, visible: true });
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  await state.update();

  const expected = {
    schema: inputSchema,
    required: true,
  };

  expect(state.get("test.input")).toEqual(expected);
});

it("updates state with many section schema data recursive", async () => {
  const inputSchema: FormSchemaInput = {
    key: "input",
    input: {
      type: "Text",
    },
    type: "Input",
    required: true,
  };
  const sectionSchema: FormSchemaSection = {
    key: "test",
    type: "Section",
    many: true,
    children: [inputSchema],
  };

  const state = new FormState({
    elements: [sectionSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ required: false, visible: true });
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  await state.update();

  const expected = {
    schema: inputSchema,
    required: true,
  };

  expect(state.get("test[0].input")).toEqual(expected);
});

it("updates input value", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
    required: true,
  };

  const state = new FormState({ elements: [inputSchema], formType: "Default" });
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  await state.update();
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  await state.changeInputValue("test", "value");

  const expected = {
    required: true,
    schema: inputSchema,
    value: "value",
  };

  expect(state.get("test")).toEqual(expected);
});

it("removes input from state when not visible", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
    required: true,
  };
  const otherInputSchema: FormSchemaInput = {
    key: "test1",
    input: {
      type: "Text",
    },
    type: "Input",
    required: true,
    conditions: [
      {
        action: "Not Visible",
        when: 'test.value = "value"',
      },
    ],
  };

  const state = new FormState({
    elements: [inputSchema, otherInputSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  await state.update();
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  evaluateMock.mockResolvedValueOnce({ required: true, visible: false });
  await state.changeInputValue("test", "value");

  expect(state.get("test1")).toBe(undefined);
});

it("removes single section from state when not visible", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
    required: true,
  };
  const sectionSchema: FormSchemaSection = {
    key: "section",
    type: "Section",
    many: false,
    children: [],
    conditions: [
      {
        action: "Not Visible",
        when: 'test.value = "value"',
      },
    ],
  };

  const state = new FormState({
    elements: [inputSchema, sectionSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  evaluateMock.mockResolvedValueOnce({ required: false, visible: true });
  await state.update();
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  evaluateMock.mockResolvedValueOnce({ required: false, visible: false });
  await state.changeInputValue("test", "value");

  expect(state.get("section")).toBe(undefined);
});

it("removes many section from state when not visible", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
    required: true,
  };
  const sectionSchema: FormSchemaSection = {
    key: "section",
    type: "Section",
    many: true,
    children: [],
    conditions: [
      {
        action: "Not Visible",
        when: 'test.value = "value"',
      },
    ],
  };

  const state = new FormState({
    elements: [inputSchema, sectionSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  evaluateMock.mockResolvedValueOnce({ required: false, visible: true });
  await state.update();
  evaluateMock.mockResolvedValueOnce({ required: true, visible: true });
  evaluateMock.mockResolvedValueOnce({ required: false, visible: false });
  await state.changeInputValue("test", "value");

  expect(state.get("section")).toBe(undefined);
});

it("adds section to many section array", async () => {
  const sectionSchema: FormSchemaSection = {
    key: "section",
    type: "Section",
    many: true,
    children: [],
  };

  const state = new FormState({
    elements: [sectionSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ required: false, visible: true });
  await state.update();
  evaluateMock.mockResolvedValueOnce({ required: false, visible: true });
  await state.addSection("section");

  const expected = [{ schema: sectionSchema }, { schema: sectionSchema }];

  expect(state.get("section")).toEqual(expected);
});

it("removes section from many section array", async () => {
  const sectionSchema: FormSchemaSection = {
    key: "section",
    type: "Section",
    many: true,
    children: [],
  };

  const state = new FormState({
    elements: [sectionSchema],
    formType: "Default",
  });
  evaluateMock.mockResolvedValueOnce({ required: false, visible: true });
  await state.update();
  evaluateMock.mockResolvedValueOnce({ required: false, visible: true });
  await state.addSection("section");
  state.removeSection("section", 1);

  const expected = [{ schema: sectionSchema }];

  expect(state.get("section")).toEqual(expected);
});

it("removes section from many section array at correct index", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
  };
  const sectionSchema: FormSchemaSection = {
    key: "section",
    type: "Section",
    many: true,
    children: [inputSchema],
  };

  evaluateMock.mockResolvedValue({ required: false, visible: true });
  const state = new FormState({
    elements: [sectionSchema],
    formType: "Default",
  });
  await state.update();
  await state.addSection("section");
  await state.addSection("section");
  await state.changeInputValue("section[0].test", 0);
  await state.changeInputValue("section[1].test", 1);
  await state.changeInputValue("section[2].test", 2);
  state.removeSection("section", 1);

  const expected = [
    {
      schema: sectionSchema,
      test: {
        value: 0,
        required: false,
        schema: inputSchema,
      },
    },
    {
      schema: sectionSchema,
      test: {
        value: 2,
        required: false,
        schema: inputSchema,
      },
    },
  ];

  expect(state.get("section")).toEqual(expected);
});

it("gets data recursively", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
  };
  const otherInputSchema: FormSchemaInput = {
    key: "test_other",
    input: {
      type: "Text",
    },
    type: "Input",
  };
  const sectionSchema: FormSchemaSection = {
    key: "section",
    type: "Section",
    many: false,
    children: [inputSchema],
  };

  evaluateMock.mockResolvedValue({ required: false, visible: true });

  const state = new FormState({
    elements: [sectionSchema, otherInputSchema],
    formType: "Default",
  });
  await state.update();
  await state.changeInputValue("section.test", "test");
  await state.changeInputValue("test_other", "test");

  const expected = {
    section: {
      test: "test",
    },
    test_other: "test",
  };

  expect(state.getData()).toEqual(expected);
});

it("filters null and undefined in arrays when getData", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
  };
  const sectionSchema: FormSchemaSection = {
    key: "section",
    type: "Section",
    many: true,
    children: [inputSchema],
  };

  evaluateMock.mockResolvedValue({ required: false, visible: true });

  const state = new FormState({
    elements: [sectionSchema],
    formType: "Default",
  });
  await state.update();
  await state.changeInputValue("section[0].test", "test");
  await state.changeInputValue("section[2].test", "test");

  const expected = {
    section: [
      {
        test: "test",
      },
      {
        test: "test",
      },
    ],
  };

  expect(state.getData()).toEqual(expected);
});

it("gets data using Jsonata", async () => {
  const inputSchema: FormSchemaInput = {
    key: "test",
    input: {
      type: "Text",
    },
    type: "Input",
  };

  evaluateMock.mockResolvedValue({ required: false, visible: true });

  const state = new FormState({ elements: [inputSchema], formType: "Default" });
  await state.update();

  const expected = {
    schema: inputSchema,
    required: false,
  };

  expect(await state.getWithJsonata("test")).toEqual(expected);
});
