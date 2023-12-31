import JSONForm from '@/JSONForm';
import FormState from '@/FormState';
import { FormElement, FormSchema } from '@/types';

afterEach(() => {
    jest.restoreAllMocks();
});

it('calls state add section when addSection is called', async () => {
    const formStateAddSection = jest.spyOn(FormState.prototype, 'addSection');
    const onRenderChange = jest.fn();
    const schema: FormSchema = {
        elements: [
            {
                type: 'Section',
                children: [],
                many: true,
                key: 'section',
            },
        ],
        formType: 'Default',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.init();
    await form.addSection('section');

    expect(formStateAddSection).toHaveBeenCalled();
    expect(onRenderChange).toHaveBeenCalled();
});

it('calls state remove section when removeSection is called', async () => {
    const formStateRemoveSection = jest.spyOn(FormState.prototype, 'removeSection');
    const onRenderChange = jest.fn();
    const schema: FormSchema = {
        elements: [
            {
                type: 'Section',
                children: [],
                many: true,
                key: 'section',
            },
        ],
        formType: 'Default',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.init();
    await form.removeSection('section', 0);

    expect(formStateRemoveSection).toHaveBeenCalled();
    expect(onRenderChange).toHaveBeenCalled();
});

it('calls state changeInputValue when changeInputValue is called', async () => {
    const formStateChangeInputValue = jest.spyOn(FormState.prototype, 'changeInputValue');
    const onRenderChange = jest.fn();
    const schema: FormSchema = {
        elements: [
            {
                type: 'Input',
                key: 'input',
                input: {
                    type: 'Text',
                },
            },
        ],
        formType: 'Default',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.init();
    await form.changeInputValue('input', 'text');

    expect(formStateChangeInputValue).toHaveBeenCalled();
    expect(onRenderChange).toHaveBeenCalled();
});

it('calls state get when getStateForKey is called', async () => {
    const formStateGet = jest.spyOn(FormState.prototype, 'get');
    const onRenderChange = jest.fn();
    const schema: FormSchema = {
        elements: [
            {
                type: 'Input',
                key: 'input',
                input: {
                    type: 'Text',
                },
            },
        ],
        formType: 'Default',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.init();
    form.getStateForKey('input');

    expect(formStateGet).toHaveBeenCalled();
});

it('calls state update when init is called', async () => {
    const formStateUpdate = jest.spyOn(FormState.prototype, 'update');
    const onRenderChange = jest.fn();
    const schema: FormSchema = {
        elements: [],
        formType: 'Default',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.init();

    expect(formStateUpdate).toHaveBeenCalled();
    expect(onRenderChange).toHaveBeenCalled();
});

it('calls render when nextSection is called', async () => {
    const onRenderChange = jest.fn();
    const schema: FormSchema = {
        elements: [],
        formType: 'Default',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.nextSection();

    expect(onRenderChange).toHaveBeenCalled();
});

it('calls render when previousSection is called', async () => {
    const onRenderChange = jest.fn();
    const schema: FormSchema = {
        elements: [],
        formType: 'Default',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.nextSection();
    await form.previousSection();

    expect(onRenderChange).toHaveBeenCalledTimes(2);
});

it('it moves to next section in wizard form', async () => {
    let finalRender: FormElement[] = [];
    const onRenderChange = jest.fn((render: FormElement[]) => {
        finalRender = render;
    });
    const schema: FormSchema = {
        elements: [
            {
                key: 'test',
                type: 'Section',
                many: false,
                children: [],
            },
            {
                key: 'test1',
                type: 'Section',
                many: false,
                children: [],
            },
        ],
        formType: 'Wizard',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.init();
    await form.nextSection();

    expect(onRenderChange).toHaveBeenCalled();
    expect(finalRender).toEqual([
        {
            schemaElement: {
                key: 'test1',
                type: 'Section',
                many: false,
                children: [],
            },
            key: 'test1',
            children: [],
            form,
        },
    ]);
});

it("it doesn't go out of bounds when rendering next section in wizard form", async () => {
    let finalRender: FormElement[] = [];
    const onRenderChange = jest.fn((render: FormElement[]) => {
        finalRender = render;
    });
    const schema: FormSchema = {
        elements: [
            {
                key: 'test',
                type: 'Section',
                many: false,
                children: [],
            },
            {
                key: 'test1',
                type: 'Section',
                many: false,
                children: [],
            },
        ],
        formType: 'Wizard',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.init();
    await form.nextSection();
    await form.nextSection();

    expect(onRenderChange).toHaveBeenCalled();
    expect(finalRender).toEqual([
        {
            schemaElement: {
                key: 'test1',
                type: 'Section',
                many: false,
                children: [],
            },
            key: 'test1',
            children: [],
            form,
        },
    ]);
});

it('it moves to previous section in wizard form', async () => {
    let finalRender: FormElement[] = [];
    const onRenderChange = jest.fn((render: FormElement[]) => {
        finalRender = render;
    });
    const schema: FormSchema = {
        elements: [
            {
                key: 'test',
                type: 'Section',
                many: false,
                children: [],
            },
            {
                key: 'test1',
                type: 'Section',
                many: false,
                children: [],
            },
        ],
        formType: 'Wizard',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.init();
    await form.nextSection();
    await form.previousSection();

    expect(onRenderChange).toHaveBeenCalled();
    expect(finalRender).toEqual([
        {
            schemaElement: {
                key: 'test',
                type: 'Section',
                many: false,
                children: [],
            },
            key: 'test',
            children: [],
            form,
        },
    ]);
});

it("it doesn't go out of bounds when rendering previous section in wizard form", async () => {
    let finalRender: FormElement[] = [];
    const onRenderChange = jest.fn((render: FormElement[]) => {
        finalRender = render;
    });
    const schema: FormSchema = {
        elements: [
            {
                key: 'test',
                type: 'Section',
                many: false,
                children: [],
            },
        ],
        formType: 'Wizard',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.init();
    await form.previousSection();

    expect(onRenderChange).toHaveBeenCalled();
    expect(finalRender).toEqual([
        {
            schemaElement: {
                key: 'test',
                type: 'Section',
                many: false,
                children: [],
            },
            key: 'test',
            children: [],
            form,
        },
    ]);
});

it('calls state getData when getData is called', async () => {
    const formStateGetData = jest.spyOn(FormState.prototype, 'getData');
    const onRenderChange = jest.fn();
    const schema: FormSchema = {
        elements: [
            {
                type: 'Section',
                children: [],
                many: true,
                key: 'section',
            },
        ],
        formType: 'Default',
    };
    const form = new JSONForm(schema, onRenderChange);
    await form.init();
    form.getData();
    expect(formStateGetData).toHaveBeenCalled();
});
