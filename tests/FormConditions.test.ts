import FormConditions from '@/FormConditions';
import FormState from '@/FormState';
import { FormSchema, FormSchemaElement } from '@/types';
import { mockGetWithJsonata } from '@/mocks/FormState.mock';

jest.mock('@/FormState', () => {
    const FormStateMock = require('@/mocks/FormState.mock');
    return FormStateMock.default;
});

const emptyForm: FormSchema = { elements: [], formType: 'Default' };

beforeEach(() => {
    mockGetWithJsonata.mockClear();
    mockGetWithJsonata.mockReset();
});

it("uses visibility from schema when it's present", async () => {
    const inputSchema: FormSchemaElement = {
        key: 'test',
        type: 'Input',
        input: {
            type: 'Text',
        },
        visible: false,
    };

    const state = new FormState(emptyForm);

    const result = await FormConditions.evaluate(inputSchema, state);
    expect(result.visible).toBeFalsy();
});

it("uses required from schema when it's present", async () => {
    const inputSchema: FormSchemaElement = {
        key: 'test',
        type: 'Input',
        input: {
            type: 'Text',
        },
        required: true,
    };
    const state = new FormState(emptyForm);

    const result = await FormConditions.evaluate(inputSchema, state);
    expect(result.required).toBeTruthy();
});

it('sets required to false when condition is true', async () => {
    const otherInputSchema: FormSchemaElement = {
        key: 'test1',
        type: 'Input',
        input: {
            type: 'Text',
        },
        required: true,
        conditions: [
            {
                action: 'Not Required',
                when: 'test.value = "run"',
            },
        ],
    };
    const state = new FormState(emptyForm);
    mockGetWithJsonata.mockReturnValueOnce(true);

    const result = await FormConditions.evaluate(otherInputSchema, state);

    expect(result.required).toBeFalsy();
});

it('sets required to true when condition is true', async () => {
    const otherInputSchema: FormSchemaElement = {
        key: 'test1',
        type: 'Input',
        input: {
            type: 'Text',
        },
        required: false,
        conditions: [
            {
                action: 'Required',
                when: 'test.value = "run"',
            },
        ],
    };
    const state = new FormState(emptyForm);
    mockGetWithJsonata.mockReturnValueOnce(true);

    const result = await FormConditions.evaluate(otherInputSchema, state);
    expect(result.required).toBeTruthy();
});

it('sets visible to true when condition is true', async () => {
    const otherInputSchema: FormSchemaElement = {
        key: 'test1',
        type: 'Input',
        input: {
            type: 'Text',
        },
        visible: false,
        conditions: [
            {
                action: 'Visible',
                when: 'test.value = "run"',
            },
        ],
    };
    const state = new FormState(emptyForm);
    mockGetWithJsonata.mockReturnValueOnce(true);

    const result = await FormConditions.evaluate(otherInputSchema, state);
    expect(result.visible).toBeTruthy();
});

it('sets visible to false when condition is true', async () => {
    const otherInputSchema: FormSchemaElement = {
        key: 'test1',
        type: 'Input',
        input: {
            type: 'Text',
        },
        visible: true,
        conditions: [
            {
                action: 'Not Visible',
                when: 'test.value = "run"',
            },
        ],
    };
    const state = new FormState(emptyForm);
    mockGetWithJsonata.mockReturnValueOnce(true);

    const result = await FormConditions.evaluate(otherInputSchema, state);
    expect(result.visible).toBeFalsy();
});

it('evaluates multiple conditions', async () => {
    const otherInputSchema: FormSchemaElement = {
        key: 'test1',
        type: 'Input',
        input: {
            type: 'Text',
        },
        visible: true,
        required: true,
        conditions: [
            {
                action: 'Not Visible',
                when: 'test.value = "run"',
            },
            {
                action: 'Not Required',
                when: 'test.value = "run"',
            },
        ],
    };
    const state = new FormState(emptyForm);
    mockGetWithJsonata.mockReturnValue(true);

    const result = await FormConditions.evaluate(otherInputSchema, state);
    expect(result.visible).toBeFalsy();
    expect(result.required).toBeFalsy();
});

it('calls form state getWithJsonata', async () => {
    const otherInputSchema: FormSchemaElement = {
        key: 'test1',
        type: 'Input',
        input: {
            type: 'Text',
        },
        visible: true,
        conditions: [
            {
                action: 'Not Visible',
                when: 'test.value = "run"',
            },
        ],
    };
    const state = new FormState(emptyForm);
    mockGetWithJsonata.mockReturnValueOnce(true);

    await FormConditions.evaluate(otherInputSchema, state);
    expect(mockGetWithJsonata).toHaveBeenCalled();
});
