import FormRenderer from '@/FormRenderer';
import JSONForm from '@/JSONForm';
import { FormSchema, FormSchemaButton, FormSchemaElement, FormSchemaInput, FormSchemaSection } from '@/types';

const renderElement = jest.spyOn(FormRenderer, 'renderElement');
const renderCustom = jest.spyOn(FormRenderer, 'renderCustom');
const getStateForKey = jest.spyOn(JSONForm.prototype, 'getStateForKey');

beforeEach(() => {
    getStateForKey.mockClear();
    renderElement.mockClear();
    renderCustom.mockClear();
});

afterAll(() => {
    renderCustom.mockRestore();
    renderElement.mockRestore();
    getStateForKey.mockRestore();
});

it('renders input', async () => {
    const inputSchema: FormSchemaInput = {
        type: 'Input',
        key: 'test',
        input: {
            type: 'Text',
        },
    };
    const schema: FormSchema = {
        elements: [inputSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [
        {
            key: 'test',
            schemaElement: inputSchema,
            value: undefined,
            form: jsonFormMock,
        },
    ];

    expect(result).toEqual(expected);
});

it('renders button', async () => {
    const buttonSchema: FormSchemaButton = {
        type: 'Button',
        key: 'btn',
        role: 'AddSection',
    };
    const schema: FormSchema = {
        elements: [buttonSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: buttonSchema,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [
        {
            key: 'btn',
            schemaElement: buttonSchema,
            value: undefined,
            form: jsonFormMock,
        },
    ];

    expect(result).toEqual(expected);
});

it('any render calls renderElement', async () => {
    const inputSchema: FormSchemaInput = {
        type: 'Input',
        key: 'test',
        input: {
            type: 'Text',
        },
    };
    const schema: FormSchema = {
        elements: [inputSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });

    await FormRenderer.render(schema, jsonFormMock);

    expect(renderElement).toHaveBeenCalled();
});

it('calls getStateForKey when rendering', async () => {
    const inputSchema: FormSchemaInput = {
        type: 'Input',
        key: 'test',
        input: {
            type: 'Text',
        },
    };
    const schema: FormSchema = {
        elements: [inputSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    await FormRenderer.render(schema, jsonFormMock);

    expect(getStateForKey).toHaveBeenCalled();
});

it('renders single section', async () => {
    const sectionSchema: FormSchemaSection = {
        type: 'Section',
        key: 'test',
        children: [],
        many: false,
    };
    const schema: FormSchema = {
        elements: [sectionSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: sectionSchema,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [
        {
            key: 'test',
            schemaElement: sectionSchema,
            children: [],
            form: jsonFormMock,
        },
    ];

    expect(result).toEqual(expected);
});

it('renders single section with children', async () => {
    const inputSchema: FormSchemaInput = {
        type: 'Input',
        key: 'test',
        input: {
            type: 'Text',
        },
    };
    const sectionSchema: FormSchemaSection = {
        type: 'Section',
        key: 'test',
        children: [inputSchema],
        many: false,
    };
    const schema: FormSchema = {
        elements: [sectionSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: sectionSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [
        {
            key: 'test',
            schemaElement: sectionSchema,
            children: [
                {
                    key: 'test.test',
                    schemaElement: inputSchema,
                    value: undefined,
                    form: jsonFormMock,
                },
            ],
            form: jsonFormMock,
        },
    ];

    expect(result).toEqual(expected);
});

it('renders many section', async () => {
    const sectionSchema: FormSchemaSection = {
        type: 'Section',
        key: 'test',
        children: [],
        many: true,
    };
    const schema: FormSchema = {
        elements: [sectionSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
        },
    ]);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
        },
    ]);

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [
        [
            {
                key: 'test.[0]',
                schemaElement: sectionSchema,
                children: [],
                form: jsonFormMock,
            },
        ],
    ];

    expect(result).toEqual(expected);
});

it('renders many section with children', async () => {
    const inputSchema: FormSchemaInput = {
        type: 'Input',
        key: 'test',
        input: {
            type: 'Text',
        },
    };
    const sectionSchema: FormSchemaSection = {
        type: 'Section',
        key: 'test',
        children: [inputSchema],
        many: true,
    };
    const schema: FormSchema = {
        elements: [sectionSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
        },
    ]);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
        },
    ]);
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [
        [
            {
                key: 'test.[0]',
                schemaElement: sectionSchema,
                children: [
                    {
                        key: 'test.[0].test',
                        schemaElement: inputSchema,
                        value: undefined,
                        form: jsonFormMock,
                    },
                ],
                form: jsonFormMock,
            },
        ],
    ];

    expect(result).toEqual(expected);
});

it('calls renderElement when rendering single section children', async () => {
    const inputSchema: FormSchemaInput = {
        type: 'Input',
        key: 'test',
        input: {
            type: 'Text',
        },
    };
    const sectionSchema: FormSchemaSection = {
        type: 'Section',
        key: 'test',
        children: [inputSchema],
        many: false,
    };
    const schema: FormSchema = {
        elements: [sectionSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: sectionSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });

    await FormRenderer.render(schema, jsonFormMock);

    expect(renderElement).toHaveBeenCalledTimes(2);
});

it('calls renderElement when rendering many section children', async () => {
    const inputSchema: FormSchemaInput = {
        type: 'Input',
        key: 'test',
        input: {
            type: 'Text',
        },
    };
    const sectionSchema: FormSchemaSection = {
        type: 'Section',
        key: 'test',
        children: [inputSchema],
        many: true,
    };
    const schema: FormSchema = {
        elements: [sectionSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
        },
    ]);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
        },
    ]);
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });

    await FormRenderer.render(schema, jsonFormMock);

    expect(renderElement).toHaveBeenCalledTimes(2);
});

it("doesn't render remove section button if section length is 1", async () => {
    const buttonSchema: FormSchemaButton = {
        type: 'Button',
        key: 'btn',
        role: 'RemoveSection',
    };
    const sectionSchema: FormSchemaSection = {
        type: 'Section',
        key: 'section',
        children: [buttonSchema],
        many: true,
    };
    const schema: FormSchema = {
        elements: [sectionSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
            btn: {
                schemaElement: buttonSchema,
            },
        },
    ]);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
            btn: {
                schemaElement: buttonSchema,
            },
        },
    ]);
    getStateForKey.mockReturnValueOnce({
        schemaElement: buttonSchema,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [
        [
            {
                key: 'section.[0]',
                schemaElement: sectionSchema,
                children: [],
                form: jsonFormMock,
            },
        ],
    ];

    expect(result).toEqual(expected);
});

it('renders add section button in last section only', async () => {
    const buttonSchema: FormSchemaButton = {
        type: 'Button',
        key: 'btn',
        role: 'AddSection',
    };
    const sectionSchema: FormSchemaSection = {
        type: 'Section',
        key: 'section',
        children: [buttonSchema],
        many: true,
    };
    const schema: FormSchema = {
        elements: [sectionSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
            btn: {
                schemaElement: buttonSchema,
            },
        },
        {
            schemaElement: sectionSchema,
            btn: {
                schemaElement: buttonSchema,
            },
        },
    ]);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
            btn: {
                schemaElement: buttonSchema,
            },
        },
        {
            schemaElement: sectionSchema,
            btn: {
                schemaElement: buttonSchema,
            },
        },
    ]);
    getStateForKey.mockReturnValueOnce({
        schemaElement: buttonSchema,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [
        [
            {
                key: 'section.[0]',
                schemaElement: sectionSchema,
                children: [],
                form: jsonFormMock,
            },
            {
                key: 'section.[1]',
                schemaElement: sectionSchema,
                children: [
                    {
                        key: 'section.[1].btn',
                        schemaElement: buttonSchema,
                        value: undefined,
                        form: jsonFormMock,
                    },
                ],
                form: jsonFormMock,
            },
        ],
    ];

    expect(result).toEqual(expected);
});

it("doesn't render input in last section only", async () => {
    const inputSchema: FormSchemaInput = {
        type: 'Input',
        key: 'input',
        input: {
            type: 'Text',
        },
    };
    const sectionSchema: FormSchemaSection = {
        type: 'Section',
        key: 'section',
        children: [inputSchema],
        many: true,
    };
    const schema: FormSchema = {
        elements: [sectionSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
            btn: {
                schemaElement: inputSchema,
            },
        },
        {
            schemaElement: sectionSchema,
            btn: {
                schemaElement: inputSchema,
            },
        },
    ]);
    getStateForKey.mockReturnValueOnce([
        {
            schemaElement: sectionSchema,
            btn: {
                schemaElement: inputSchema,
            },
        },
        {
            schemaElement: sectionSchema,
            btn: {
                schemaElement: inputSchema,
            },
        },
    ]);
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [
        [
            {
                key: 'section.[0]',
                schemaElement: sectionSchema,
                children: [
                    {
                        key: 'section.[0].input',
                        schemaElement: inputSchema,
                        value: undefined,
                        form: jsonFormMock,
                    },
                ],
                form: jsonFormMock,
            },
            {
                key: 'section.[1]',
                schemaElement: sectionSchema,
                children: [
                    {
                        key: 'section.[1].input',
                        schemaElement: inputSchema,
                        value: undefined,
                        form: jsonFormMock,
                    },
                ],
                form: jsonFormMock,
            },
        ],
    ];

    expect(result).toEqual(expected);
});

it("doesn't render input if schema is missing input info", async () => {
    // @ts-ignore
    const inputSchema: FormSchemaInput = {
        type: 'Input',
        key: 'test',
    };
    const schema: FormSchema = {
        elements: [inputSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: inputSchema,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [];

    expect(result).toEqual(expected);
});

it('calls renderCustom when rendering custom type', async () => {
    FormRenderer.addCustomRenderer('CustomRender', async function (element, parentKey, form, state) {
        return {
            key: 't',
            schemaElement: {
                type: 'Input',
                key: 'input',
                input: {
                    type: 'Text',
                },
            },
            form,
        };
    });
    const customFormElement: FormSchemaElement = {
        type: 'CustomRender',
        key: 'custom',
    };
    const schema: FormSchema = {
        elements: [customFormElement],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: customFormElement,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    FormRenderer.removeCustomRenderer('CustomRender');

    expect(renderCustom).toHaveBeenCalled();
});

it('renders custom type', async () => {
    FormRenderer.addCustomRenderer('CustomRender', async function (element, parentKey, form, state) {
        return {
            key: 't',
            schemaElement: {
                type: 'Input',
                key: 'input',
                input: {
                    type: 'Text',
                },
            },
            form,
        };
    });
    const customFormElement: FormSchemaElement = {
        type: 'CustomRender',
        key: 'custom',
    };
    const schema: FormSchema = {
        elements: [customFormElement],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: customFormElement,
    });
    getStateForKey.mockReturnValueOnce({
        schemaElement: customFormElement,
    });
    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [
        {
            form: jsonFormMock,
            key: 't',
            schemaElement: {
                type: 'Input',
                key: 'input',
                input: {
                    type: 'Text',
                },
            },
        },
    ];

    FormRenderer.removeCustomRenderer('CustomRender');

    expect(result).toEqual(expected);
});

it("doesn't render invalid type", async () => {
    const invalidElementSchema: FormSchemaElement = {
        type: 'Invalid',
        key: 'invalid',
    };

    const schema: FormSchema = {
        elements: [invalidElementSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce({
        schemaElement: invalidElementSchema,
    });

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [];

    expect(result).toEqual(expected);
});

it('skips rendering element if key is not present in form state', async () => {
    const inputSchema: FormSchemaInput = {
        type: 'Input',
        key: 'test',
        input: {
            type: 'Text',
        },
    };
    const schema: FormSchema = {
        elements: [inputSchema],
        formType: 'Default',
    };
    const onRenderChange = jest.fn();
    const jsonFormMock = new JSONForm(schema, onRenderChange);
    getStateForKey.mockReturnValueOnce(undefined);

    const result = await FormRenderer.render(schema, jsonFormMock);

    const expected = [];

    expect(result).toEqual(expected);
});
